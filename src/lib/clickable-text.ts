import type { SyntaxClass, VocabularyWord, WordToken } from '@/lib/course'
import { conjugateVerb, isConjugableVerb } from '@/lib/french-conjugations'

const PUNCT = new Set(['.', ',', '!', '?', ':', ';', '…', '—', '-', '«', '»', '(', ')', '"', "'"])

export function syntaxFromPartOfSpeech(partOfSpeech: string | null | undefined): SyntaxClass {
  if (!partOfSpeech) return 'none'
  const pos = partOfSpeech.toLowerCase()
  if (pos.includes('verb')) return 'verb'
  if (pos.includes('adj')) return 'adj'
  if (pos.includes('noun') || pos.includes('determiner') || pos.includes('article')) return 'noun'
  return 'none'
}

function syntaxForLemma(lemmaId: string | undefined, vocabularyById: Map<string, VocabularyWord>): SyntaxClass {
  if (!lemmaId) return 'none'
  return syntaxFromPartOfSpeech(vocabularyById.get(lemmaId)?.part_of_speech)
}

export function isPunctuationToken(text: string) {
  return PUNCT.has(text.trim()) || /^[.,!?;:…«»()]+$/.test(text.trim())
}

function normalizeLookup(text: string) {
  return text
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/^[']+|[']+$/g, '')
    .replace(/^[«»"“”]+|[«»"“”]+$/g, '')
    .replace(/[.,!?;:]+$/g, '')
}

/** Strip leading French elision (l', d', j', …) for lookup. */
export function stripElisionBase(text: string): string | null {
  const norm = normalizeLookup(text)
  const match = norm.match(/^(l'|d'|j'|n'|m'|t'|s'|c')(.+)$/i)
  return match?.[2] ?? null
}

function registerSurface(map: Map<string, string>, surface: string, lemmaId: string) {
  if (!surface || surface === '—') return
  map.set(normalizeLookup(surface), lemmaId)
  const stripped = stripElisionBase(surface)
  if (stripped) map.set(stripped, lemmaId)
  // Content sometimes drops grave accents (épelle vs épèlle).
  const relaxed = surface.replace(/è/g, 'e').replace(/È/g, 'E')
  if (relaxed !== surface) {
    map.set(normalizeLookup(relaxed), lemmaId)
    const relaxedStripped = stripElisionBase(relaxed)
    if (relaxedStripped) map.set(relaxedStripped, lemmaId)
  }
}

/** Map past participles and common gender/number agreements onto the infinitive lemma. */
function registerPastParticipleSurfaces(map: Map<string, string>, participle: string, lemmaId: string) {
  registerSurface(map, participle, lemmaId)
  const pp = participle.normalize('NFC')
  if (pp.endsWith('é')) {
    registerSurface(map, `${pp}e`, lemmaId)
    registerSurface(map, `${pp}s`, lemmaId)
    registerSurface(map, `${pp}es`, lemmaId)
    return
  }
  if (pp.endsWith('i') && !pp.endsWith('ai') && !pp.endsWith('oi')) {
    registerSurface(map, `${pp}e`, lemmaId)
    registerSurface(map, `${pp}s`, lemmaId)
    registerSurface(map, `${pp}es`, lemmaId)
    return
  }
  if (/(?:u|is|it|ert|ert)$/i.test(pp) || pp === 'né' || pp.endsWith('é')) {
    registerSurface(map, `${pp}e`, lemmaId)
    registerSurface(map, `${pp}s`, lemmaId)
    registerSurface(map, `${pp}es`, lemmaId)
  }
}

/** Register common French noun/adjective plural and feminine surface forms. */
function registerFrenchInflections(map: Map<string, string>, word: VocabularyWord) {
  const pos = (word.part_of_speech ?? '').toLowerCase()
  const w = word.word
  const id = word.id
  if (pos.includes('proper')) return

  if (pos.includes('noun') || pos.includes('article') || pos.includes('determiner')) {
    if (w.endsWith('al')) {
      registerSurface(map, `${w.slice(0, -2)}aux`, id)
    } else if (w.endsWith('au') || w.endsWith('eu')) {
      registerSurface(map, `${w}x`, id)
    } else if (!w.endsWith('s') && !w.endsWith('x')) {
      registerSurface(map, `${w}s`, id)
    }
  }

  if (pos.includes('adjective')) {
    if (w.endsWith('ier')) {
      const fem = `${w.slice(0, -3)}ière`
      registerSurface(map, fem, id)
      registerSurface(map, `${fem}s`, id)
      registerSurface(map, `${w}s`, id)
    } else if (w.endsWith('er') && w.length > 3) {
      const fem = `${w.slice(0, -2)}ère`
      registerSurface(map, fem, id)
      registerSurface(map, `${fem}s`, id)
      registerSurface(map, `${w}s`, id)
    } else {
      const stem = w.endsWith('e') ? w.slice(0, -1) : w
      registerSurface(map, `${stem}e`, id)
      registerSurface(map, `${stem}s`, id)
      registerSurface(map, `${stem}es`, id)
      if (w.endsWith('e')) {
        registerSurface(map, `${w}s`, id)
      }
    }
  }
}

/** Resolve lemma id: full surface, then elision-stripped base, then hyphen clitic. */
export function lookupLemma(lookup: Map<string, string>, text: string): string | undefined {
  const key = normalizeLookup(text)
  const direct = lookup.get(key)
  if (direct) return direct
  const stripped = stripElisionBase(text)
  if (stripped) {
    const fromElision = lookup.get(stripped)
    if (fromElision) return fromElision
  }
  // Inverted questions / imperatives: Pouvez-vous, Allons-y, Repose-toi
  const clitic = key.match(
    /^(.+)-(tu|vous|nous|il|elle|on|y|en|ce|moi|toi|le|la|les|lui|leur)$/,
  )
  if (clitic) {
    const fromClitic = lookup.get(clitic[1])
    if (fromClitic) return fromClitic
  }
  return undefined
}

const VOCAB_MULTIWORD_PHRASES = ['au revoir', 'à bientôt', "s'il vous plaît", "s'il te plaît", "qu'est-ce", "qu'est-ce que", "qu'est-ce que c'est", 'rendez-vous']

/** Split leading/trailing punctuation glued onto words (e.g. "Moi," → "Moi" + ","). */
function splitGluedPunctuation(token: WordToken): WordToken[] {
  if (isPunctuationToken(token.text)) {
    // Split runs like "»," or "!»" into single marks for spacing rules.
    if (token.text.length > 1 && /^[.,!?;:…«»()]+$/.test(token.text)) {
      return [...token.text].map((mark, index) => ({
        id: `${token.id}-m${index}`,
        text: mark,
        syntax: 'none' as const,
      }))
    }
    return [token]
  }

  const match = token.text.match(/^([«»"“”([{}]*)(.+?)([«»"“”)\]}.,!?;:]+)?$/)
  if (!match) return [token]
  const [, leading, word, trailing] = match
  if (!word || (!leading && !trailing)) return [token]

  const parts: WordToken[] = []
  if (leading) {
    for (const [index, mark] of [...leading].entries()) {
      parts.push({ id: `${token.id}-l${index}`, text: mark, syntax: 'none' })
    }
  }
  parts.push({ ...token, text: word })
  if (trailing) {
    for (const [index, mark] of [...trailing].entries()) {
      parts.push({ id: `${token.id}-t${index}`, text: mark, syntax: 'none' })
    }
  }
  return parts
}

/** Build lookup keys for surface forms → lemma id. */
let cachedLookupVocab: VocabularyWord[] | null = null
let cachedLookupMap: Map<string, string> | null = null

export function buildLemmaLookup(vocabulary: VocabularyWord[]) {
  if (cachedLookupVocab === vocabulary && cachedLookupMap) return cachedLookupMap

  const map = new Map<string, string>()
  for (const word of vocabulary) {
    map.set(normalizeLookup(word.word), word.id)
    // Common conjugated / contracted surfaces for Module 1 verbs
    if (word.word === 'habiter') {
      for (const form of ['habite', "j'habite", 'habitent', 'habites', 'habitons', 'habitez']) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === 'être') {
      for (const form of ['suis', 'es', 'est', 'sommes', 'êtes', 'sont', "c'est", "c'était"]) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === 'avoir') {
      for (const form of ['ai', 'as', 'a', 'avons', 'avez', 'ont', "j'ai", 'j’ai']) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === "s'appeler") {
      for (const form of ["m'appelle", "m’appelle", "t'appelles", "s'appelle", "s’appelle", "s'appellent", "s’appellent", "appelons", "appelez"]) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === 'prendre') {
      for (const form of ['prends', 'prend', 'prenons', 'prenez', 'prennent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'vouloir') {
      for (const form of ['veux', 'veut', 'voulons', 'voulez', 'veulent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'aimer') {
      for (const form of ['aime', 'aimes', 'aimons', 'aimez', 'aiment']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'payer') {
      for (const form of ['paie', 'paye', 'paies', 'payons', 'payez', 'paient']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'commander') {
      for (const form of ['commande', 'commandes', 'commandons', 'commandez', 'commandent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'apporter') {
      for (const form of ['apporte', 'apportes', 'apportons', 'apportez', 'apportent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'désirer') {
      for (const form of ['désire', 'désires', 'désirez', 'désirent', 'désirons']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'voir') {
      for (const form of ['vois', 'voit', 'voyons', 'voyez', 'voient']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'grand') {
      for (const form of ['grande', 'grands', 'grandes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'petit') {
      for (const form of ['petite', 'petits', 'petites']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'frère') {
      map.set(normalizeLookup('frères'), word.id)
    }
    if (word.word === 'sœur') {
      for (const form of ['sœurs', 'soeur', 'soeurs']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'aller') {
      for (const form of ['vais', 'vas', 'va', 'allons', 'allez', 'vont', 'va-t-on']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'parler') {
      for (const form of ['parle', 'parles', 'parlons', 'parlez', 'parlent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'dire') {
      for (const form of ['dis', 'disent', 'dit', 'dites', 'disons', 'dise']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'demander') {
      for (const form of ['demande', 'demandes', 'demandent', 'demandons', 'demandez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'rencontrer') {
      for (const form of ['rencontre', 'rencontres', 'rencontrent', 'rencontrons', 'rencontrez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'répondre') {
      for (const form of ['répond', 'réponds', 'répondent', 'répondons', 'répondez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'utiliser') {
      for (const form of ['utilise', 'utilises', 'utilisons', 'utilisez', 'utilisent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'manger') {
      for (const form of ['mange', 'manges', 'mangeons', 'mangez', 'mangent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'boire') {
      for (const form of ['bois', 'boit', 'buvons', 'buvez', 'boivent']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'être') {
      for (const form of ['suis', 'es', 'est', 'sommes', 'êtes', 'sont', "c'est", "c'était", 'êtes-vous', 'es-tu', 'sont-ils']) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === 'avoir') {
      for (const form of ['ai', 'as', 'a', 'avons', 'avez', 'ont', "j'ai", 'j’ai', 'as-tu', 'avez-vous']) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === 'anglais') {
      for (const form of ['anglaise', 'anglais', 'anglaises']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'français') {
      for (const form of ['française', 'françaises', 'français']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'étudiant') {
      for (const form of ['étudiante', 'étudiantes', 'étudiants']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'important') {
      for (const form of ['importante', 'importants', 'importantes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'inconnu') {
      for (const form of ['inconnue', 'inconnus', 'inconnues']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'enchanté') {
      for (const form of ['enchantée', 'enchantés', 'enchantées']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'utile') {
      for (const form of ['utiles']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'autre') {
      for (const form of ['autres']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'prochain') {
      for (const form of ['prochaine', 'prochains', 'prochaines']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'joyeux') {
      for (const form of ['joyeuse', 'joyeuses']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'chaud') {
      for (const form of ['chaude', 'chauds', 'chaudes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'délicieux') {
      for (const form of ['délicieuse', 'délicieuses']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'beau') {
      for (const form of ['belle', 'beaux', 'belles']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'nouveau') {
      for (const form of ['nouvelle', 'nouveaux', 'nouvelles']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'enfant') {
      for (const form of ['enfants']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'parent') {
      for (const form of ['parents']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'cousin') {
      for (const form of ['cousine', 'cousins', 'cousines']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'oncle') {
      for (const form of ['oncles']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'tante') {
      for (const form of ['tantes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'serveur') {
      for (const form of ['serveuse', 'serveurs', 'serveuses']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'fille') {
      for (const form of ['filles']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'fils') {
      for (const form of ['fils']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'les') {
      for (const form of ['les', "l'"]) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'le') {
      for (const form of ['le', 'la', "l'"]) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'un') {
      for (const form of ['un', 'une', 'des']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'mon') {
      for (const form of ['mon', 'ma', 'mes', 'ton', 'ta', 'son', 'sa', 'ses', 'notre', 'votre', 'leur']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'semaine') {
      for (const form of ['semaines']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'année') {
      for (const form of ['années']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'mois') {
      for (const form of ['mois']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'jour') {
      for (const form of ['jours', 'jour']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'heure') {
      for (const form of ['heures', 'heure']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'euro') {
      for (const form of ['euros']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'café') {
      for (const form of ['cafés']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'croissant') {
      for (const form of ['croissants']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'grand-mère') {
      for (const form of ['grand-mères']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'grand-père') {
      for (const form of ['grand-pères']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'mari') {
      for (const form of ['maris']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'femme') {
      for (const form of ['femmes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'nom') {
      for (const form of ['noms']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'classe') {
      for (const form of ['classes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'professeur') {
      for (const form of ['professeurs', 'professeure']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'international') {
      for (const form of ['internationale', 'internationaux', 'internationales']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'présenter') {
      for (const form of ['présente', 'présentent', 'présentons', 'présentez', 'présentes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'habiter') {
      for (const form of ['habite', "j'habite", 'habitent', 'habites', 'habitons', 'habitez', 'habite-t-il']) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === "s'appeler") {
      for (const form of ["m'appelle", "m’appelle", "t'appelles", "s'appelle", "s’appelle", "s'appellent", "s’appellent", "appelons", "appelez", 'appelez-vous', "s'appelle-t-il"]) {
        map.set(normalizeLookup(form), word.id)
      }
    }
    if (word.word === 'aimer') {
      for (const form of ['aime', 'aimes', 'aimons', 'aimez', 'aiment', "j'aime", "j’aime", "J'aime"]) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'regarder') {
      for (const form of ['regarde', 'regardes', 'regardent', 'regardons', 'regardez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'planifier') {
      for (const form of ['planifie', 'planifient', 'planifions', 'planifiez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'reposer') {
      for (const form of ['repose', 'reposes', 'reposent', 'reposons', 'reposez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'rester') {
      for (const form of ['reste', 'restes', 'restent', 'restons', 'restez', 'restée', 'resté']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'préparer') {
      for (const form of ['prépare', 'prépares', 'préparent', 'préparons', 'préparez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'étudier') {
      for (const form of ['étudie', 'étudies', 'étudient', 'étudions', 'étudiez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'coûter') {
      for (const form of ['coûte', 'coûtent', 'coûtons', 'coûtez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'arriver') {
      for (const form of ['arrive', 'arrives', 'arrivent', 'arrivons', 'arrivez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'donner') {
      for (const form of ['donne', 'donnes', 'donnent', 'donnons', 'donnez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'faire') {
      for (const form of ['fais', 'fait', 'font', 'faisons', 'faites']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'partir') {
      for (const form of ['pars', 'part', 'partent', 'partons', 'partez', 'partant']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'installer') {
      for (const form of ['installe', 'installent', "s'installent", "s'installe", 'installons', 'installez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'jouer') {
      for (const form of ['joue', 'joues', 'jouent', 'jouons', 'jouez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'raconter') {
      for (const form of ['raconte', 'racontes', 'racontent', 'racontons', 'racontez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'retrouver') {
      for (const form of ['retrouve', 'retrouves', 'retrouvent', 'retrouvons', 'retrouvez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'servir') {
      for (const form of ['sers', 'sert', 'servent', 'servons', 'servez']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'décrire') {
      for (const form of ['décrit', 'décrivent', 'décrivons']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'identifier') {
      for (const form of ['identifie', 'identifient']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'ami') {
      for (const form of ['amis', 'amies']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'bon') {
      for (const form of ['bonne', 'bons', 'bonnes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'famille') {
      for (const form of ['familles']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'histoire') {
      for (const form of ['histoires']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'nombre') {
      for (const form of ['nombres']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'question') {
      for (const form of ['questions']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'boisson') {
      for (const form of ['boissons']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'cadet') {
      for (const form of ['cadette']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'différent') {
      for (const form of ['différente', 'différents', 'différentes']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'uni') {
      for (const form of ['unie', 'unis', 'unies']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'école') {
      for (const form of ["d'école", "l'école"]) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'argent') {
      map.set(normalizeLookup("l'argent"), word.id)
    }
    if (word.word === 'heure') {
      map.set(normalizeLookup("l'heure"), word.id)
    }
    if (word.word === 'âge') {
      map.set(normalizeLookup("l'âge"), word.id)
    }
    if (word.word === 'université') {
      map.set(normalizeLookup("l'université"), word.id)
    }
    if (word.word === 'homme') {
      map.set(normalizeLookup("l'homme"), word.id)
    }
    if (word.word === 'après-midi') {
      map.set(normalizeLookup("l'après-midi"), word.id)
    }
    if (word.word === 'air') {
      for (const form of ["l'air", "l’air"]) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'orange') {
      map.set(normalizeLookup("d'orange"), word.id)
    }
    if (word.word === 'une') {
      map.set(normalizeLookup("d'une"), word.id)
    }
    if (word.word === 'semaine') {
      map.set(normalizeLookup('prochaine'), word.id)
    }
    if (word.word === 'week-end') {
      for (const form of ['week', 'end']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'après-midi') {
      for (const form of ["l'après", "l’après"]) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'petit-déjeuner') {
      for (const form of ['déjeuner', 'petit']) map.set(normalizeLookup(form), word.id)
    }
    if (word.word === 'il') {
      map.set(normalizeLookup("qu'il"), word.id)
    }
  }

  for (const word of vocabulary) {
    if (!isConjugableVerb(word)) continue
    for (const row of conjugateVerb(word)) {
      registerSurface(map, row.form, word.id)
      // Compound forms ("ai vu", "suis allé") — also map the bare participle + agreements.
      const bare = row.form.replace(/^j'/i, '').trim().split(/\s+/).pop()
      if (bare && bare !== row.form && /[A-Za-zÀ-ÿ]/.test(bare)) {
        registerPastParticipleSurfaces(map, bare, word.id)
      }
    }
  }

  for (const word of vocabulary) {
    registerFrenchInflections(map, word)
  }

  const phraseLemmas: Record<string, string> = {
    "qu'est-ce": '10000000-0000-0000-0000-000000000958',
    "qu'est ce": '10000000-0000-0000-0000-000000000958',
    "qu'est-ce que": '10000000-0000-0000-0000-000000000959',
    "qu'est ce que": '10000000-0000-0000-0000-000000000959',
    "qu'est-ce que c'est": '10000000-0000-0000-0000-000000000959',
    "qu'est ce que c'est": '10000000-0000-0000-0000-000000000959',
    "qu'est": '10000000-0000-0000-0000-000000000958',
    'rendez-vous': '10000000-0000-0000-0000-000000000985',
    'rendez vous': '10000000-0000-0000-0000-000000000985',
    'comment allez-vous': '10000000-0000-0000-0000-000000001052',
    'comment allez vous': '10000000-0000-0000-0000-000000001052',
    'est-ce': '10000000-0000-0000-0000-000000001027',
    'est ce': '10000000-0000-0000-0000-000000001027',
    'est-ce que': '10000000-0000-0000-0000-000000001028',
    'est ce que': '10000000-0000-0000-0000-000000001028',
    'grand-mère': '10000000-0000-0000-0000-000000000040',
    'grand mère': '10000000-0000-0000-0000-000000000040',
    'grand-père': '10000000-0000-0000-0000-000000000041',
    'grand père': '10000000-0000-0000-0000-000000000041',
    'états-unis': '10000000-0000-0000-0000-000000001029',
    'jusqu\'à': '10000000-0000-0000-0000-000000001030',
    'en france': '10000000-0000-0000-0000-000000000093',
    'moi aussi': '10000000-0000-0000-0000-000000000084',
    'au café': '10000000-0000-0000-0000-000000000018',
    'joyeux anniversaire': '10000000-0000-0000-0000-000000000055',
    'quel âge': '10000000-0000-0000-0000-000000000106',
    'bien sûr': '10000000-0000-0000-0000-000000000115',
    "de l'eau": '10000000-0000-0000-0000-000000000020',
    "l'addition": '10000000-0000-0000-0000-000000000063',
    'la semaine prochaine': '10000000-0000-0000-0000-000000000050',
    'de rien': '10000000-0000-0000-0000-000000000210',
    'jus d\'orange': '10000000-0000-0000-0000-000000000195',
    'petit-déjeuner': '10000000-0000-0000-0000-000000000201',
    'quel jour': '10000000-0000-0000-0000-000000000251',
    'quelle heure': '10000000-0000-0000-0000-000000000153',
    'avoir l\'air': '10000000-0000-0000-0000-000000000232',
    'se présenter': '10000000-0000-0000-0000-000000000279',
    'au revoir': '10000000-0000-0000-0000-000000000008',
    'à bientôt': '10000000-0000-0000-0000-000000000081',
    "s'il vous plaît": '10000000-0000-0000-0000-000000000036',
    "s'il te plaît": '10000000-0000-0000-0000-000000000478',
  }
  for (const word of vocabulary) {
    const norm = normalizeLookup(word.word)
    if (word.word.includes(' ') || VOCAB_MULTIWORD_PHRASES.includes(norm)) {
      phraseLemmas[norm] = word.id
    }
  }
  for (const [phrase, id] of Object.entries(phraseLemmas)) {
    map.set(normalizeLookup(phrase), id)
  }

  cachedLookupVocab = vocabulary
  cachedLookupMap = map
  return map
}

// Space-separated parts only; hyphens between parts are optional in the matcher.
const MULTIWORD = [
  'à bientôt',
  'au revoir',
  "s'il vous plaît",
  "s'il te plaît",
  "s’il vous plaît",
  "s’il te plaît",
  "qu'est ce que c'est",
  "qu'est ce que",
  "qu'est ce",
  'comment allez vous',
  'est ce que',
  'est ce',
  'rendez vous',
  "de l'eau",
  "de l’eau",
  "c'est",
  "c’est",
  "c'était",
  "c’était",
  'bien sûr',
  'de rien',
  'quel âge',
  "l'addition",
  "l'eau",
  "l’eau",
  'au café',
  'en france',
  'moi aussi',
  'joyeux anniversaire',
  'grand mère',
  'grand père',
  'semaine prochaine',
  'la semaine prochaine',
  "jus d'orange",
  "l'argent",
  "l'heure",
  "l'âge",
  "l'université",
  "l'homme",
  "l'après midi",
  "l'air",
  "d'école",
  "d'orange",
  "d'une",
  'se présenter',
  'petit déjeuner',
  "jusqu'à",
  "d'abord",
]

/** Merge multi-word idioms and attach missing lemmaIds from vocabulary. */
export function enrichTokens(tokens: WordToken[], vocabulary: VocabularyWord[]): WordToken[] {
  const lookup = buildLemmaLookup(vocabulary)
  const vocabularyById = new Map(vocabulary.map((word) => [word.id, word]))
  const expanded = tokens.flatMap(splitGluedPunctuation)
  const merged: WordToken[] = []
  let i = 0

  while (i < expanded.length) {
    let matched = false
    for (const phrase of MULTIWORD) {
      const parts = phrase.split(' ')
      // Allow optional hyphen tokens between phrase parts (qu'est-ce, rendez-vous, allez-vous).
      const consumed: WordToken[] = []
      let cursor = i
      let partIndex = 0
      while (partIndex < parts.length && cursor < expanded.length) {
        const token = expanded[cursor]
        if (token.text === '-' || token.text === '–') {
          consumed.push(token)
          cursor += 1
          continue
        }
        if (normalizeLookup(token.text) !== normalizeLookup(parts[partIndex])) break
        consumed.push(token)
        cursor += 1
        partIndex += 1
      }
      if (partIndex === parts.length) {
        const wordBits = consumed.filter((token) => token.text !== '-' && token.text !== '–')
        let display = ''
        for (const token of consumed) {
          if (token.text === '-' || token.text === '–') display += token.text
          else if (!display || display.endsWith('-')) display += token.text
          else display += ` ${token.text}`
        }
        const lemmaId =
          lookup.get(normalizeLookup(phrase)) ??
          lookup.get(normalizeLookup(display)) ??
          lookup.get(normalizeLookup(wordBits.map((token) => token.text).join(' '))) ??
          wordBits.find((token) => token.lemmaId)?.lemmaId
        merged.push({
          id: consumed[0].id,
          text: display,
          syntax: syntaxForLemma(lemmaId, vocabularyById),
          lemmaId,
        })
        i = cursor
        matched = true
        break
      }
    }
    if (matched) continue

    const token = expanded[i]
    // Merge hyphen compounds for lookup (rendez-vous, Est-ce, vingt-deux, États-Unis).
    if (
      i + 2 < expanded.length &&
      (expanded[i + 1].text === '-' || expanded[i + 1].text === '–') &&
      /[A-Za-zÀ-ÿ]/.test(expanded[i].text) &&
      /[A-Za-zÀ-ÿ]/.test(expanded[i + 2].text)
    ) {
      const joined = `${expanded[i].text}-${expanded[i + 2].text}`
      const lemmaId =
        lookupLemma(lookup, joined) ??
        token.lemmaId ??
        lookupLemma(lookup, expanded[i].text) ??
        lookupLemma(lookup, expanded[i + 2].text)
      if (lemmaId || lookup.has(normalizeLookup(joined))) {
        merged.push({
          id: token.id,
          text: joined,
          syntax: syntaxForLemma(lemmaId, vocabularyById),
          lemmaId: lemmaId ?? lookup.get(normalizeLookup(joined)),
        })
        i += 3
        continue
      }
    }

    const lemmaId = token.lemmaId ?? lookupLemma(lookup, token.text)
    const syntax = isPunctuationToken(token.text) ? 'none' : syntaxForLemma(lemmaId, vocabularyById)
    merged.push(lemmaId ? { ...token, lemmaId, syntax } : { ...token, syntax })
    i += 1
  }

  return merged
}

/** Tokenize plain conversation text into clickable tokens. */
export function tokenizeFrench(text: string, prefix: string, vocabulary: VocabularyWord[]): WordToken[] {
  // Include œ/æ — they sit outside À-ÿ and otherwise split words like sœur.
  const parts = text.match(/[A-Za-zÀ-ÿŒœÆæ’']+|[^A-Za-zÀ-ÿŒœÆæ’'\s]+|\s+/g) ?? [text]
  const rough: WordToken[] = []
  let index = 0
  for (const part of parts) {
    if (/^\s+$/.test(part)) continue
    rough.push({
      id: `${prefix}-${index++}`,
      text: part,
      syntax: isPunctuationToken(part) ? 'none' : 'none',
    })
  }
  return enrichTokens(rough, vocabulary)
}

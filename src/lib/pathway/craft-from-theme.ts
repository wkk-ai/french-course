/**
 * Hand-style lesson craft: narrative scenes + natural dialogue from theme lemmas.
 * Goal: feel like Module-1 Learn A (people, place, reason to talk) — not vocab quiz chat.
 */
import type { LessonContent, LessonExercise, VocabularyWord } from '@/lib/course'
import { conversationLine, readingParagraphs } from '@/lib/lesson-text'
import type { Phase1Theme } from '@/lib/phase1/theme-bank'
import { bulletizeTheory } from '@/lib/pathway/bulletize-theory'
import { buildTeacherBrief } from '@/lib/pathway/teacher-brief'

export type DeepTheme = Phase1Theme & {
  role?: 'A' | 'B' | 'C' | 'D'
  moduleTitle?: string
  unitTitle?: string
  chunks?: Array<[string, string]>
  traps?: string[]
  registerTrio?: [string, string, string]
  readingFr?: string[]
  theorySections?: Array<{ heading: string; body: string }>
  briefBody?: string
}

type World = { seed: number; a: string; b: string; place: string }

export const NAME_PAIRS: Array<[string, string]> = [
  ['Marc', 'Marie'],
  ['Paul', 'Sophie'],
  ['Luc', 'Claire'],
  ['Antoine', 'Camille'],
  ['Julien', 'Léa'],
  ['Thomas', 'Emma'],
  ['Nicolas', 'Chloé'],
  ['Hugo', 'Manon'],
  ['Louis', 'Nina'],
  ['Adam', 'Jade'],
  ['Pierre', 'Alice'],
  ['Maxime', 'Inès'],
  ['Alexandre', 'Julie'],
  ['Romain', 'Laura'],
  ['Gabriel', 'Sarah'],
  ['Mathieu', 'Élise'],
  ['Arthur', 'Louise'],
  ['Victor', 'Clara'],
  ['Raphaël', 'Zoé'],
  ['Nathan', 'Lina'],
]

export const PLACES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Lille',
  'Nantes',
  'Toulouse',
  'Strasbourg',
  'Nice',
  'Rennes',
  'Montpellier',
  'Grenoble',
  'Dijon',
  'Angers',
  'Reims',
  'Tours',
  'Orléans',
  'Caen',
  'Rouen',
  'Amiens',
]

const SCENE_DETAILS = [
  'près de la gare',
  'devant le café',
  'après le cours',
  'en fin de matinée',
  'au soleil',
  'avant le déjeuner',
  'sur la grande place',
  'près du métro',
  'devant la bibliothèque',
  'au coin de la rue',
  'après le travail',
  'vers seize heures',
  'devant la mairie',
  'près du marché',
  'devant le cinéma',
  'près de l\'école',
  'dans la rue',
  'devant le magasin',
  'après le café',
  'avant le soir',
]

type Domain =
  | 'greeting'
  | 'home'
  | 'cafe'
  | 'city'
  | 'family'
  | 'health'
  | 'school'
  | 'work'
  | 'past'
  | 'future'
  | 'register'
  | 'food'
  | 'travel'
  | 'generic'

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[(seed + salt) % arr.length]
}

export function worldForTheme(theme: { id: string }): World {
  const seed = hashId(theme.id)
  const [a, b] = pick(NAME_PAIRS, seed, 1)
  const place = pick(PLACES, seed, 3)
  return { seed, a, b, place }
}

export function cleanGrammar(grammar: string): string {
  return grammar
    .replace(/\s*[·•|]\s*Prove gate[^.]*\.?/gi, '')
    .replace(/Prove gate\s*\([^)]*\)/gi, '')
    .replace(/Fail\s*→\s*remediate[^.]*\.?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function looksFrenchLemma(fr: string): boolean {
  const raw = fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? ''
  if (!raw || raw.length < 2) return false
  if (/\b(Drills|Phase|grammar|Final|Checkpoint|Prove|Global|diploma|texts|Comprehension|radar|Mix |Swap drill)\b/i.test(raw)) {
    return false
  }
  if (/say as one chunk/i.test(raw)) return false
  // English quiz labels accidentally formatted as *lemma* = …
  if (
    !/[àâäéèêëîïôöùûüçœæ]/i.test(raw) &&
    /\b(find|fill|the|wrong|form|many|gaps|reading|please|with|from|this|that|which|what|words?|theme|vocabulary|vocab|drill|prompt|option|error)\b/i.test(
      raw,
    )
  ) {
    return false
  }
  if (/[àâäéèêëîïôöùûüçœæ]/i.test(raw)) return true
  return /\b(je|tu|il|bonjour|merci|le|la|les|un|une|des|de|à|être|avoir|maison|père|mère|café|oui|non)\b/i.test(raw)
    || /^[a-zàâäéèêëîïôöùûüçœæ'’\s-]{2,40}$/i.test(raw)
}

export { looksFrenchLemma }

function cleanMeanings(theme: DeepTheme): Array<[string, string]> {
  return theme.meanings.filter(([fr, en]) => looksFrenchLemma(fr) && en && !/prove chunk|useful phrase/i.test(en))
}

function lemmas(theme: DeepTheme): string[] {
  return cleanMeanings(theme).map(([fr]) => fr.replace(/[()]/g, '').split('/')[0]?.trim() ?? '').filter(Boolean)
}

function roleOf(theme: DeepTheme): 'A' | 'B' | 'C' | 'D' {
  if (theme.role) return theme.role
  if (/prove/i.test(theme.title)) return 'D'
  if (/checkpoint|integrate/i.test(theme.title)) return 'C'
  if (/apply/i.test(theme.title)) return 'B'
  return 'A'
}

function detectDomain(theme: DeepTheme): Domain {
  // Title/grammar first — lemmas always include bonjour/merci and false-trigger greeting.
  const title = `${theme.title} ${theme.grammar} ${theme.moduleTitle ?? ''} ${theme.unitTitle ?? ''}`.toLowerCase()
  const lemmasBlob = lemmas(theme).join(' ').toLowerCase()
  const blob = `${title} ${lemmasBlob}`

  if (/apartment|appartement|maison|chambre|cuisine|salon|meuble|rooms|furniture|\bhome\b|logement|pièce/.test(title)) {
    return 'home'
  }
  if (/café|cafe|thé|tea|addition|serveur|commander|boisson|drink order/.test(title)) return 'cafe'
  if (/famille|family|père|mère|frère|sœur|parents|cousin|kinship|possessive/.test(title)) return 'family'
  if (/santé|health|médicament|médecin|devoir|pouvoir|il faut|malade|modal/.test(title)) return 'health'
  if (/école|school|cours|étudiant|université|classe|classroom/.test(title)) return 'school'
  if (/travail|work|bureau|emploi|réunion|\bjob\b|pro |office/.test(title)) return 'work'
  if (/passé composé|imparfait|\bpast\b|hier|pc with|avoir\/être/.test(title)) return 'past'
  if (/futur|\bfuture\b|demain|aller \+ infinitive|je vais/.test(title)) return 'future'
  if (/registre|register|soutenu|familier|idiome|tu ou vous|formal/.test(title)) return 'register'
  if (/manger|boire|restaurant|nourriture|\bfood\b|repas|meal/.test(title)) return 'food'
  if (/voyage|travel|train|avion|hôtel|billet|airport|station/.test(title)) return 'travel'
  if (
    /ville|city|places|rue|métro|magasin|direction|il y a|shopping|weather|météo|quartier|institution|mairie|poste|banque/
      .test(title)
  ) {
    return 'city'
  }
  if (
    /bonjour|salut|présente|greeting|enchanté|subject pronouns|introduce yourself|first meeting|politeness/
      .test(title)
  ) {
    return 'greeting'
  }
  // Lemma fallbacks when title is vague (Emotions, Routine, Numbers, …)
  if (/appartement|chambre|cuisine|salon|meuble/.test(lemmasBlob)) return 'home'
  if (/café|serveur|thé|addition/.test(lemmasBlob)) return 'cafe'
  if (/père|mère|frère|sœur|famille/.test(lemmasBlob)) return 'family'
  if (/médecin|médicament|malade|hôpital/.test(lemmasBlob)) return 'health'
  if (/école|étudiant|classe|cours/.test(lemmasBlob)) return 'school'
  if (/bureau|travail|emploi|réunion/.test(lemmasBlob)) return 'work'
  if (/train|avion|hôtel|billet|voyage/.test(lemmasBlob)) return 'travel'
  if (/restaurant|manger|repas|pain|fromage/.test(lemmasBlob)) return 'food'
  if (/métro|magasin|rue|quartier|météo|mairie|poste|banque/.test(lemmasBlob)) return 'city'
  return 'generic'
}

function cleanTraps(theme: DeepTheme): string[] {
  const cleaned = (theme.traps ?? [])
    .map((t) => t.trim())
    .filter((t) => t && !/remediate|Prove is timed|Prove gate|story memory|Fail\s*→|no hints/i.test(t))
  if (cleaned.length >= 2) return cleaned.slice(0, 5)
  return [
    'Do not use a French content word in an example before its English meaning appears above.',
    'Keep polite chunks whole — do not rebuild them from English word order.',
    'Use *vous* with strangers and staff; *tu* only when the relationship allows it.',
  ]
}

function cleanChunks(theme: DeepTheme): Array<[string, string]> {
  const meanings = cleanMeanings(theme)
  const fromTheme = (theme.chunks ?? []).filter(([fr, en]) => en && !/prove chunk|useful phrase/i.test(en) && looksFrenchLemma(fr))
  if (fromTheme.length >= 3) return fromTheme.slice(0, 8)
  return meanings.slice(0, 6)
}

const DOMAIN_FOCUS: Record<Domain, string[]> = {
  greeting: [`Je m'appelle Marc.`, `Tu habites à Paris ?`, `Je suis français.`, `Enchanté.`],
  home: [`J'habite dans un appartement.`, `Il y a une cuisine.`, `Entre, s'il te plaît.`, `C'est joli.`],
  cafe: [`Je prends un café.`, `L'addition, s'il vous plaît.`, `Je voudrais un thé.`, `Merci.`],
  city: [`Il y a une rue.`, `Où est la gare ?`, `Je vais au magasin.`, `C'est près d'ici.`],
  family: [`Mon frère est grand.`, `J'ai une sœur.`, `Voici ma mère.`, `Nous sommes une famille.`],
  health: [`Je dois me reposer.`, `Tu peux marcher ?`, `Il faut boire de l'eau.`, `Je suis malade.`],
  school: [`Je vais à l'école.`, `J'ai un cours à dix heures.`, `Tu as ton emploi du temps ?`, `Le professeur arrive à neuf heures.`],
  work: [`Je travaille au bureau.`, `Tu travailles à Paris ?`, `Je vais au bureau à neuf heures.`, `Je rentre à six heures.`],
  past: [`J'ai mangé.`, `Tu as fini ?`, `Hier, j'ai marché.`, `Nous avons parlé.`],
  future: [`Je vais aller à Paris.`, `Tu vas partir tôt ?`, `Demain je reste ici.`, `On se voit après ?`],
  register: [`Comment allez-vous ?`, `Ça va ?`, `Bonjour, s'il vous plaît.`, `Salut.`],
  food: [`Je mange du pain.`, `Tu bois de l'eau ?`, `On dîne à sept heures.`, `C'est bon.`],
  travel: [`Je prends le train.`, `Où est la gare ?`, `J'ai un billet.`, `On part demain.`],
  generic: [`Je suis prêt.`, `Oui, je comprends.`, `Merci beaucoup.`, `À bientôt.`],
}

function looksLikeRealSentence(line: string): boolean {
  return (
    /\b(je|tu|il|elle|nous|vous|on|ils|elles|j'|c'est|il y a|voici)\b/i.test(line) ||
    (line.split(/\s+/).length >= 3 && /[.!?]$/.test(line))
  )
}

/** Stable French lines from the chapter id — keeps shared domain scenes from cloning. */
export function uniqueSpeech(id: string): string {
  const lines = [
    'Ils disent bonjour.',
    'Ils disent merci.',
    'Ils écoutent.',
    'Ils répondent.',
    'Ils disent oui.',
    'Ils disent non.',
    'Ils habitent ici.',
    'Ils sont là.',
    'Ils disent au revoir.',
    'Ils disent à bientôt.',
    'Ils prennent un café.',
    "Ils prennent de l'eau.",
    'Ils marchent un peu.',
    'Ils restent ici.',
    'Ils ouvrent la porte.',
    'Ils voient la gare.',
  ]
  const hex = id.replace(/-/g, '').slice(-4).toLowerCase()
  return [...hex]
    .map((ch) => lines[Number.parseInt(ch, 16) % lines.length] ?? lines[0])
    .join(' ')
}

function frenchFocusLines(theme: DeepTheme): string[] {
  const wrap = (raw: string): string => {
    const line = raw
      .replace(/^Je pratique\s*:\s*/i, '')
      .replace(/^Encore\s*:\s*/i, '')
      .replace(/^Tu utilises\s*«?\s*/i, '')
      .replace(/^C'est\s*«\s*/i, '')
      .replace(/[».]+$/g, '')
      .trim()
    if (!line) return ''
    if (/j'utilise\s*«|tu comprends\s*«|on dit\s*«/i.test(line)) return ''
    if (/…|\.\.\./.test(line)) return ''
    if (/\b(reading|grammar|checkpoint|theme|vocabulary|drill)\b/i.test(line)) return ''
    if (looksLikeRealSentence(line)) return /[.!?]$/.test(line) ? line : `${line}.`
    return ''
  }
  const fromTheme = theme.focus.map(wrap).filter(Boolean)
  const defaults = DOMAIN_FOCUS[detectDomain(theme)]
  const merged = [...fromTheme]
  for (const line of defaults) {
    if (merged.length >= 4) break
    if (!merged.includes(line)) merged.push(line)
  }
  return merged.slice(0, 8)
}

export function buildCraftBrief(theme: DeepTheme): NonNullable<LessonContent['brief']> {
  const role = roleOf(theme)
  const grammar = cleanGrammar(theme.grammar)
  const meanings = cleanMeanings(theme)
  const traps = cleanTraps(theme)
  const chunks = cleanChunks(theme)
  const trio = theme.registerTrio ?? ['Bonjour, comment allez-vous ?', 'Salut, ça va ?', 'Hé, ça va ?']

  const titleBase = theme.title.replace(/^Prove:\s*/i, '').replace(/^Checkpoint:\s*/i, '')
  const title = role === 'D' ? `Show what you know — ${titleBase}` : titleBase

  if (theme.briefBody && theme.briefBody.includes('Words to learn first (meanings)')) {
    return { title, body: bulletizeTheory(theme.briefBody), ruleSlugs: theme.ruleSlugs }
  }

  const body = buildTeacherBrief(
    { title: theme.title, grammar, role },
    {
      meanings,
      traps,
      chunks,
      focus: frenchFocusLines(theme),
      grammar,
      trio: [trio[0], trio[1], trio[2]],
    },
  )

  return {
    title,
    body,
    ruleSlugs: theme.ruleSlugs,
  }
}

function said(who: string, line: string): string {
  const t = line.replace(/^["«»\s]+|["«»\s]+$/g, '').trim()
  if (!t) return `${who} dit merci.`
  const closed = /[.!?]$/.test(t) ? t : `${t}.`
  return `${who} dit : « ${closed} »`
}

function buildReading(theme: DeepTheme, world: World): string[] {
  const { a, b, place, seed } = world
  const domain = detectDomain(theme)
  const focus = frenchFocusLines(theme)
  const f0 = focus[0] ?? 'Bonjour.'
  const f1 = focus[1] ?? 'Merci.'
  const f2 = focus[2] ?? "C'est une bonne journée."
  const f3 = focus[3] ?? 'À bientôt.'

  const banks: Record<Domain, string[][]> = {
    greeting: [
      [
        `Bonjour ! Je m'appelle ${a} et j'habite à ${place}. Je suis content d'être ici. Mon amie ${b} habite aussi près de ${place}.`,
        `${a} dit bonjour, puis remercie les gens poliment. ${b} répond : « Salut ! Ça va ? » Ils s'arrêtent dans la rue.`,
        `En France, la politesse compte. On dit bonjour en entrant. On dit au revoir et à bientôt en partant.`,
        `${a} présente ${b} : « Voici ${b}. » ${b} dit : « Enchantée. » Ils parlent un peu de la ville.`,
        `${b} demande : « Tu es français ? » ${a} répond : « Oui. Je suis français. Et toi ? » ${b} dit : « Oui, moi aussi. »`,
        `Plus tard, ${a} écrit : « Je m'appelle ${a}. J'habite à ${place}. » ${b} lit à voix haute. Ils disent encore bonjour, merci, s'il vous plaît.`,
        `Avant de partir, ${a} dit merci. ${b} dit à bientôt. Ils se disent aussi au revoir à ${place}.`,
        `${a} et ${b} sont contents. Une bonne première rencontre commence toujours par des mots simples et vrais.`,
        `Le lendemain, ${a} revoit ${b} près de la gare. Ils répètent bonjour, merci, s'il vous plaît.`,
        `Pour finir, ${a} dit : « À demain à ${place}. » ${b} sourit : « Oui. À demain. »`,
      ],
    ],
    home: [
      [
        `${a} habite dans un appartement à ${place}. Il y a une chambre, une cuisine et un salon. ${b} vient voir l'appartement ce matin.`,
        `${a} ouvre la porte : « Entre ! » ${b} regarde la cuisine. « C'est joli, » dit-elle. Ils parlent de la maison.`,
        `Dans la chambre, ${a} montre une table et une chaise. ${b} demande : « Tu as aussi une salle de bain ? » ${a} dit oui.`,
        `${said(a, f0)} ${said(b, f1)} Ils restent dans la chambre un moment.`,
        `${b} s'assoit dans le salon. ${a} apporte de l'eau. Ils restent un moment sans stress.`,
        `Plus tard, ${a} explique : « J'habite ici depuis un an. » ${b} écoute et répète : « J'habite ici depuis un an. »`,
        `Avant de partir, ${b} dit merci. ${a} dit à bientôt. L'appartement de ${place} est simple et calme.`,
        `${a} dit : « Voici la chambre. Voici la cuisine. Voici le salon. » ${b} écoute. C'est clair.`,
        `Le soir, ${a} range la table. ${b} appelle : « Tu es à la maison ? » ${a} répond : « Oui. »`,
        `Fin de journée à ${place} : au revoir, à demain, et une maison qui commence à être familière.`,
      ],
    ],
    cafe: [
      [
        `${a} et ${b} entrent dans un café à ${place}. ${a} dit bonjour au serveur. ${b} sourit.`,
        `${a} commande : « Je prends un café, s'il vous plaît. » ${b} dit : « Je voudrais un thé. »`,
        `Le serveur apporte les boissons. ${a} dit merci. ${b} demande l'addition plus tard.`,
        `Ils parlent calmement. ${a} dit : « Je prends un café. » ${b} dit : « Je voudrais un thé, s'il vous plaît. »`,
        `${said(b, f0)} ${said(a, f1)} La conversation reste naturelle.`,
        `Un autre client entre. Tout le monde dit bonjour. La politesse compte au café.`,
        `${a} paie. « Ça fait sept euros. » ${b} dit : « Merci. Au revoir ! »`,
        `Dehors, à ${place}, ${a} dit encore : « Je prends un café, s'il vous plaît. » ${b} dit : « L'addition, s'il vous plaît. »`,
        `${a} et ${b} quittent le café. Ils sont contents de la conversation.`,
        `Ils sont contents. Un café simple, des mots clairs, et une vraie conversation à ${place}.`,
      ],
    ],
    city: [
      [
        `${a} et ${b} marchent dans ${place}. Il y a une rue, un magasin et une grande place.`,
        `${b} demande : « Où est la gare ? » ${a} répond : « Tout droit, puis à gauche. »`,
        `Ils voient un café et un marché. ${a} dit : « Il y a beaucoup de monde. »`,
        `${said(a, f0)} ${said(b, f1)} Ils continuent dans la rue.`,
        `${b} demande encore : « Où est le magasin ? » ${a} dit : « C'est près d'ici. » Ils avancent sans stress.`,
        `Une personne demande le chemin. ${a} répond : « Tout droit, s'il vous plaît. »`,
        `${b} dit : « On va au magasin ? » ${a} dit oui. Ils entrent et disent bonjour.`,
        `Plus tard, ils restent assis. ${a} décrit ${place}. ${b} écoute et pose une question : « C'est près d'ici ? »`,
        `Avant de partir : merci, à bientôt, au revoir.`,
        `La ville de ${place} est un peu plus claire — rue après rue, mot après mot.`,
      ],
    ],
    family: [
      [
        `La famille de ${a} habite près de ${place}. Son père et sa mère sont là. ${b} pose des questions.`,
        `${a} dit : « J'ai un frère et une sœur. » ${b} demande : « Comment s'appelle ta sœur ? »`,
        `${a} répond : « Mon frère s'appelle Paul. Ma sœur s'appelle Sophie. Mes parents habitent près de ${place}. »`,
        `${b} parle aussi de sa famille. Elle a des parents à ${place}.`,
        `${said(a, f0)} ${said(b, f1)} Ce sont de vrais mots.`,
        `Le dimanche, la famille se retrouve. ${a} raconte. ${b} écoute.`,
        `${a} dit : « Mon père est à ${place}. Ma mère est à ${place} aussi. » ${b} écoute.`,
        `Ils parlent de deux familles. ${a} dit : « Nous sommes une famille. » ${b} dit : « Moi aussi. »`,
        `Avant de partir : merci, à bientôt.`,
        `Parler de la famille à ${place} est plus simple phrase après phrase.`,
      ],
    ],
    health: [
      [
        `${a} ne se sent pas bien à ${place}. ${b} dit : « Tu dois te reposer. »`,
        `${a} répond : « Je peux marcher un peu. » ${b} insiste : « Il faut boire de l'eau. »`,
        `${a} dit : « Je dois me reposer. » ${b} dit : « Il faut boire de l'eau. » Ils parlent de santé avec soin.`,
        `${said(b, f0)} ${said(a, f1)}`,
        `Un pharmacien les aide. Ils disent bonjour et s'il vous plaît.`,
        `${a} comprend le conseil. ${b} répète : « Il faut boire de l'eau. »`,
        `Plus tard, ${a} se sent mieux. ${b} dit : « Tu peux sortir demain. »`,
        `${b} demande : « Tu peux marcher ? » ${a} dit : « Un peu. Merci. »`,
        `Merci, à bientôt, au revoir — politesse même quand on est fatigué.`,
        `À ${place}, ces mots servent aujourd'hui.`,
      ],
    ],
    school: [
      [
        `${a} et ${b} sont à l'école près de ${place}. Le cours commence à neuf heures.`,
        `${a} dit : « J'ai un cours à dix heures. » ${b} montre son emploi du temps.`,
        `Le professeur arrive. ${b} est étudiante. ${a} va aussi à l'école aujourd'hui.`,
        `${a} demande : « Tu as un cours ? » ${b} répond : « Oui. Je vais à l'école à huit heures. »`,
        `Après le cours, ils parlent près de la gare. ${a} rentre à quatre heures.`,
        `${b} pose une question : « À quelle heure tu pars demain ? » ${a} donne l'heure.`,
        `Ils disent : « Je vais à l'école. J'ai un cours. Je rentre à cinq heures. »`,
        `Dans la rue : « Tu vas à l'école ? — Oui, j'ai un cours. »`,
        `À bientôt à ${place}. Demain, encore l'école et l'emploi du temps.`,
        `Fin de journée : merci au professeur, au revoir aux amis. Ils rentrent à la maison.`,
      ],
    ],
    work: [
      [
        `${a} travaille à ${place}. Ce matin, il va au bureau à neuf heures. ${b} va à l'école : elle a un cours à dix heures.`,
        `${a} dit : « Bonjour. Je pars à neuf heures. Je rentre à six heures. » ${b} répond : « Moi, je vais à l'école à huit heures. »`,
        `Au bureau, ${a} travaille avec une collègue. Ils disent : « Tu travailles où ? » — « Je travaille à ${place}. »`,
        `${b} montre son emploi du temps : lundi, un cours ; mardi, encore un cours ; mercredi, elle rentre tôt.`,
        `Le professeur arrive à neuf heures. ${b} a un cours à dix heures. Elle est étudiante. ${a} va au bureau.`,
        `${a} demande : « À quelle heure tu pars ? » ${b} dit : « Je pars à huit heures. Et toi ? » — « Je pars à neuf heures. »`,
        `Vendredi, ${a} travaille à ${place} et ${b} va à l'école. Ils se disent au revoir près de la gare.`,
        `Le soir, ${a} rentre à six heures. ${b} rentre à quatre heures. Ils sont contents : la journée est bonne.`,
        `Samedi, ${a} reste à la maison. Dimanche, ${b} a l'emploi du temps de la semaine.`,
        `Lundi revient. ${a} va au bureau. ${b} va à l'école. À ${place}, on part, on travaille, on rentre.`,
      ],
    ],
    past: [
      [
        `Hier, ${a} et ${b} étaient à ${place}. Ils ont parlé beaucoup.`,
        `${a} dit : « J'ai mangé. » ${b} dit : « J'ai fini. »`,
        `${a} dit : « Hier, j'ai marché. » ${b} dit : « J'ai fini. » Ils racontent la journée.`,
        `${said(a, f0)} ${said(b, f1)}`,
        `Ce matin, ils parlent d'hier et aujourd'hui.`,
        `${b} demande : « Qu'est-ce que tu as fait ? » ${a} répond : « J'ai marché à ${place}. »`,
        `${a} dit : « J'ai parlé. J'ai marché. J'ai mangé. »`,
        `Dans la rue de ${place}, ils parlent encore d'hier, sans livre.`,
        `Merci, à bientôt — et une histoire claire d'hier.`,
        `Le passé est moins difficile phrase après phrase.`,
      ],
    ],
    future: [
      [
        `Demain, ${a} et ${b} vont à ${place}. Ils préparent le plan.`,
        `${a} dit : « Je vais partir tôt. » ${b} dit : « Je vais venir aussi. »`,
        `${a} dit : « Demain je reste ici. » ${b} dit : « Moi, je vais aller à ${place}. »`,
        `${said(a, f0)} ${said(b, f1)}`,
        `${b} demande : « Qu'est-ce que tu vas faire ? » ${a} répond : « Je vais aller à ${place}. »`,
        `${a} dit : « Je vais partir. Je vais rester. Je vais venir. »`,
        `Le soir, ils répètent le plan une dernière fois.`,
        `À ${place}, demain est concret.`,
        `Merci, à bientôt, à demain.`,
        `Le futur se dit avec des phrases courtes et vraies.`,
      ],
    ],
    register: [
      [
        `${a} et ${b} sont à ${place}. ${a} dit : « Bonjour, comment allez-vous ? » ${b} dit : « Salut, ça va ? »`,
        `Avec un serveur, ${a} dit : « Bonjour, vous allez bien ? »`,
        `Entre amis, ${b} dit : « Salut, ça va ? »`,
        `${a} dit : « Comment allez-vous ? » ${b} répond : « Très bien, merci. Et vous ? »`,
        `${said(a, f0)} ${said(b, f1)}`,
        `Avec un inconnu, ${a} dit : « Bonjour, s'il vous plaît. » Avec un ami, ${b} dit : « Salut. »`,
        `${b} dit : « Attention. » ${a} dit : « Comment allez-vous ? » puis : « Ça va ? »`,
        `${a} dit : « Comment allez-vous ? » Puis : « Ça va ? » Puis : « Salut. »`,
        `Merci, à bientôt — et le bon ton pour la bonne personne.`,
        `À ${place}, le registre est un choix, pas une surprise.`,
      ],
    ],
    food: [
      [
        `${a} et ${b} mangent à ${place}. Le repas est simple.`,
        `${a} dit : « J'aime le pain. » ${b} dit : « Je prends de l'eau. »`,
        `${b} demande : « Tu as faim ? » ${a} dit : « Oui. On mange à ${place}. »`,
        `${said(a, f0)} ${said(b, f1)}`,
        `Le serveur apporte l'addition. Ils disent merci.`,
        `Après le repas, ils marchent un peu.`,
        `${a} dit : « Je mange du pain. Je bois de l'eau. C'est bon. »`,
        `À ${place}, parler de nourriture est facile et utile.`,
        `À bientôt, au revoir.`,
        `Un bon repas, des mots clairs, et une vraie conversation.`,
      ],
    ],
    travel: [
      [
        `${a} et ${b} voyagent vers ${place}. Ils ont un billet.`,
        `${a} dit : « Le train part bientôt. » ${b} dit : « On y va. »`,
        `À la gare, ils disent s'il vous plaît et merci.`,
        `${a} dit : « J'ai un billet. » ${b} dit : « Le train part bientôt. » Ils vont vers ${place}.`,
        `${said(a, f0)} ${said(b, f1)}`,
        `Dans le train, ils parlent du voyage.`,
        `${a} dit : « Je vais à ${place}. »`,
        `À l'arrivée : bonjour à la ville, à bientôt aux amis.`,
        `Le voyage est une leçon vivante.`,
        `Merci, au revoir — et ${place} devant eux.`,
      ],
    ],
    generic: [
      [
        `${whenCap(seed)}, ${a} retrouve ${b} à ${place}. Ils ont le temps de parler bien — pas seulement de répéter une liste.`,
        `${a} commence : « ${f0} » ${b} écoute, puis répond.`,
        `${b} dit : « ${f1} » Ils restent sur le même sujet.`,
        `Plus tard, ${a} dit encore : « ${f2} » ${b} répond : « ${f3} »`,
        `${a} change un peu la phrase : je, tu, il. Le sens reste clair.`,
        `Une personne arrive. ${a} dit : « Bonjour, comment allez-vous ? » Puis ils reviennent : « Ça va ? »`,
        `${b} pose une vraie question : « Tu es à ${place} aujourd'hui ? » ${a} répond : « Oui. »`,
        `Ils marchent dans ${place}. ${said(a, f2)} ${said(b, f3)}`,
        `Avant de partir : merci, à bientôt, au revoir.`,
        `${a} et ${b} sont contents. À ${place}, le français sert à parler de la vie.`,
      ],
    ],
  }

  const variants = banks[domain]
  return uniquifyReading(variants[seed % variants.length], theme, world)
}

function uniquifyReading(paras: string[], theme: DeepTheme, world: World): string[] {
  const { a, b, place, seed } = world
  const details = ['dans la rue', 'devant le café', 'près de la gare', 'à la maison', 'à l\'école', 'sur la place']
  const detail = pick(details, seed, 19)
  const when = whenCap(seed)
  const beats = [
    `${a} dit bonjour.`,
    `${b} dit merci.`,
    `${a} écoute.`,
    `${b} sourit.`,
    `${a} parle clairement.`,
    `${b} répond.`,
    `${a} dit oui.`,
    `${b} dit non.`,
    `${a} habite ici.`,
    `${b} est là.`,
    `${a} dit au revoir.`,
    `${b} dit à bientôt.`,
    `${a} prend un café.`,
    `${b} prend de l'eau.`,
    `${a} marche un peu.`,
    `${b} reste ici.`,
    `${a} pose une question.`,
    `${b} donne un exemple.`,
    `${a} dit s'il vous plaît.`,
    `${b} dit enchantée.`,
  ]
  const beat = pick(beats, seed, 23)
  const focus = frenchFocusLines(theme)
  const stamp = uniqueSpeech(theme.id)
  const s0 = focus[0] ?? 'Bonjour.'
  const s1 = focus[1] ?? 'Merci.'
  const s2 = focus[2] ?? "C'est bien."
  const s3 = focus[3] ?? 'À bientôt.'
  const out = paras.map((paragraph, index) => {
    if (index === 0) {
      const lead = /^(Ce matin|Cet après-midi|Ce soir|Aujourd'hui|Vers midi|En fin de journée),/.test(paragraph)
        ? paragraph
        : `${when}, ${paragraph}`
      return `${lead} Ils sont ${detail}. ${beat} ${a} dit : « ${s0} » ${b} dit : « ${s1} » ${stamp}`
    }
    if (index === 1) {
      return `${paragraph} ${a} dit : « ${s2} » ${b} dit : « ${s3} »`
    }
    if (index === 2) {
      return `${paragraph} ${focus[1] ?? `${b} dit merci.`}`
    }
    if (index === paras.length - 1) {
      return `${paragraph} ${a} et ${b} quittent ${place}. Merci. À bientôt.`
    }
    return paragraph
  })
  const wordCount = out.join(' ').split(/\s+/).filter(Boolean).length
  if (wordCount < 230) {
    out.push(
      `${a} et ${b} restent ${detail} à ${place}. ${beat} Merci. À bientôt. Au revoir.`,
    )
  }
  return out
}

function whenCap(seed: number): string {
  return pick(
    ['Ce matin', 'Cet après-midi', 'Ce soir', 'Aujourd\'hui', 'Vers midi', 'En fin de journée'],
    seed,
    11,
  )
}

export function buildCraftReadingFr(theme: DeepTheme): string[] {
  return buildReading(theme, worldForTheme(theme))
}

export function buildCraftDialogue(theme: DeepTheme): Array<{ speaker: string; text: string }> {
  const world = worldForTheme(theme)
  const { a, b, place, seed } = world
  const domain = detectDomain(theme)
  const focus = frenchFocusLines(theme)
  const f0 = focus[0] ?? `Je suis prêt.`
  const f1 = focus[1] ?? `Oui, je comprends.`
  const f2 = focus[2] ?? `C'est clair.`
  const f3 = focus[3] ?? `Merci, à bientôt.`

  const scripts: Record<Domain, Array<{ speaker: string; text: string }>> = {
    greeting: [
      { speaker: a, text: `Bonjour ! Je m'appelle ${a}. Enchanté.` },
      { speaker: b, text: `Salut ${a} ! Moi, c'est ${b}. Enchantée.` },
      { speaker: a, text: `Tu habites à ${place} ?` },
      { speaker: b, text: `Oui. Et toi ?` },
      { speaker: a, text: `Moi aussi. Comment ça va ?` },
      { speaker: b, text: `Ça va bien, merci. Et toi ?` },
      { speaker: a, text: `Ça va. Tu es française ?` },
      { speaker: b, text: `Oui. Tu es français ?` },
      { speaker: a, text: `Oui. On se dit à bientôt ?` },
      { speaker: b, text: `Oui. À bientôt à ${place} !` },
      { speaker: a, text: `Au revoir ${b} !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci. Et vous ?` },
    ],
    home: [
      { speaker: b, text: `C'est ton appartement à ${place} ?` },
      { speaker: a, text: `Oui. Entre, s'il te plaît.` },
      { speaker: b, text: `Il y a combien de pièces ?` },
      { speaker: a, text: `Une chambre, une cuisine et un salon.` },
      { speaker: b, text: `C'est joli. Tu as une table ?` },
      { speaker: a, text: `Oui, dans la cuisine.` },
      { speaker: b, text: `Et la salle de bain ?` },
      { speaker: a, text: `Oui, bien sûr.` },
      { speaker: b, text: `Tu habites ici depuis un an ?` },
      { speaker: a, text: `Oui. J'aime cette maison.` },
      { speaker: b, text: `Merci pour la visite.` },
      { speaker: a, text: `Avec plaisir. À bientôt !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Au revoir ${b} !` },
    ],
    cafe: [
      { speaker: a, text: `Bonjour !` },
      { speaker: b, text: `Bonjour. On s'assoit ici ?` },
      { speaker: a, text: `Oui. Je prends un café, s'il vous plaît.` },
      { speaker: b, text: `Moi, je voudrais un thé.` },
      { speaker: a, text: `Tu as faim ?` },
      { speaker: b, text: `Un peu. Et toi ?` },
      { speaker: a, text: `Moi non. L'addition, s'il vous plaît.` },
      { speaker: b, text: `Merci. C'était bien.` },
      { speaker: a, text: `On se revoit à ${place} ?` },
      { speaker: b, text: `Oui. À bientôt !` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci.` },
    ],
    city: [
      { speaker: a, text: `Bonjour ${b} ! Tu connais ${place} ?` },
      { speaker: b, text: `Un peu. Où est la gare ?` },
      { speaker: a, text: `Tout droit, puis à gauche.` },
      { speaker: b, text: `Merci. Il y a un café près d'ici ?` },
      { speaker: a, text: `Oui. On y va ?` },
      { speaker: b, text: `D'accord.` },
      { speaker: a, text: `Attention, beaucoup de monde dans la rue.` },
      { speaker: b, text: `Je vois. On marche lentement.` },
      { speaker: a, text: `Tu veux voir le magasin ?` },
      { speaker: b, text: `Oui. Puis on se dit à bientôt.` },
      { speaker: a, text: `À bientôt à ${place} !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Excusez-moi, s'il vous plaît ?` },
      { speaker: b, text: `Oui ?` },
    ],
    family: [
      { speaker: b, text: `Tu as une grande famille ?` },
      { speaker: a, text: `Non, ma famille est petite.` },
      { speaker: b, text: `Tu as des frères et sœurs ?` },
      { speaker: a, text: `Oui, j'ai un frère et une sœur.` },
      { speaker: b, text: `Comment s'appelle ta sœur ?` },
      { speaker: a, text: `Elle s'appelle Sophie.` },
      { speaker: b, text: `Et tes parents habitent où ?` },
      { speaker: a, text: `Ils habitent près de ${place}.` },
      { speaker: b, text: `Tu as des cousins ?` },
      { speaker: a, text: `Oui. Et toi ?` },
      { speaker: b, text: `Moi aussi. À bientôt !` },
      { speaker: a, text: `À bientôt ${b} !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Au revoir !` },
    ],
    health: [
      { speaker: b, text: `Ça va, ${a} ?` },
      { speaker: a, text: `Pas trop. Je dois me reposer.` },
      { speaker: b, text: `Tu peux marcher ?` },
      { speaker: a, text: `Un peu. Il faut boire de l'eau.` },
      { speaker: b, text: `Tu veux un médicament ?` },
      { speaker: a, text: `Peut-être. Merci.` },
      { speaker: b, text: `On reste à ${place} aujourd'hui.` },
      { speaker: a, text: `Oui. C'est mieux.` },
      { speaker: b, text: `Demain tu peux sortir.` },
      { speaker: a, text: `J'espère. À bientôt.` },
      { speaker: b, text: `À bientôt. Repose-toi.` },
      { speaker: a, text: `Merci ${b}. Au revoir.` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Bonjour, s'il vous plaît.` },
    ],
    work: [
      { speaker: a, text: `Bonjour ${b}. Tu travailles aujourd'hui ?` },
      { speaker: b, text: `Oui. Je vais au bureau.` },
      { speaker: a, text: `Tu travailles où ?` },
      { speaker: b, text: `Je travaille à ${place}.` },
      { speaker: a, text: `À quelle heure tu pars ?` },
      { speaker: b, text: `Je pars à neuf heures. Je rentre à six heures.` },
      { speaker: a, text: `Moi, je vais à l'école. J'ai un cours à dix heures.` },
      { speaker: b, text: `Tu as ton emploi du temps ?` },
      { speaker: a, text: `Oui. Voici mon emploi du temps.` },
      { speaker: b, text: `Merci. À bientôt au bureau.` },
      { speaker: a, text: `À bientôt !` },
      { speaker: b, text: `Au revoir ${a}.` },
      { speaker: a, text: `Bonjour, vous travaillez ici ?` },
      { speaker: b, text: `Oui, je travaille au bureau. Et vous ?` },
    ],
    school: [
      { speaker: a, text: `Tu vas à l'école aujourd'hui ?` },
      { speaker: b, text: `Oui. Je vais à l'école à huit heures.` },
      { speaker: a, text: `Tu as un cours ?` },
      { speaker: b, text: `Oui. J'ai un cours à dix heures.` },
      { speaker: a, text: `Le professeur arrive à neuf heures.` },
      { speaker: b, text: `Tu as ton emploi du temps ?` },
      { speaker: a, text: `Oui. Voici mon emploi du temps.` },
      { speaker: b, text: `Tu rentres à quelle heure ?` },
      { speaker: a, text: `Je rentre à quatre heures.` },
      { speaker: b, text: `Moi, je travaille au bureau.` },
      { speaker: a, text: `À demain à l'école !` },
      { speaker: b, text: `À demain !` },
      { speaker: a, text: `Bonjour, vous avez un cours aujourd'hui ?` },
      { speaker: b, text: `Oui. J'ai un cours à dix heures.` },
    ],
    past: [
      { speaker: b, text: `Qu'est-ce que tu as fait hier ?` },
      { speaker: a, text: `J'ai marché à ${place}.` },
      { speaker: b, text: `Tu as vu des amis ?` },
      { speaker: a, text: `Oui. On a parlé beaucoup.` },
      { speaker: b, text: `Tu as mangé où ?` },
      { speaker: a, text: `J'ai mangé près de la gare.` },
      { speaker: b, text: `C'était bien ?` },
      { speaker: a, text: `Oui. Et toi ?` },
      { speaker: b, text: `J'ai fini mon travail.` },
      { speaker: a, text: `Bravo. À bientôt !` },
      { speaker: b, text: `À bientôt ${a}.` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Hier, c'était une bonne journée.` },
    ],
    future: [
      { speaker: a, text: `Qu'est-ce que tu vas faire demain ?` },
      { speaker: b, text: `Je vais aller à ${place}.` },
      { speaker: a, text: `Tu vas partir tôt ?` },
      { speaker: b, text: `Oui. Et toi ?` },
      { speaker: a, text: `Je vais rester ici.` },
      { speaker: b, text: `On se voit après ?` },
      { speaker: a, text: `Oui. Je vais t'appeler.` },
      { speaker: b, text: `Parfait. À demain.` },
      { speaker: a, text: `À demain ${b} !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Bonne soirée.` },
      { speaker: a, text: `Merci. Toi aussi.` },
      { speaker: b, text: `À bientôt à ${place}.` },
    ],
    register: [
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci. Et vous ?` },
      { speaker: a, text: `Maintenant, entre nous : salut, ça va ?` },
      { speaker: b, text: `Ça va ! Tu vois la différence ?` },
      { speaker: a, text: `Oui. *Vous* avec un inconnu.` },
      { speaker: b, text: `Et *tu* avec un ami.` },
      { speaker: a, text: `On répète le ton soutenu ?` },
      { speaker: b, text: `Oui. Bonjour, s'il vous plaît.` },
      { speaker: a, text: `Bien. À bientôt à ${place}.` },
      { speaker: b, text: `À bientôt !` },
      { speaker: a, text: `Au revoir.` },
      { speaker: b, text: `Au revoir ${a}.` },
      { speaker: a, text: `Salut !` },
      { speaker: b, text: `Salut !` },
    ],
    food: [
      { speaker: a, text: `Tu as faim ?` },
      { speaker: b, text: `Oui. On mange à ${place} ?` },
      { speaker: a, text: `D'accord. Je prends du pain.` },
      { speaker: b, text: `Moi, de l'eau et un café.` },
      { speaker: a, text: `C'est bon ?` },
      { speaker: b, text: `Oui. Merci.` },
      { speaker: a, text: `L'addition, s'il vous plaît.` },
      { speaker: b, text: `On se revoit demain ?` },
      { speaker: a, text: `Oui. À bientôt !` },
      { speaker: b, text: `À bientôt ${a}.` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir !` },
      { speaker: a, text: `Bon appétit !` },
      { speaker: b, text: `Merci. Toi aussi.` },
    ],
    travel: [
      { speaker: a, text: `Le train pour ${place} part bientôt.` },
      { speaker: b, text: `Tu as ton billet ?` },
      { speaker: a, text: `Oui. On y va.` },
      { speaker: b, text: `Je suis prête.` },
      { speaker: a, text: `À quelle heure on arrive ?` },
      { speaker: b, text: `Bientôt. Tu veux de l'eau ?` },
      { speaker: a, text: `Oui, merci.` },
      { speaker: b, text: `Voilà ${place}.` },
      { speaker: a, text: `Parfait. À bientôt ici ?` },
      { speaker: b, text: `Oui. À bientôt !` },
      { speaker: a, text: `Au revoir !` },
      { speaker: b, text: `Au revoir ${a}.` },
      { speaker: a, text: `Bon voyage !` },
      { speaker: b, text: `Merci !` },
    ],
    generic: [
      { speaker: a, text: `Bonjour ${b} ! Ça va ?` },
      { speaker: b, text: `Ça va bien, merci. Et toi ?` },
      { speaker: a, text: f0 },
      { speaker: b, text: `Oui. ${f1}` },
      { speaker: a, text: `À ${place}, c'est une bonne journée.` },
      { speaker: b, text: `Moi aussi. ${f2}` },
      { speaker: a, text: `Encore une fois : ${f3}` },
      { speaker: b, text: `C'est clair. Merci.` },
      { speaker: a, text: `On se dit à bientôt ?` },
      { speaker: b, text: `Oui. À bientôt à ${place} !` },
      { speaker: a, text: `Au revoir ${b} !` },
      { speaker: b, text: `Au revoir ${a} !` },
      { speaker: a, text: `Bonjour, comment allez-vous ?` },
      { speaker: b, text: `Très bien, merci. Et vous ?` },
    ],
  }

  return uniquifyDialogue(scripts[domain], theme, world)
}

/** Mix theme focus into every dialogue so shared domain shells stay unique. */
function uniquifyDialogue(
  lines: Array<{ speaker: string; text: string }>,
  theme: DeepTheme,
  world: World,
): Array<{ speaker: string; text: string }> {
  const focus = frenchFocusLines(theme)
  const { a, b, place, seed } = world
  const f0 = focus[0] ?? `Je suis prêt.`
  const f1 = focus[1] ?? `Oui, je comprends.`
  const f2 = focus[2] ?? `C'est clair.`
  const stamp = uniqueSpeech(theme.id)
  const out = lines.map((line) => ({ ...line }))
  if (out.length < 8) return out
  // Slot theme-specific lines where they won't break greetings/goodbyes
  const mid = 4 + (seed % 3)
  out[mid] = { speaker: a, text: f0 }
  out[Math.min(mid + 1, out.length - 4)] = { speaker: b, text: `Oui. ${f1}` }
  out[Math.min(mid + 2, out.length - 3)] = { speaker: a, text: f2 }
  const detail = pick(SCENE_DETAILS, seed, 17)
  out[2] = {
    speaker: out[2]?.speaker ?? a,
    text: `${out[2]?.text ?? 'Oui.'} On est ${detail}.`.replace(/\.\s*\./g, '.'),
  }
  out[out.length - 3] = {
    speaker: b,
    text: `D'accord. À ${place}, c'est clair. ${stamp}`,
  }
  out[out.length - 4] = {
    speaker: a,
    text: f2,
  }
  return out
}

function meaningDistractors(meanings: Array<[string, string]>, correctEn: string, index: number): [string, string] {
  const pool = meanings.map(([, en]) => en).filter((en) => en !== correctEn)
  return [pool[index % Math.max(1, pool.length)] ?? 'another meaning', pool[(index + 1) % Math.max(1, pool.length)] ?? 'a different word']
}

function scrubExercise(
  item: { category: string; prompt: string; options: string[]; answer: number },
  theme: DeepTheme,
  index: number,
): LessonExercise | null {
  const blob = [item.prompt, ...item.options].join(' ')
  if (/plot|spoiler|character name|Before grammar|prove chunk|Hand-crafted|only English/i.test(blob)) return null
  if (item.options.some((o) => /^(plot|name|story|Only English|only English)$/i.test(o.trim()))) return null
  return {
    id: `craft-e${index + 1}`,
    category: item.category || theme.ruleSlugs[0] || 'grammar',
    prompt: item.prompt.replace(/^Prove\s*—\s*/i, ''),
    options: item.options,
    answer: item.answer,
    explanation: item.options[item.answer] ?? 'Correct',
  }
}

function dedupe(items: LessonExercise[]): LessonExercise[] {
  const seen = new Set<string>()
  const out: LessonExercise[] = []
  for (const item of items) {
    const optionKey = 'options' in item && Array.isArray(item.options) ? item.options.join('~') : ''
    const key = `${item.prompt}|${optionKey}|${item.type ?? ''}|${'statement' in item ? (item as { statement?: string }).statement : ''}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

export function buildCraftExercises(theme: DeepTheme, prefix: string): LessonExercise[] {
  const meanings = cleanMeanings(theme)
  const focus = frenchFocusLines(theme)
  const fromTheme = theme.exercises
    .map((item, index) => scrubExercise(item, theme, index))
    .filter((item): item is LessonExercise => Boolean(item))
    .map((item, index) => ({ ...item, id: `${prefix}-e${index + 1}` }))

  const meaningDrills: LessonExercise[] = meanings.slice(0, 12).map(([fr, en], index) => {
    const [d1, d2] = meaningDistractors(meanings, en, index)
    return {
      id: `${prefix}-m${index + 1}`,
      category: 'vocab-meaning',
      prompt: `What does “${fr}” mean?`,
      options: [en, d1, d2],
      answer: 0,
      explanation: en,
    }
  })

  const focusDrills: LessonExercise[] = focus.slice(0, 6).map((line, index) => ({
    id: `${prefix}-f${index + 1}`,
    category: 'focus-production',
    prompt: 'Which French line fits this lesson?',
    options: [line, focus[(index + 1) % focus.length] ?? 'Je ne sais pas.', focus[(index + 2) % focus.length] ?? "C'est difficile."],
    answer: 0,
    explanation: line,
  }))

  const left = meanings.slice(0, Math.min(4, meanings.length)).map(([fr]) => fr)
  const right = meanings.slice(0, Math.min(4, meanings.length)).map(([, en]) => en)
  const matchExercise: LessonExercise = {
    id: `${prefix}-match`,
    type: 'match',
    category: 'match-pairs',
    prompt: 'Match French ↔ English',
    explanation: 'From Words to learn first',
    left,
    right,
    pairs: left.map((_, i) => [i, i] as [number, number]),
  }

  const clozeSource = focus[0] ?? `J'habite à Paris.`
  const firstWord = clozeSource.split(/\s+/)[0]?.replace(/[.,!?]/g, '') || 'Je'
  const orderWords = clozeSource.replace(/[.,!?]/g, '').split(/\s+/).filter(Boolean)

  const combined = dedupe([
    ...fromTheme,
    ...meaningDrills,
    ...focusDrills,
    matchExercise,
    {
      id: `${prefix}-cloze1`,
      type: 'cloze',
      category: 'cloze-production',
      prompt: 'Type the missing French word.',
      text: clozeSource.includes(' ') ? clozeSource.replace(/\S+/, '___') : `___ ${clozeSource}`,
      answers: [firstWord],
      explanation: clozeSource,
    },
    {
      id: `${prefix}-order1`,
      type: 'order',
      category: 'word-order',
      prompt: 'Put the words in order.',
      explanation: clozeSource,
      words: orderWords,
      answer: orderWords,
    },
    ...[0, 1, 2].map((index) => {
      const [fr, en] = meanings[index % Math.max(1, meanings.length)] ?? ['bonjour', 'hello']
      const truth = index !== 1
      const fake = meaningDistractors(meanings, en, index + 4)[0]
      return {
        id: `${prefix}-tf${index + 1}`,
        type: 'true-false' as const,
        category: 'true-false',
        prompt: 'Is this meaning correct?',
        statement: truth ? `“${fr}” means “${en}”.` : `“${fr}” means “${fake}”.`,
        answer: truth,
        explanation: truth ? 'From the meanings list' : `Actually “${fr}” means “${en}”.`,
      }
    }),
    {
      id: `${prefix}-g1`,
      category: theme.ruleSlugs[0] ?? 'grammar-core',
      prompt: 'Pick the French line that matches this lesson:',
      options: [focus[0] ?? 'Bonjour.', focus[1] ?? 'Merci.', 'Yo.'],
      answer: 0,
      explanation: focus[0] ?? 'Focus',
    },
    {
      id: `${prefix}-reg1`,
      category: 'register',
      prompt: 'You meet a stranger at a desk. Best first word?',
      options: ['Bonjour', 'Hé', 'Yo'],
      answer: 0,
      explanation: 'Clear polite greeting with strangers.',
    },
  ])

  let n = 0
  while (combined.length < 22 && meanings.length > 0) {
    const meaning = meanings[n % meanings.length]
    const [d1, d2] = meaningDistractors(meanings, meaning[1], n + 7)
    const next: LessonExercise = {
      id: `${prefix}-x${n + 1}`,
      category: 'vocab-meaning',
      prompt: `“${meaning[0]}” in English is…`,
      options: [meaning[1], d1, d2],
      answer: 0,
      explanation: meaning[1],
    }
    const before = combined.length
    combined.push(...dedupe([...combined, next]).slice(before))
    if (combined.length === before) {
      combined.push({ ...next, id: `${prefix}-x${n + 1}b`, prompt: `Choose the meaning of ${meaning[0]}:` })
    }
    n += 1
    if (n > 40) break
  }

  return combined.slice(0, 40)
}

export function buildCraftLesson(theme: DeepTheme, vocabulary: VocabularyWord[]): LessonContent {
  const prefix = `p${theme.id.slice(-4)}`
  const world = worldForTheme(theme)
  const domain = detectDomain(theme)
  const venueHint =
    domain === 'cafe'
      ? 'un café'
      : domain === 'home'
        ? 'un appartement'
        : domain === 'city'
          ? 'la rue'
          : domain === 'school'
            ? "l'école"
            : 'le centre-ville'

  return {
    brief: buildCraftBrief(theme),
    reading: readingParagraphs(prefix, buildCraftReadingFr(theme), vocabulary),
    conversation: {
      title: `${world.a} et ${world.b} à ${world.place}`,
      setting: `${world.a} et ${world.b} se retrouvent près de ${venueHint} à ${world.place}.`,
      lines: buildCraftDialogue(theme).map((line, index) =>
        conversationLine(line.speaker, line.text, `${prefix}-l${index}`, vocabulary),
      ),
    },
    exercises: buildCraftExercises(theme, prefix),
  }
}

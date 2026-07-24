import type { VocabularyWord, WordToken } from '@/lib/course'

const PUNCT = new Set(['.', ',', '!', '?', ':', ';', '…', '—', '-', '«', '»', '(', ')'])

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

/** Split trailing punctuation glued onto a word token (e.g. "Moi," → "Moi" + ","). */
function splitGluedPunctuation(token: WordToken): WordToken[] {
  const match = token.text.match(/^(.+?)([.,!?;:]+)$/)
  if (!match || isPunctuationToken(token.text)) return [token]
  const [, word, punct] = match
  if (!word || isPunctuationToken(word)) return [token]
  return [
    { ...token, text: word },
    { id: `${token.id}-p`, text: punct, syntax: 'none' },
  ]
}

/** Build lookup keys for surface forms → lemma id. */
export function buildLemmaLookup(vocabulary: VocabularyWord[]) {
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
  }
  return map
}

const MULTIWORD = [
  'à bientôt',
  'au revoir',
  "s'il vous plaît",
  "s’il vous plaît",
  "de l'eau",
  "de l’eau",
  "c'est",
  "c’est",
  "c'était",
  "c’était",
]

/** Merge multi-word idioms and attach missing lemmaIds from vocabulary. */
export function enrichTokens(tokens: WordToken[], vocabulary: VocabularyWord[]): WordToken[] {
  const lookup = buildLemmaLookup(vocabulary)
  const expanded = tokens.flatMap(splitGluedPunctuation)
  const merged: WordToken[] = []
  let i = 0

  while (i < expanded.length) {
    let matched = false
    for (const phrase of MULTIWORD) {
      const parts = phrase.split(' ')
      if (i + parts.length > expanded.length) continue
      const slice = expanded.slice(i, i + parts.length)
      const joined = slice.map((token) => normalizeLookup(token.text)).join(' ')
      if (joined === normalizeLookup(phrase)) {
        const lemmaId = lookup.get(normalizeLookup(phrase)) ?? slice.find((token) => token.lemmaId)?.lemmaId
        merged.push({
          id: slice[0].id,
          text: slice.map((token) => token.text).join(' '),
          syntax: slice.find((token) => token.syntax !== 'none')?.syntax ?? 'none',
          lemmaId,
        })
        i += parts.length
        matched = true
        break
      }
    }
    if (matched) continue

    const token = expanded[i]
    const lemmaId = token.lemmaId ?? lookup.get(normalizeLookup(token.text))
    merged.push(lemmaId ? { ...token, lemmaId } : token)
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

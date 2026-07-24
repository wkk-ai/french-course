import { readFileSync, writeFileSync } from 'node:fs'
import { LESSON_DATA } from './build-module1-lessons.mjs'
import { buildLemmaLookup, enrichTokens, isPunctuationToken, tokenizeFrench } from '../src/lib/clickable-text.ts'

// Read existing vocabulary from module1-content.ts
const src = readFileSync('src/lib/module1-content.ts', 'utf8')
const vocabMatch = src.match(/export const MODULE1_VOCABULARY: VocabularyWord\[\] = \[([\s\S]*?)\n\]/)
if (!vocabMatch) throw new Error('Could not parse vocabulary')

// We'll import vocabulary dynamically by evaluating - instead parse IDs from file
// For validation, use the vocabulary array from a temp import

import { MODULE1_VOCABULARY } from '../src/lib/module1-content.ts'

function countWords(paragraphs) {
  return paragraphs.join(' ').split(/\s+/).filter(Boolean).length
}

function missingTokens(text, prefix, vocabulary) {
  const tokens = tokenizeFrench(text, prefix, vocabulary)
  const enriched = enrichTokens(tokens, vocabulary)
  return enriched.filter((t) => !t.lemmaId && !isPunctuationToken(t.text))
}

const chapters = [
  { id: '101', key: 'c1', title: '1.1 Identity' },
  { id: '102', key: 'c2', title: '1.2 Numbers' },
  { id: '103', key: 'c3', title: '1.3 Café' },
  { id: '104', key: 'c4', title: '1.4 Family' },
]

for (const ch of chapters) {
  const data = LESSON_DATA[ch.key]
  const wc = countWords(data.reading)
  const missing = new Set()
  data.reading.forEach((p, i) => missingTokens(p, `r${i}`, MODULE1_VOCABULARY).forEach((t) => missing.add(t.text)))
  data.conversation.forEach(([sp, t], i) => missingTokens(t, `c${i}`, MODULE1_VOCABULARY).forEach((tok) => missing.add(tok.text)))
  console.log(`\n${ch.title}: reading=${wc} words, exercises TBD, missing=${missing.size}`)
  if (missing.size) console.log([...missing].sort().join(', '))
}

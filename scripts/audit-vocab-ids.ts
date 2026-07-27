/**
 * Full vocabulary ID / surface audit.
 * Usage: npx tsx scripts/audit-vocab-ids.ts
 */
import { BUNDLED_VOCABULARY } from '../src/lib/bundled-vocabulary'
import { MODULE1_VOCABULARY } from '../src/lib/module1-content'
import { PHASE1_VOCABULARY } from '../src/lib/phase1/vocabulary'
import { LATER_VOCABULARY } from '../src/lib/pathway/vocabulary-later'
import { CORE_EXTRA_VOCABULARY } from '../src/lib/pathway/vocabulary-core-extra'
import { TAP_FILL_VOCABULARY } from '../src/lib/pathway/vocabulary-tap-fill'
import { resolveVocabularyForLesson } from '../src/lib/lesson-content'
import { buildLemmaLookup, tokenizeFrench } from '../src/lib/clickable-text'
import { readFileSync } from 'fs'
import { join } from 'path'

type Bank = { name: string; words: typeof BUNDLED_VOCABULARY }

const banks: Bank[] = [
  { name: 'MODULE1', words: MODULE1_VOCABULARY },
  { name: 'PHASE1', words: PHASE1_VOCABULARY },
  { name: 'LATER', words: LATER_VOCABULARY },
  { name: 'CORE_EXTRA', words: CORE_EXTRA_VOCABULARY },
  { name: 'TAP_FILL', words: TAP_FILL_VOCABULARY },
]

function idNum(id: string): number | null {
  const m = id.match(/([0-9a-f]{12})$/i)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return Number.isFinite(n) ? n : null
}

console.log('=== Bank ranges ===')
for (const bank of banks) {
  const nums = bank.words.map((w) => idNum(w.id)).filter((n): n is number => n != null)
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  console.log(`${bank.name.padEnd(12)} count=${String(bank.words.length).padStart(4)}  id ${min}–${max}`)
}

console.log('\n=== ID collisions inside BUNDLED_VOCABULARY ===')
const byId = new Map<string, string[]>()
for (const w of BUNDLED_VOCABULARY) {
  const list = byId.get(w.id) ?? []
  list.push(w.word)
  byId.set(w.id, list)
}
const idCollisions = [...byId.entries()].filter(([, words]) => new Set(words).size > 1)
console.log('colliding ids:', idCollisions.length)
for (const [id, words] of idCollisions.slice(0, 20)) {
  console.log(`  ${id} → ${[...new Set(words)].join(' | ')}`)
}

console.log('\n=== Cross-bank ID overlaps ===')
const owner = new Map<string, string>()
let cross = 0
for (const bank of banks) {
  for (const w of bank.words) {
    const prev = owner.get(w.id)
    if (prev && prev !== bank.name) {
      cross += 1
      if (cross <= 15) console.log(`  ${w.id}: ${prev} vs ${bank.name} (${w.word})`)
    } else {
      owner.set(w.id, bank.name)
    }
  }
}
console.log('cross-bank overlapping ids:', cross)

console.log('\n=== Duplicate surface lemmas (same word, different ids) ===')
const byWord = new Map<string, { id: string; bank: string }[]>()
for (const bank of banks) {
  for (const w of bank.words) {
    const key = w.word.normalize('NFC').toLowerCase()
    const list = byWord.get(key) ?? []
    list.push({ id: w.id, bank: bank.name })
    byWord.set(key, list)
  }
}
const dupWords = [...byWord.entries()].filter(([, rows]) => new Set(rows.map((r) => r.id)).size > 1)
console.log('duplicate lemma surfaces:', dupWords.length)
for (const [word, rows] of dupWords.slice(0, 25)) {
  console.log(`  ${word}: ${rows.map((r) => `${r.bank}:${r.id.slice(-4)}`).join(', ')}`)
}

console.log('\n=== Lesson dedupe drop check ===')
const lessonVocab = resolveVocabularyForLesson([], [])
const fullIds = new Set(BUNDLED_VOCABULARY.map((w) => w.id))
const lessonIds = new Set(lessonVocab.map((w) => w.id))
const droppedIds = [...fullIds].filter((id) => !lessonIds.has(id))
console.log('full', BUNDLED_VOCABULARY.length, 'lesson', lessonVocab.length, 'dropped ids', droppedIds.length)
const fullWords = new Set(BUNDLED_VOCABULARY.map((w) => w.word.normalize('NFC').toLowerCase()))
const lessonWords = new Set(lessonVocab.map((w) => w.word.normalize('NFC').toLowerCase()))
const droppedWords = [...fullWords].filter((w) => !lessonWords.has(w))
console.log('dropped lemma surfaces after dedupe:', droppedWords.length)
if (droppedWords.length) console.log('  ', droppedWords.slice(0, 30).join(', '))

console.log('\n=== Hardcoded phrase lemma ids exist in bank ===')
const clickable = readFileSync(join(process.cwd(), 'src/lib/clickable-text.ts'), 'utf8')
const hardIds = [...clickable.matchAll(/'10000000-0000-0000-0000-00000000([0-9]{4})'/g)].map((m) => m[0].slice(1, -1))
const uniqueHard = [...new Set(hardIds)]
const missingHard = uniqueHard.filter((id) => !lessonIds.has(id) && !fullIds.has(id))
const hardNotInLesson = uniqueHard.filter((id) => fullIds.has(id) && !lessonIds.has(id))
console.log('hardcoded phrase ids:', uniqueHard.length)
console.log('missing from bank entirely:', missingHard.length, missingHard.slice(0, 10))
console.log('in full but dropped by lesson dedupe:', hardNotInLesson.length, hardNotInLesson.slice(0, 10))

console.log('\n=== Spot-check critical surfaces via lesson vocab ===')
const lookup = buildLemmaLookup(lessonVocab)
const samples = [
  'outils',
  'séparés',
  'mangions',
  'sais',
  'épelle',
  "qu'est-ce",
  'rendez-vous',
  'cinéma',
  'santé',
  'accord',
]
for (const surface of samples) {
  const id = lookup.get(surface.normalize('NFC').toLowerCase().replace(/’/g, "'"))
  const row = id ? lessonVocab.find((w) => w.id === id) : undefined
  // also tokenize path
  const tok = tokenizeFrench(surface, 's', lessonVocab)[0]
  const tokRow = tok?.lemmaId ? lessonVocab.find((w) => w.id === tok.lemmaId) : undefined
  console.log(
    `  ${surface.padEnd(14)} lookup=${row?.word ?? 'MISS'}  tokenize=${tokRow?.word ?? 'MISS'}`,
  )
}

console.log('\n=== DONE ===')
console.log(
  JSON.stringify({
    idCollisions: idCollisions.length,
    crossBankOverlaps: cross,
    duplicateSurfaces: dupWords.length,
    droppedSurfacesAfterDedupe: droppedWords.length,
    missingHardcodedIds: missingHard.length,
    ok: idCollisions.length === 0 && cross === 0 && droppedWords.length === 0 && missingHard.length === 0,
  }),
)

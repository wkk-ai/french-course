#!/usr/bin/env npx tsx
/**
 * Measure tap coverage across bundled lessons and optionally emit vocab suggestions.
 * Usage: npx tsx scripts/measure-tap-coverage.ts [--top N]
 */
import { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } from '../src/lib/bundled-lessons'
import { BUNDLED_VOCABULARY } from '../src/lib/phase1/content'
import { tokenizeFrench, isPunctuationToken } from '../src/lib/clickable-text'
import { measureBundledTapCoverage } from '../src/lib/pathway/tap-coverage'

const PROPER = new Set([
  'marc', 'marie', 'sophie', 'paul', 'thomas', 'pierre', 'paris', 'lyon', 'france',
  'canada', 'belgique', 'suisse', 'luc', 'julie', 'claire', 'nicolas', 'emma', 'antoine',
])

function isProper(surface: string): boolean {
  const trimmed = surface.trim().replace(/^[«»"'(\[]+/, '').replace(/[.,!?;:»"')\]]+$/, '')
  if (!/^[A-ZÀ-Ÿ]/.test(trimmed)) return false
  return PROPER.has(trimmed.normalize('NFC').toLowerCase())
}

function normalizeWord(word: string): string {
  return word.normalize('NFC').toLowerCase().replace(/'/g, "'")
}

const existing = new Set(BUNDLED_VOCABULARY.map((w) => normalizeWord(w.word)))

const stats = measureBundledTapCoverage(BUNDLED_LESSONS, BUNDLED_CHAPTER_IDS, BUNDLED_VOCABULARY)
const missCounts = new Map<string, number>()

for (const chapterId of BUNDLED_CHAPTER_IDS) {
  const lesson = BUNDLED_LESSONS[chapterId]
  if (!lesson) continue
  const texts: string[] = []
  for (const p of lesson.reading ?? []) texts.push(p.tokens.map((t) => t.text).join(' '))
  for (const l of lesson.conversation?.lines ?? []) texts.push(l.tokens?.map((t) => t.text).join(' ') ?? l.text)
  for (const [ti, text] of texts.entries()) {
    for (const t of tokenizeFrench(text, `s${ti}`, BUNDLED_VOCABULARY)) {
      if (isPunctuationToken(t.text)) continue
      if (!/[A-Za-zÀ-ÿŒœÆæ]/.test(t.text)) continue
      if (!t.lemmaId && !isProper(t.text)) {
        missCounts.set(t.text, (missCounts.get(t.text) ?? 0) + 1)
      }
    }
  }
}

const topN = Number(process.argv.find((a) => a.startsWith('--top='))?.split('=')[1] ?? 40)
const top = [...missCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN)

console.log('Tap coverage (720 bundled lessons)')
console.log(`  Total word tokens: ${stats.totalWordTokens}`)
console.log(`  Miss tokens:       ${stats.missTokens}`)
console.log(`  Miss rate:         ${(stats.missRate * 100).toFixed(2)}%`)
console.log(`\nTop ${topN} missing surfaces:`)
for (const [surface, count] of top) {
  const norm = normalizeWord(surface)
  const inBank = existing.has(norm) ? ' [in bank]' : ''
  console.log(`  ${count}\t${surface}${inBank}`)
}

function guessPos(surface: string): string {
  const lower = surface.toLowerCase()
  if (/^(?:[a-zàâäéèêëïîôùûüç]+(?:er|ir|re|oir))$/i.test(lower) && lower === surface.toLowerCase()) return 'verb'
  if (lower.endsWith('er') || lower.endsWith('ir') || lower.endsWith('re') || lower.endsWith('oir')) return 'verb'
  if (lower.endsWith('ment')) return 'adverb'
  if (lower.endsWith('tion') || lower.endsWith('sion')) return 'noun'
  return 'other'
}

function guessLemma(surface: string): string {
  const lower = surface.toLowerCase()
  if (lower.endsWith('ent') && lower.length > 4) return `${lower.slice(0, -3)}er`
  if (lower.endsWith('ez') && lower.length > 3) return `${lower.slice(0, -2)}er`
  if (lower.endsWith('ons') && lower.length > 4) return `${lower.slice(0, -3)}er`
  if (lower.endsWith('es') && lower.length > 3 && !lower.endsWith('ies')) return `${lower.slice(0, -2)}er`
  if (lower.endsWith('e') && lower.length > 2) return `${lower.slice(0, -1)}er`
  if (lower.endsWith('s') && lower.length > 2) return lower.slice(0, -1)
  return lower
}

console.log('\nSuggested new lemmas (not in bank):')
let n = 0
for (const [surface] of top) {
  const lemma = guessLemma(surface)
  if (existing.has(normalizeWord(lemma)) || existing.has(normalizeWord(surface))) continue
  const pos = guessPos(lemma)
  console.log(`  // ${surface} → ${lemma} (${pos})`)
  n += 1
  if (n >= 20) break
}

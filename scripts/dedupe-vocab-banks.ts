/**
 * Rewrite CORE_EXTRA / TAP_FILL without surfaces already covered by earlier banks.
 * Usage: npx tsx scripts/dedupe-vocab-banks.ts
 */
import { writeFileSync } from 'fs'
import { MODULE1_VOCABULARY } from '../src/lib/module1-content'
import { PHASE1_VOCABULARY } from '../src/lib/phase1/vocabulary'
import { LATER_VOCABULARY } from '../src/lib/pathway/vocabulary-later'
import { CORE_EXTRA_VOCABULARY } from '../src/lib/pathway/vocabulary-core-extra'
import { TAP_FILL_VOCABULARY } from '../src/lib/pathway/vocabulary-tap-fill'
import type { VocabularyWord } from '../src/lib/course'

function norm(word: string) {
  return word.normalize('NFC').toLowerCase().replace(/’/g, "'")
}

function surfaceKey(word: string) {
  // Keep letter case distinct (a vs A) for spelling taps; collapse everything else.
  if ([...word].length === 1 && /[A-Za-zÀ-ÿ]/.test(word)) return `letter:${word}`
  return norm(word)
}

function dedupe(words: VocabularyWord[], reserved: Set<string>): VocabularyWord[] {
  const seen = new Set<string>()
  const out: VocabularyWord[] = []
  for (const word of words) {
    const key = surfaceKey(word.word)
    if (reserved.has(key) || seen.has(key)) continue
    seen.add(key)
    out.push(word)
  }
  return out
}

function keysOf(words: VocabularyWord[]) {
  return new Set(words.map((w) => surfaceKey(w.word)))
}

const base = [...MODULE1_VOCABULARY, ...PHASE1_VOCABULARY, ...LATER_VOCABULARY]
const baseKeys = keysOf(base)

const coreClean = dedupe(CORE_EXTRA_VOCABULARY, baseKeys).filter(
  // Pathway role letters collide with alphabet taps — keep alphabet only.
  (w) => !/^[A-D]$/.test(w.word),
)
const afterCore = new Set([...baseKeys, ...keysOf(coreClean)])
const tapClean = dedupe(TAP_FILL_VOCABULARY, afterCore)

console.log('CORE', CORE_EXTRA_VOCABULARY.length, '→', coreClean.length)
console.log('TAP ', TAP_FILL_VOCABULARY.length, '→', tapClean.length)

function emitCore(words: VocabularyWord[]) {
  const lines = words.map((w) => {
    const n = parseInt(w.id.slice(-4), 10) - 4000
    const wordLit = JSON.stringify(w.word)
    const trLit = JSON.stringify(w.base_translation)
    const posLit = JSON.stringify(w.part_of_speech)
    const gender =
      w.gender === 'masculine' || w.gender === 'feminine' ? `, '${w.gender}'` : ''
    return `  v(${n}, ${wordLit}, ${trLit}, ${posLit}${gender}),`
  })
  return `import type { VocabularyWord } from '@/lib/course'

/** High-frequency learner French used in readings / fillers — keeps tap coverage high. */
function v(
  n: number,
  word: string,
  base_translation: string,
  part_of_speech: string,
  gender: 'masculine' | 'feminine' | null = null,
): VocabularyWord {
  // Namespace 4000+ — must not overlap LATER (≤841), PHASE1 (400–499), or TAP_FILL (5000+).
  const id = \`10000000-0000-0000-0000-00000000\${String(4000 + n).padStart(4, '0')}\`
  return {
    id,
    word,
    base_translation,
    meanings: [base_translation],
    example: { french: word, english: base_translation },
    part_of_speech,
    gender,
    register: 'Courant',
    ipa_pronunciation: null,
    is_idiom: part_of_speech === 'phrase',
    is_slang: false,
    idiom_explanation: null,
  }
}

export const CORE_EXTRA_VOCABULARY: VocabularyWord[] = [
${lines.join('\n')}
]
`
}

function emitTap(words: VocabularyWord[], reserved: Set<string>) {
  const rest = words.filter((w) => !/^[a-zA-Z]$/.test(w.word))
  const letterLines: string[] = []
  for (const [i, ch] of 'abcdefghijklmnopqrstuvwxyz'.split('').entries()) {
    if (!reserved.has(`letter:${ch}`)) {
      letterLines.push(
        `  v(300 + ${i}, '${ch}', \`the letter \${'${ch}'}\`, 'noun', 'masculine'),`,
      )
    }
    const up = ch.toUpperCase()
    if (!reserved.has(`letter:${up}`)) {
      letterLines.push(
        `  v(330 + ${i}, '${up}', \`the letter \${'${up}'}\`, 'noun', 'masculine'),`,
      )
    }
  }

  const lines = rest.map((w) => {
    const n = parseInt(w.id.slice(-4), 10) - 5000
    const wordLit = JSON.stringify(w.word)
    const trLit = JSON.stringify(w.base_translation)
    const posLit = JSON.stringify(w.part_of_speech)
    const gender =
      w.gender === 'masculine' || w.gender === 'feminine' ? `, '${w.gender}'` : ''
    return `  v(${n}, ${wordLit}, ${trLit}, ${posLit}${gender}),`
  })

  return `import type { VocabularyWord } from '@/lib/course'

/** Remaining high-frequency reading/dialogue surfaces for near-zero tap miss. */
function v(
  n: number,
  word: string,
  base_translation: string,
  part_of_speech: string,
  gender: 'masculine' | 'feminine' | null = null,
): VocabularyWord {
  // Namespace 5000+ — must not overlap CORE_EXTRA (4000+) or phase banks.
  const id = \`10000000-0000-0000-0000-00000000\${String(5000 + n).padStart(4, '0')}\`
  return {
    id,
    word,
    base_translation,
    meanings: [base_translation],
    example: { french: word, english: base_translation },
    part_of_speech,
    gender,
    register: 'Courant',
    ipa_pronunciation: null,
    is_idiom: part_of_speech === 'phrase',
    is_slang: false,
    idiom_explanation: null,
  }
}

export const TAP_FILL_VOCABULARY: VocabularyWord[] = [
${letterLines.join('\n')}
${lines.join('\n')}
]
`
}

writeFileSync('src/lib/pathway/vocabulary-core-extra.ts', emitCore(coreClean))
writeFileSync('src/lib/pathway/vocabulary-tap-fill.ts', emitTap(tapClean, afterCore))
console.log('wrote cleaned core-extra + tap-fill')

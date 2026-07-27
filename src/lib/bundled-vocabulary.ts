import type { VocabularyWord } from '@/lib/course'
import { MODULE1_VOCABULARY } from '@/lib/module1-content'
import { PHASE1_VOCABULARY } from '@/lib/phase1/vocabulary'
import { LATER_VOCABULARY } from '@/lib/pathway/vocabulary-later'
import { CORE_EXTRA_VOCABULARY } from '@/lib/pathway/vocabulary-core-extra'
import { TAP_FILL_VOCABULARY } from '@/lib/pathway/vocabulary-tap-fill'

/** Collapse duplicate lemma surfaces; keep first (earlier bank wins). Letters keep case. */
export function dedupeVocabularySurfaces(words: VocabularyWord[]): VocabularyWord[] {
  const seen = new Set<string>()
  const out: VocabularyWord[] = []
  for (const word of words) {
    const key =
      [...word.word].length === 1 && /[A-Za-zÀ-ÿ]/.test(word.word)
        ? `letter:${word.word}`
        : word.word.normalize('NFC').toLowerCase().replace(/’/g, "'")
    if (seen.has(key)) continue
    seen.add(key)
    out.push(word)
  }
  return out
}

/** Full dictionary only — no lesson/theme side effects. Safe for client imports. */
export const BUNDLED_VOCABULARY: VocabularyWord[] = dedupeVocabularySurfaces([
  ...MODULE1_VOCABULARY,
  ...PHASE1_VOCABULARY,
  ...LATER_VOCABULARY,
  ...CORE_EXTRA_VOCABULARY,
  ...TAP_FILL_VOCABULARY,
])

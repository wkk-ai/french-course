import type { VocabularyWord } from '@/lib/course'
import { MODULE1_VOCABULARY } from '@/lib/module1-content'
import { PHASE1_VOCABULARY } from '@/lib/phase1/vocabulary'
import { LATER_VOCABULARY } from '@/lib/pathway/vocabulary-later'
import { CORE_EXTRA_VOCABULARY } from '@/lib/pathway/vocabulary-core-extra'
import { TAP_FILL_VOCABULARY } from '@/lib/pathway/vocabulary-tap-fill'

/** Full dictionary only — no lesson/theme side effects. Safe for client imports. */
export const BUNDLED_VOCABULARY: VocabularyWord[] = [
  ...MODULE1_VOCABULARY,
  ...PHASE1_VOCABULARY,
  ...LATER_VOCABULARY,
  ...CORE_EXTRA_VOCABULARY,
  ...TAP_FILL_VOCABULARY,
]

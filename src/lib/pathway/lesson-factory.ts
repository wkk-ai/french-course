import type { LessonContent, VocabularyWord } from '@/lib/course'
import { buildCraftLesson } from '@/lib/pathway/craft-from-theme'
import type { Phase1Theme } from '@/lib/phase1/theme-bank'

export type DeepTheme = Phase1Theme & {
  role?: 'A' | 'B' | 'C' | 'D'
  moduleTitle?: string
  unitTitle?: string
  chunks?: Array<[string, string]>
  traps?: string[]
  registerTrio?: [string, string, string]
  readingFr?: string[]
  theorySections?: Array<{ heading: string; body: string }>
}

/** Build a Module-1 Learn A craft lesson from theme + vocabulary (no pad emitters). */
export function buildLessonFromTheme(theme: DeepTheme, vocabulary: VocabularyWord[]): LessonContent {
  return buildCraftLesson(theme, vocabulary)
}

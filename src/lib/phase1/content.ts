import type { LessonContent, VocabularyWord } from '@/lib/course'
import { MODULE1_VOCABULARY } from '@/lib/module1-content'
import { PHASE1_THEMES } from '@/lib/phase1/theme-bank'
import { PHASE1_VOCABULARY } from '@/lib/phase1/vocabulary'
import { buildLessonFromTheme } from '@/lib/pathway/lesson-factory'

/** Module 1 + Phase I dictionaries for tokenization and Review. */
export const BUNDLED_VOCABULARY: VocabularyWord[] = [...MODULE1_VOCABULARY, ...PHASE1_VOCABULARY]

export function buildPhase1Lessons(vocabulary: VocabularyWord[] = BUNDLED_VOCABULARY): Record<string, LessonContent> {
  const lessons: Record<string, LessonContent> = {}
  for (const theme of PHASE1_THEMES) {
    lessons[theme.id] = buildLessonFromTheme(theme, vocabulary)
  }
  return lessons
}

export const PHASE1_LESSONS = buildPhase1Lessons()
export const PHASE1_CHAPTER_IDS = PHASE1_THEMES.map((theme) => theme.id)

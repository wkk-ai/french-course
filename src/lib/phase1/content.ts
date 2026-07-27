import type { LessonContent, VocabularyWord } from '@/lib/course'
import { MODULE1_VOCABULARY } from '@/lib/module1-content'
import { PHASE1_THEMES } from '@/lib/phase1/theme-bank'
import { PHASE1_VOCABULARY } from '@/lib/phase1/vocabulary'
import { buildLessonFromTheme } from '@/lib/pathway/lesson-factory'
import { LATER_THEMES } from '@/lib/pathway/themes-m07-m36'
import { LATER_VOCABULARY } from '@/lib/pathway/vocabulary-later'
import { CORE_EXTRA_VOCABULARY } from '@/lib/pathway/vocabulary-core-extra'

/** Full dictionary: Module 1 + Phase I + M07–M36 + core extras for tap coverage. */
export const BUNDLED_VOCABULARY: VocabularyWord[] = [
  ...MODULE1_VOCABULARY,
  ...PHASE1_VOCABULARY,
  ...LATER_VOCABULARY,
  ...CORE_EXTRA_VOCABULARY,
]

/** All factory themes outside hand-authored Module 1 Learn A cores (M02–M36). */
export const FACTORY_THEMES = [...PHASE1_THEMES, ...LATER_THEMES]

export function buildFactoryLessons(vocabulary: VocabularyWord[] = BUNDLED_VOCABULARY): Record<string, LessonContent> {
  const lessons: Record<string, LessonContent> = {}
  for (const theme of FACTORY_THEMES) {
    lessons[theme.id] = buildLessonFromTheme(theme, vocabulary)
  }
  return lessons
}

export const FACTORY_LESSONS = buildFactoryLessons()
export const FACTORY_CHAPTER_IDS = FACTORY_THEMES.map((theme) => theme.id)

/** @deprecated Prefer FACTORY_LESSONS */
export const PHASE1_LESSONS = Object.fromEntries(
  PHASE1_THEMES.map((theme) => [theme.id, FACTORY_LESSONS[theme.id]]),
)
/** @deprecated Prefer FACTORY_CHAPTER_IDS filter */
export const PHASE1_CHAPTER_IDS = PHASE1_THEMES.map((theme) => theme.id)

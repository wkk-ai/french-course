import type { LessonContent, VocabularyWord } from '@/lib/course'
import { PHASE1_THEMES } from '@/lib/phase1/theme-bank'
import { buildLessonFromTheme } from '@/lib/pathway/lesson-factory'
import { LATER_THEMES } from '@/lib/pathway/themes-m07-m36'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'

export { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'

/** All factory themes outside hand-authored Module 1 Learn A cores (M02–M36). */
export const FACTORY_THEMES = [...PHASE1_THEMES, ...LATER_THEMES]

export function buildFactoryLessons(vocabulary: VocabularyWord[] = BUNDLED_VOCABULARY): Record<string, LessonContent> {
  const lessons: Record<string, LessonContent> = {}
  for (const theme of FACTORY_THEMES) {
    lessons[theme.id] = buildLessonFromTheme(theme, vocabulary)
  }
  return lessons
}

let _factoryLessons: Record<string, LessonContent> | null = null

/** Lazy — building 700+ lessons is expensive; never import this path from client components. */
export function getFactoryLessons(): Record<string, LessonContent> {
  if (!_factoryLessons) _factoryLessons = buildFactoryLessons()
  return _factoryLessons
}

export const FACTORY_CHAPTER_IDS = FACTORY_THEMES.map((theme) => theme.id)

/** @deprecated Prefer getFactoryLessons() */
export function getPhase1Lessons(): Record<string, LessonContent> {
  const all = getFactoryLessons()
  return Object.fromEntries(PHASE1_THEMES.map((theme) => [theme.id, all[theme.id]]))
}

/** @deprecated Prefer FACTORY_CHAPTER_IDS */
export const PHASE1_CHAPTER_IDS = PHASE1_THEMES.map((theme) => theme.id)

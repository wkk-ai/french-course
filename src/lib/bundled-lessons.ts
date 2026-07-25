import type { LessonContent } from '@/lib/course'
import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'
import { FACTORY_CHAPTER_IDS, FACTORY_LESSONS, PHASE1_CHAPTER_IDS, PHASE1_LESSONS } from '@/lib/phase1/content'
import { PATHWAY_MODULES } from '@/lib/pathway/catalog'

/** All authored playable lessons — Module 01 hand bundle + factory M02–M36. */
export const BUNDLED_LESSONS: Record<string, LessonContent> = {
  ...FACTORY_LESSONS,
  ...MODULE1_LESSONS,
}

/** Pathway order for every chapter that has bundled content. */
export const BUNDLED_CHAPTER_IDS: string[] = PATHWAY_MODULES.flatMap((module) =>
  module.subchapters.map((sub) => sub.id).filter((id) => Boolean(BUNDLED_LESSONS[id])),
)

/** @deprecated Prefer BUNDLED_CHAPTER_IDS */
export const AUTHORED_CHAPTER_IDS = BUNDLED_CHAPTER_IDS

export function hasBundledLesson(chapterId: string): boolean {
  return Boolean(BUNDLED_LESSONS[chapterId])
}

export { MODULE1_CHAPTER_IDS, MODULE1_LESSONS, PHASE1_CHAPTER_IDS, PHASE1_LESSONS, FACTORY_CHAPTER_IDS, FACTORY_LESSONS }

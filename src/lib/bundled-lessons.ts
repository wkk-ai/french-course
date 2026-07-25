import type { LessonContent } from '@/lib/course'
import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'
import { PHASE1_CHAPTER_IDS, PHASE1_LESSONS } from '@/lib/phase1/content'
import { PATHWAY_MODULES } from '@/lib/pathway/catalog'

/** All authored playable lessons (Module 01 + Phase I M02–M06). */
export const BUNDLED_LESSONS: Record<string, LessonContent> = {
  ...MODULE1_LESSONS,
  ...PHASE1_LESSONS,
}

/** Pathway order for authored chapters only. */
export const BUNDLED_CHAPTER_IDS: string[] = PATHWAY_MODULES.filter((module) => module.status === 'playable').flatMap(
  (module) => module.subchapters.map((sub) => sub.id).filter((id) => Boolean(BUNDLED_LESSONS[id])),
)

/** @deprecated Prefer BUNDLED_CHAPTER_IDS */
export const AUTHORED_CHAPTER_IDS = BUNDLED_CHAPTER_IDS

export function hasBundledLesson(chapterId: string): boolean {
  return Boolean(BUNDLED_LESSONS[chapterId])
}

/** Keep Module 1 id lists available for older imports. */
export { MODULE1_CHAPTER_IDS, MODULE1_LESSONS, PHASE1_CHAPTER_IDS, PHASE1_LESSONS }

import type { LessonContent } from '@/lib/course'
import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'
import { FACTORY_CHAPTER_IDS, FACTORY_LESSONS, PHASE1_CHAPTER_IDS, PHASE1_LESSONS } from '@/lib/phase1/content'
import { PATHWAY_BY_CHAPTER_ID, PATHWAY_MODULES } from '@/lib/pathway/catalog'
import { deepenLessonToModule1Bar } from '@/lib/pathway/deepen-lesson'

function roleFor(chapterId: string, title?: string): 'A' | 'B' | 'C' {
  const hit = PATHWAY_BY_CHAPTER_ID.get(chapterId)
  if (hit?.sub.role) return hit.sub.role
  if (title && /checkpoint|integrate/i.test(title)) return 'C'
  if (title && /apply/i.test(title)) return 'B'
  return 'A'
}

function withDepth(lessons: Record<string, LessonContent>): Record<string, LessonContent> {
  const out: Record<string, LessonContent> = {}
  for (const [id, lesson] of Object.entries(lessons)) {
    out[id] = deepenLessonToModule1Bar(lesson, roleFor(id, lesson.brief?.title))
  }
  return out
}

/** All authored playable lessons — Module 01 + factory M02–M36, deepened to Module-1 bar. */
export const BUNDLED_LESSONS: Record<string, LessonContent> = withDepth({
  ...FACTORY_LESSONS,
  ...MODULE1_LESSONS,
})

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

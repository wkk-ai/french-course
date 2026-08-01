import type { LessonContent } from '@/lib/course'
import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'
import { FACTORY_CHAPTER_IDS, getFactoryLessons, PHASE1_CHAPTER_IDS, getPhase1Lessons } from '@/lib/phase1/content'
import { PATHWAY_BY_CHAPTER_ID } from '@/lib/pathway/catalog'
import { deepenLessonToModule1Bar } from '@/lib/pathway/deepen-lesson'
import { BUNDLED_CHAPTER_IDS as CATALOG_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'

function roleFor(chapterId: string, title?: string): 'A' | 'B' | 'C' | 'D' {
  const hit = PATHWAY_BY_CHAPTER_ID.get(chapterId)
  if (hit?.sub.role) return hit.sub.role
  if (title && /prove/i.test(title)) return 'D'
  if (title && /checkpoint|integrate/i.test(title)) return 'C'
  if (title && /apply/i.test(title)) return 'B'
  return 'A'
}

function withDepth(lessons: Record<string, LessonContent>): Record<string, LessonContent> {
  const out: Record<string, LessonContent> = {}
  for (const [id, lesson] of Object.entries(lessons)) {
    out[id] = deepenLessonToModule1Bar(lesson, roleFor(id, lesson.brief?.title), id)
  }
  return out
}

let _bundled: Record<string, LessonContent> | null = null

function getBundledLessons(): Record<string, LessonContent> {
  if (!_bundled) {
    _bundled = withDepth({
      ...getFactoryLessons(),
      ...MODULE1_LESSONS,
    })
  }
  return _bundled
}

/** All authored playable lessons — Module 01 + factory M02–M36, deepened to Module-1 bar. */
export const BUNDLED_LESSONS: Record<string, LessonContent> = new Proxy({} as Record<string, LessonContent>, {
  get(_t, prop, receiver) {
    return Reflect.get(getBundledLessons(), prop, receiver)
  },
  ownKeys() {
    return Reflect.ownKeys(getBundledLessons())
  },
  getOwnPropertyDescriptor(_t, prop) {
    return Reflect.getOwnPropertyDescriptor(getBundledLessons(), prop)
  },
  has(_t, prop) {
    return Reflect.has(getBundledLessons(), prop)
  },
})

/** Pathway order for every chapter that has bundled content. */
export const BUNDLED_CHAPTER_IDS: string[] = CATALOG_CHAPTER_IDS.filter((id) => {
  // Catalog ids are the source of truth; factory + module1 cover them.
  return FACTORY_CHAPTER_IDS.includes(id) || Boolean(MODULE1_LESSONS[id])
})

/** @deprecated Prefer BUNDLED_CHAPTER_IDS */
export const AUTHORED_CHAPTER_IDS = BUNDLED_CHAPTER_IDS

export function hasBundledLesson(chapterId: string): boolean {
  return Boolean(getBundledLessons()[chapterId])
}

export { MODULE1_CHAPTER_IDS, MODULE1_LESSONS, PHASE1_CHAPTER_IDS, FACTORY_CHAPTER_IDS }
export { getFactoryLessons, getPhase1Lessons }
export { CATALOG_CHAPTER_IDS }

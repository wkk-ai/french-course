import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { PATHWAY_BY_CHAPTER_ID, pathwayLabel } from '@/lib/pathway/catalog'
import { lemmaIdsForChapterId } from '@/lib/review/chapter-lemmas-data'
import { lemmaIdsFromLesson, vocabularyRowsForLemmas } from '@/lib/review/lemmas-from-lesson'

export { lemmaIdsFromLesson, vocabularyRowsForLemmas } from '@/lib/review/lemmas-from-lesson'

/** Client-safe packed index — no full lesson bodies. */
export function lemmaIdsForChapter(chapterId: string): string[] {
  return lemmaIdsForChapterId(chapterId)
}

let lemmaLessonCache: Map<string, string> | null = null

function lemmaLessonMap(): Map<string, string> {
  if (lemmaLessonCache) return lemmaLessonCache
  const map = new Map<string, string>()
  for (const chapterId of BUNDLED_CHAPTER_IDS) {
    for (const lemmaId of lemmaIdsForChapter(chapterId)) {
      if (!map.has(lemmaId)) map.set(lemmaId, chapterId)
    }
  }
  lemmaLessonCache = map
  return map
}

export function lessonLabelForLemma(lemmaId: string): string {
  const chapterId = lemmaLessonMap().get(lemmaId)
  if (!chapterId) return 'Earlier lesson'
  const hit = PATHWAY_BY_CHAPTER_ID.get(chapterId)
  if (hit) return pathwayLabel(hit.module.orderIndex, hit.sub)
  const index = BUNDLED_CHAPTER_IDS.indexOf(chapterId)
  return index >= 0 ? `Lesson ${index + 1}` : 'Earlier lesson'
}

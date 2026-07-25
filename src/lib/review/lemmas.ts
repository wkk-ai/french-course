import { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } from '@/lib/bundled-lessons'
import { BUNDLED_VOCABULARY } from '@/lib/phase1/content'
import type { VocabularyWord } from '@/lib/course'
import { isReviewablePartOfSpeech } from '@/lib/exercises/validate'
import { PATHWAY_BY_CHAPTER_ID, pathwayLabel } from '@/lib/pathway/catalog'

/** Collect unique lemma IDs from a bundled lesson (reading + dialogue). Skips proper nouns. */
export function lemmaIdsForChapter(chapterId: string): string[] {
  const lesson = BUNDLED_LESSONS[chapterId]
  if (!lesson) return []
  const byId = new Map(BUNDLED_VOCABULARY.map((word) => [word.id, word]))
  const ids = new Set<string>()
  const add = (lemmaId: string | undefined) => {
    if (!lemmaId) return
    const word = byId.get(lemmaId)
    if (word && !isReviewablePartOfSpeech(word.part_of_speech)) return
    ids.add(lemmaId)
  }
  for (const paragraph of lesson.reading ?? []) {
    for (const token of paragraph.tokens) add(token.lemmaId)
  }
  for (const line of lesson.conversation?.lines ?? []) {
    for (const token of line.tokens ?? []) add(token.lemmaId)
  }
  return [...ids]
}

export function vocabularyRowsForLemmas(lemmaIds: string[]): VocabularyWord[] {
  const byId = new Map(BUNDLED_VOCABULARY.map((word) => [word.id, word]))
  return lemmaIds
    .map((id) => byId.get(id))
    .filter((word): word is VocabularyWord => {
      if (!word) return false
      return isReviewablePartOfSpeech(word.part_of_speech)
    })
}

/** Map lemma → first authored chapter that taught it. */
let lemmaLessonCache: Map<string, string> | null = null

export function lessonLabelForLemma(vocabId: string | null | undefined): string | null {
  if (!vocabId) return null
  if (!lemmaLessonCache) {
    lemmaLessonCache = new Map()
    BUNDLED_CHAPTER_IDS.forEach((chapterId) => {
      const hit = PATHWAY_BY_CHAPTER_ID.get(chapterId)
      const display = hit
        ? pathwayLabel(hit.module.orderIndex, hit.sub)
        : `Lesson`
      for (const lemmaId of lemmaIdsForChapter(chapterId)) {
        if (!lemmaLessonCache!.has(lemmaId)) lemmaLessonCache!.set(lemmaId, display)
      }
    })
  }
  return lemmaLessonCache.get(vocabId) ?? null
}

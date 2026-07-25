import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS, MODULE1_VOCABULARY } from '@/lib/module1-content'
import type { VocabularyWord } from '@/lib/course'
import { isReviewablePartOfSpeech } from '@/lib/exercises/validate'
import { MODULE01_BY_ID, pathwayLabel } from '@/lib/pathway/module01'

/** Collect unique lemma IDs from a bundled Module 1 lesson (reading + dialogue). Skips proper nouns. */
export function lemmaIdsForChapter(chapterId: string): string[] {
  const lesson = MODULE1_LESSONS[chapterId]
  if (!lesson) return []
  const byId = new Map(MODULE1_VOCABULARY.map((word) => [word.id, word]))
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
  const byId = new Map(MODULE1_VOCABULARY.map((word) => [word.id, word]))
  return lemmaIds
    .map((id) => byId.get(id))
    .filter((word): word is VocabularyWord => {
      if (!word) return false
      return isReviewablePartOfSpeech(word.part_of_speech)
    })
}

/** Map lemma → first Module 1 chapter that taught it (e.g. "1.U1.A · First meetings"). */
let lemmaLessonCache: Map<string, string> | null = null

export function lessonLabelForLemma(vocabId: string | null | undefined): string | null {
  if (!vocabId) return null
  if (!lemmaLessonCache) {
    lemmaLessonCache = new Map()
    MODULE1_CHAPTER_IDS.forEach((chapterId, index) => {
      const pathway = MODULE01_BY_ID.get(chapterId)
      const display = pathway ? pathwayLabel(pathway) : `Lesson 1.${index + 1}`
      for (const lemmaId of lemmaIdsForChapter(chapterId)) {
        if (!lemmaLessonCache!.has(lemmaId)) lemmaLessonCache!.set(lemmaId, display)
      }
    })
  }
  return lemmaLessonCache.get(vocabId) ?? null
}

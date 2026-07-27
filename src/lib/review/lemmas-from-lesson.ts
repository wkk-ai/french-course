import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import type { LessonContent, VocabularyWord } from '@/lib/course'
import { isReviewablePartOfSpeech } from '@/lib/exercises/validate'

/** Collect unique lemma IDs from a lesson object. Client-safe — no packed index, no lesson bank. */
export function lemmaIdsFromLesson(lesson: LessonContent | null | undefined): string[] {
  if (!lesson) return []
  const byId = new Map(BUNDLED_VOCABULARY.map((word) => [word.id, word]))
  const ids = new Set<string>()
  const add = (lemmaId: string | undefined) => {
    if (!lemmaId) return
    const word = byId.get(lemmaId)
    if (!word) return
    if (!isReviewablePartOfSpeech(word.part_of_speech)) return
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

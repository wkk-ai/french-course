import { MODULE1_LESSONS, MODULE1_VOCABULARY } from '@/lib/module1-content'
import type { VocabularyWord } from '@/lib/course'

/** Collect unique lemma IDs from a bundled Module 1 lesson (reading + dialogue). */
export function lemmaIdsForChapter(chapterId: string): string[] {
  const lesson = MODULE1_LESSONS[chapterId]
  if (!lesson) return []
  const ids = new Set<string>()
  for (const paragraph of lesson.reading ?? []) {
    for (const token of paragraph.tokens) {
      if (token.lemmaId) ids.add(token.lemmaId)
    }
  }
  for (const line of lesson.conversation?.lines ?? []) {
    for (const token of line.tokens ?? []) {
      if (token.lemmaId) ids.add(token.lemmaId)
    }
  }
  return [...ids]
}

export function vocabularyRowsForLemmas(lemmaIds: string[]): VocabularyWord[] {
  const byId = new Map(MODULE1_VOCABULARY.map((word) => [word.id, word]))
  return lemmaIds.map((id) => byId.get(id)).filter((word): word is VocabularyWord => Boolean(word))
}

import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS, MODULE1_VOCABULARY } from '@/lib/module1-content'
import type { VocabularyWord } from '@/lib/course'
import { isReviewablePartOfSpeech } from '@/lib/exercises/validate'

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

const CHAPTER_TITLES: Record<string, string> = {
  '22222222-0000-0000-0000-000000000101': "Bonjour, je m'appelle…",
  '22222222-0000-0000-0000-000000000102': 'Les chiffres et le calendrier',
  '22222222-0000-0000-0000-000000000103': 'Au café',
  '22222222-0000-0000-0000-000000000104': 'Ma famille',
}

/** Map lemma → first Module 1 chapter that taught it (e.g. "Lesson 1.1 · Bonjour…"). */
let lemmaLessonCache: Map<string, string> | null = null

export function lessonLabelForLemma(vocabId: string | null | undefined): string | null {
  if (!vocabId) return null
  if (!lemmaLessonCache) {
    lemmaLessonCache = new Map()
    MODULE1_CHAPTER_IDS.forEach((chapterId, index) => {
      const label = `Lesson 1.${index + 1}`
      const title = CHAPTER_TITLES[chapterId]
      const display = title ? `${label} · ${title}` : label
      for (const lemmaId of lemmaIdsForChapter(chapterId)) {
        if (!lemmaLessonCache!.has(lemmaId)) lemmaLessonCache!.set(lemmaId, display)
      }
    })
  }
  return lemmaLessonCache.get(vocabId) ?? null
}

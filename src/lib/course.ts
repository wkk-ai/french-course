export type SyntaxClass = 'noun' | 'verb' | 'adj' | 'none'

export type WordToken = {
  id: string
  text: string
  syntax: SyntaxClass
  lemmaId?: string
  silentTail?: string
  liaisonAfter?: boolean
}

export type ReadingParagraph = {
  tokens: WordToken[]
  /** When true, render as a bullet list item (grouped with neighbors). */
  listItem?: boolean
}

import type { LessonExercise } from '@/lib/exercises/types'

export type { ExerciseAnswer, ExerciseSource, LessonExercise } from '@/lib/exercises/types'

export type ConversationLine = {
  speaker: string
  text: string
  tokens?: WordToken[]
}

export type LessonContent = {
  brief?: {
    title: string
    body: string
    ruleSlugs: string[]
  }
  reading?: ReadingParagraph[]
  conversation?: {
    title: string
    setting: string
    lines: ConversationLine[]
  }
  exercises?: LessonExercise[]
  wordCount?: number
}

export type VocabularyWord = {
  id: string
  word: string
  base_translation: string
  /** Additional senses beyond the primary translation. */
  meanings?: string[]
  /** Short usage example shown in the dictionary popup. */
  example?: { french: string; english: string }
  part_of_speech: string | null
  gender: string | null
  register: string
  ipa_pronunciation: string | null
  is_idiom: boolean
  is_slang: boolean
  idiom_explanation: string | null
}

export type VerbConjugation = {
  id: string
  vocab_id: string
  tense: string
  pronoun: string
  form: string
  order_index: number
}

export type { GrammarRule, GrammarRuleDocument, GrammarRuleSummary } from '@/lib/rules/types'

export function hasLessonContent(content: unknown): content is LessonContent {
  if (!content || typeof content !== 'object') return false
  const lesson = content as LessonContent
  return Boolean(lesson.brief && lesson.reading?.length && lesson.exercises?.length)
}

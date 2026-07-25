import type { LessonExercise } from '@/lib/exercises/types'
import type { LocalVaultItem } from '@/lib/local-vocab-vault'

export type ReviewPoolItem = LocalVaultItem & {
  source: 'remote' | 'local'
  word?: string | null
  base_translation?: string | null
  part_of_speech?: string | null
  register?: string | null
  example_french?: string | null
  example_english?: string | null
}

/** Kept for lesson analytics; no longer drives review session cards. */
export type ReviewMistake = {
  id: string
  error_count: number
  grammar_category: string | null
  error_context: string | null
  vocab_id?: string | null
  word?: string | null
  base_translation?: string | null
}

export type ReviewTaskKind = 'due' | 'overdue' | 'soon' | 'spiral' | 'weak'

export type ReviewTask = {
  id: string
  kind: ReviewTaskKind
  exercise: LessonExercise
  vocabId?: string
  poolItem?: ReviewPoolItem
  /** e.g. "Lesson 1.1 · Bonjour, je m'appelle…" */
  lessonLabel?: string | null
}

export type SessionMode = 'daily' | 'continue'

export type ReviewSessionPlan = {
  mode: SessionMode
  tasks: ReviewTask[]
  poolSize: number
  dueCount: number
  weakCount: number
  estimatedMinutes: number
}

export type FlashcardPosFilter = 'all' | 'verb' | 'noun' | 'adjective' | 'adverb' | 'pronoun'

export type FlashcardItem = ReviewPoolItem & {
  word: string
  base_translation: string
}

export type FlashcardDeck = {
  cards: FlashcardItem[]
  posFilter: FlashcardPosFilter
}

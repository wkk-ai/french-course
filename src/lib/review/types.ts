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

export type ReviewMistake = {
  id: string
  error_count: number
  grammar_category: string | null
  error_context: string | null
  vocab_id?: string | null
  word?: string | null
  base_translation?: string | null
}

export type ReviewTaskKind = 'due' | 'overdue' | 'soon' | 'spiral' | 'weak' | 'repair'

export type ReviewTask = {
  id: string
  kind: ReviewTaskKind
  exercise: LessonExercise
  vocabId?: string
  mistakeId?: string
  poolItem?: ReviewPoolItem
}

export type SessionMode = 'daily' | 'continue'

export type ReviewSessionPlan = {
  mode: SessionMode
  tasks: ReviewTask[]
  poolSize: number
  dueCount: number
  repairCount: number
  estimatedMinutes: number
}

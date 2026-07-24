export type ExerciseSource = 'reading' | 'dialogue' | 'grammar' | 'spiral' | 'remediation'

export type ExerciseBase = {
  id: string
  category: string
  prompt: string
  explanation: string
  source?: ExerciseSource
  hint?: string
}

/** Multiple choice — default when `type` is omitted (backward compatible). */
export type McqExercise = ExerciseBase & {
  type?: 'mcq'
  options: string[]
  answer: number
}

export type ClozeExercise = ExerciseBase & {
  type: 'cloze'
  /** Sentence with blank marked as ___ or _____ */
  text: string
  answers: string[]
}

export type SpotErrorExercise = ExerciseBase & {
  type: 'spot-error'
  sentence: string
  words: string[]
  errorIndex: number
}

export type MatchExercise = ExerciseBase & {
  type: 'match'
  left: string[]
  right: string[]
  /** Each pair is [leftIndex, rightIndex]. */
  pairs: [number, number][]
}

export type OrderExercise = ExerciseBase & {
  type: 'order'
  words: string[]
  answer: string[]
}

export type TranslateExercise = ExerciseBase & {
  type: 'translate'
  direction: 'fr-en' | 'en-fr'
  answers: string[]
}

export type TrueFalseExercise = ExerciseBase & {
  type: 'true-false'
  statement: string
  answer: boolean
}

export type ConjugationExercise = ExerciseBase & {
  type: 'conjugation'
  verb: string
  tense: string
  pronoun: string
  answers: string[]
}

export type RegisterExercise = ExerciseBase & {
  type: 'register'
  situation: string
  options: string[]
  answer: number
}

export type MinimalPairExercise = ExerciseBase & {
  type: 'minimal-pair'
  options: string[]
  answer: number
}

export type DialogueExercise = ExerciseBase & {
  type: 'dialogue'
  context: string
  options: string[]
  answer: number
}

export type ReadingExercise = ExerciseBase & {
  type: 'reading'
  options: string[]
  answer: number
}

export type LessonExercise =
  | McqExercise
  | ClozeExercise
  | SpotErrorExercise
  | MatchExercise
  | OrderExercise
  | TranslateExercise
  | TrueFalseExercise
  | ConjugationExercise
  | RegisterExercise
  | MinimalPairExercise
  | DialogueExercise
  | ReadingExercise

export type ExerciseAnswer =
  | { kind: 'choice'; value: number }
  | { kind: 'text'; value: string }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'index'; value: number }
  | { kind: 'match'; value: Record<number, number> }
  | { kind: 'order'; value: string[] }

export function exerciseType(exercise: LessonExercise): string {
  if (!('type' in exercise) || !exercise.type || exercise.type === 'mcq') return 'Multiple choice'
  const labels: Record<string, string> = {
    cloze: 'Fill in the blank',
    'spot-error': 'Spot the error',
    match: 'Match pairs',
    order: 'Word order',
    translate: 'Translation',
    'true-false': 'True or false',
    conjugation: 'Conjugation',
    register: 'Register',
    'minimal-pair': 'Choose the correct sentence',
    dialogue: 'Dialogue',
    reading: 'Reading comprehension',
  }
  return labels[exercise.type] ?? exercise.type
}

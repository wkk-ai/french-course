import type {
  ClozeExercise,
  ConjugationExercise,
  ExerciseAnswer,
  LessonExercise,
  MatchExercise,
  McqExercise,
  OrderExercise,
  SpotErrorExercise,
  TranslateExercise,
  TrueFalseExercise,
} from '@/lib/exercises/types'

/** Strip accents, case, and light punctuation for fuzzy French matching. */
export function normalizeFrenchInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, "'")
    .replace(/[.,!?;:…]+$/g, '')
    .replace(/\s+/g, ' ')
}

const UNITS = ['zero', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize']
const TENS: Record<string, number> = { vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60 }

/** "cinquante-deux" → 52, "soixante-dix" → 70, "quatre-vingt-dix" → 90 (0–100). Null if not a number word. */
export function frenchNumberValue(text: string): number | null {
  const t = normalizeFrenchInput(text).replace(/\s+et\s+/g, '-et-').replace(/\s+/g, '-')
  if (/^\d+$/.test(t)) return Number(t)
  if (t === 'cent') return 100
  if (t === 'une') return 1
  const simple = UNITS.indexOf(t)
  if (simple >= 0) return simple
  const parts = t.split('-').filter((part) => part !== 'et')
  let total = 0
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i]
    if (part === 'quatre' && parts[i + 1]?.startsWith('vingt')) { total += 80; i += 1; continue }
    if (TENS[part] !== undefined) { total += TENS[part]; continue }
    const unit = UNITS.indexOf(part === 'une' ? 'un' : part)
    if (unit >= 0) { total += unit; continue }
    if (part === 'dix') { total += 10; continue }
    return null
  }
  return parts.length ? total : null
}

function textMatches(answers: string[], input: string): boolean {
  const normalized = normalizeFrenchInput(input)
  if (!normalized) return false
  if (answers.some((answer) => normalizeFrenchInput(answer) === normalized)) return true
  // Numbers: accept digits for a number written in words (52 = cinquante-deux), and the reverse.
  const typed = frenchNumberValue(normalized)
  return typed !== null && answers.some((answer) => frenchNumberValue(answer) === typed)
}

export function isExerciseAnswered(exercise: LessonExercise, answer: ExerciseAnswer | undefined): boolean {
  if (!answer) return false
  const type = exercise.type ?? 'mcq'
  switch (type) {
    case 'cloze':
    case 'translate':
    case 'conjugation':
      return answer.kind === 'text' && answer.value.trim().length > 0
    case 'true-false':
      return answer.kind === 'boolean'
    case 'spot-error':
      return answer.kind === 'index'
    case 'match':
      return answer.kind === 'match' && Object.keys(answer.value).length === (exercise as MatchExercise).pairs.length
    case 'order':
      return answer.kind === 'order' && answer.value.length === (exercise as OrderExercise).answer.length
    case 'dialogue':
    case 'reading':
    case 'register':
    case 'minimal-pair':
    case 'mcq':
      return answer.kind === 'choice'
    default:
      return false
  }
}

export function isExerciseCorrect(exercise: LessonExercise, answer: ExerciseAnswer | undefined): boolean {
  if (!isExerciseAnswered(exercise, answer) || !answer) return false
  const type = exercise.type ?? 'mcq'

  switch (type) {
    case 'cloze':
      return answer.kind === 'text' && textMatches((exercise as ClozeExercise).answers, answer.value)
    case 'translate':
    case 'conjugation':
      return answer.kind === 'text' && textMatches((exercise as TranslateExercise | ConjugationExercise).answers, answer.value)
    case 'true-false':
      return answer.kind === 'boolean' && answer.value === (exercise as TrueFalseExercise).answer
    case 'spot-error':
      return answer.kind === 'index' && answer.value === (exercise as SpotErrorExercise).errorIndex
    case 'match': {
      if (answer.kind !== 'match') return false
      const matchExercise = exercise as MatchExercise
      return matchExercise.pairs.every(([left, right]) => answer.value[left] === right)
    }
    case 'order': {
      if (answer.kind !== 'order') return false
      const orderExercise = exercise as OrderExercise
      return orderExercise.answer.every((word, index) => normalizeFrenchInput(word) === normalizeFrenchInput(answer.value[index] ?? ''))
    }
    case 'dialogue':
    case 'reading':
    case 'register':
    case 'minimal-pair':
    case 'mcq':
      return answer.kind === 'choice' && answer.value === (exercise as McqExercise).answer
    default:
      return false
  }
}

export function correctAnswerLabel(exercise: LessonExercise): string {
  const type = exercise.type ?? 'mcq'
  switch (type) {
    case 'cloze':
    case 'translate':
    case 'conjugation':
      return (exercise as ClozeExercise).answers[0]
    case 'true-false':
      return (exercise as TrueFalseExercise).answer ? 'True' : 'False'
    case 'spot-error':
      return (exercise as SpotErrorExercise).words[(exercise as SpotErrorExercise).errorIndex]
    case 'match': {
      const matchExercise = exercise as MatchExercise
      return matchExercise.pairs.map(([left, right]) => `${matchExercise.left[left]} → ${matchExercise.right[right]}`).join('; ')
    }
    case 'order':
      return (exercise as OrderExercise).answer.join(' ')
    case 'dialogue':
    case 'reading':
    case 'register':
    case 'minimal-pair':
    case 'mcq':
      return (exercise as McqExercise).options[(exercise as McqExercise).answer]
    default:
      return ''
  }
}

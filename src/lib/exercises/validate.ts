import type { LessonExercise } from '@/lib/exercises/types'

const QUESTION_STARTERS = /^(who|what|when|where|why|how|which|is|are|do|does|did|can|could|would|should|most|least)\b/i

function rawType(exercise: LessonExercise): string {
  if (!('type' in exercise) || !exercise.type || exercise.type === 'mcq') return 'mcq'
  return exercise.type
}

/**
 * Guardrail: reject exercises that would render as nonsensical cards
 * (e.g. true-false whose "statement" is actually a question prompt).
 */
export function validateLessonExercise(exercise: LessonExercise): { ok: true } | { ok: false; reason: string } {
  if (!exercise.id || !exercise.prompt || !exercise.category) {
    return { ok: false, reason: 'Missing id, prompt, or category' }
  }

  const type = rawType(exercise)

  switch (type) {
    case 'true-false': {
      const statement = 'statement' in exercise ? exercise.statement?.trim() ?? '' : ''
      if (!statement) return { ok: false, reason: 'true-false missing statement' }
      if (statement.endsWith('?')) return { ok: false, reason: 'true-false statement must not be a question' }
      if (QUESTION_STARTERS.test(statement)) return { ok: false, reason: 'true-false statement looks like a question' }
      if (!('answer' in exercise) || typeof exercise.answer !== 'boolean') {
        return { ok: false, reason: 'true-false missing boolean answer' }
      }
      return { ok: true }
    }
    case 'mcq':
    case 'register':
    case 'minimal-pair':
    case 'dialogue':
    case 'reading': {
      const options = 'options' in exercise ? exercise.options : null
      const answer = 'answer' in exercise ? exercise.answer : null
      if (!options?.length) return { ok: false, reason: `${type} missing options` }
      if (typeof answer !== 'number' || answer < 0 || answer >= options.length) {
        return { ok: false, reason: `${type} has invalid answer index` }
      }
      return { ok: true }
    }
    case 'cloze':
    case 'translate':
    case 'conjugation': {
      const answers = 'answers' in exercise ? exercise.answers : null
      if (!answers?.length) return { ok: false, reason: `${type} missing answers` }
      if (type === 'cloze' && !('text' in exercise && exercise.text?.includes('___'))) {
        return { ok: false, reason: 'cloze text must include ___' }
      }
      return { ok: true }
    }
    case 'match': {
      if (!('left' in exercise) || !exercise.left?.length || !exercise.right?.length || !exercise.pairs?.length) {
        return { ok: false, reason: 'match missing left/right/pairs' }
      }
      return { ok: true }
    }
    case 'order': {
      if (rawType(exercise) !== 'order') return { ok: false, reason: 'not order' }
      const order = exercise as Extract<LessonExercise, { type: 'order' }>
      if (!order.words?.length || !order.answer?.length) {
        return { ok: false, reason: 'order missing words/answer' }
      }
      return { ok: true }
    }
    case 'spot-error': {
      const spot = exercise as Extract<LessonExercise, { type: 'spot-error' }>
      if (!spot.words?.length || spot.errorIndex < 0 || spot.errorIndex >= spot.words.length) {
        return { ok: false, reason: 'spot-error invalid words/errorIndex' }
      }
      return { ok: true }
    }
    default:
      return { ok: true }
  }
}

/** Categories that lessons use but that are intentionally not replayed as remediation drills. */
export const GRAMMAR_ONLY_CATEGORIES = new Set([
  'reading',
  'conversation',
  'vocab-meaning',
  'vocab-cloze',
  'vocab-produce',
  'vocab-repair',
  'review',
])

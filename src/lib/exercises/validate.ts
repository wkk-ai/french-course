import type { LessonExercise } from '@/lib/exercises/types'

const QUESTION_STARTERS = /^(who|what|when|where|why|how|which|is|are|do|does|did|can|could|would|should|most|least)\b/i

/** Story / character recall — learner must remember the text, not French. */
const STORY_MEMORY_RE =
  /\b(according to (the )?reading|in the reading|per the reading|chapter reading|appear in the (chapter )?reading|from the reading|in the (chapter )?story)\b/i

/** “Where does Marie live?”-style character quizzes (capitalized name after question). */
function hasCharacterFactPrompt(blob: string): boolean {
  const match = blob.match(/\b(where does|where do|who is|who are|what does)\s+(\S+)/i)
  if (!match) return false
  // Require a real capitalised name — not "you" / "we" ( /i would make [A-Z] match lowercase).
  return /^[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜÇ]/.test(match[2])
}

function rawType(exercise: LessonExercise): string {
  if (!('type' in exercise) || !exercise.type || exercise.type === 'mcq') return 'mcq'
  return exercise.type
}

/**
 * True when an exercise tests plot/character memory instead of French.
 * Keep reading passages for input; never quiz “what happened in the text.”
 */
export function isStoryMemoryExercise(exercise: Pick<LessonExercise, 'prompt'> & { context?: string }): boolean {
  const blob = `${exercise.prompt} ${'context' in exercise && typeof exercise.context === 'string' ? exercise.context : ''}`
  if (STORY_MEMORY_RE.test(blob)) return true
  if (hasCharacterFactPrompt(blob)) return true
  if (/\bwhat family members appear\b/i.test(blob)) return true
  if (/\bhow many weeks are in a year\b/i.test(blob) && /\breading\b/i.test(blob)) return true
  return false
}

/** Proper nouns (Marc, Paris as quiz targets) are not reviewable vocabulary. */
export function isReviewablePartOfSpeech(partOfSpeech: string | null | undefined): boolean {
  const normalized = (partOfSpeech ?? '').toLowerCase().trim()
  if (!normalized) return true
  if (normalized === 'proper noun' || normalized === 'proper_noun' || normalized === 'name') return false
  return true
}

/**
 * Guardrail: reject exercises that would render as nonsensical or non-linguistic cards.
 */
export function validateLessonExercise(exercise: LessonExercise): { ok: true } | { ok: false; reason: string } {
  if (!exercise.id || !exercise.prompt || !exercise.category) {
    return { ok: false, reason: 'Missing id, prompt, or category' }
  }

  if (isStoryMemoryExercise(exercise)) {
    return { ok: false, reason: 'Story/character memory — quiz French (vocab/grammar), not the reading plot' }
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

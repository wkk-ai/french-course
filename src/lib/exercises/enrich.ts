import type { LessonExercise } from '@/lib/exercises/types'
import { CHAPTER_EXERCISE_EXTRAS } from '@/lib/exercises/chapter-extras'
import { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } from '@/lib/bundled-lessons'
import { validateLessonExercise } from '@/lib/exercises/validate'
import { buildRemediationExercises } from '@/lib/exercises/remediation'

export { buildRemediationExercises } from '@/lib/exercises/remediation'

const FILL_IN_RE = /^(?:Complete|Fill in):\s*(.+)$/i

function inferSource(exercise: LessonExercise): LessonExercise {
  if (exercise.source) return exercise
  if (exercise.category === 'reading' || exercise.type === 'reading') return { ...exercise, source: 'reading' }
  if (exercise.category === 'conversation' || exercise.type === 'dialogue') return { ...exercise, source: 'dialogue' }
  return { ...exercise, source: 'grammar' }
}

/** Turn "Complete: Je ___ Marc." MCQs into typed clozes when the prompt is a blank sentence. */
function maybeConvertMcqToCloze(exercise: LessonExercise): LessonExercise {
  if (exercise.type && exercise.type !== 'mcq') return exercise
  const match = exercise.prompt.match(FILL_IN_RE)
  if (!match) return exercise
  const text = match[1].trim()
  if (!text.includes('___')) return exercise
  const mcq = exercise as { options: string[]; answer: number }
  const correct = mcq.options[mcq.answer]
  if (!correct) return exercise
  return {
    id: exercise.id,
    type: 'cloze',
    category: exercise.category,
    prompt: 'Type the missing word.',
    text,
    answers: [correct],
    explanation: exercise.explanation,
    source: exercise.source,
    hint: exercise.hint,
  }
}

function normalizeMcq(exercise: LessonExercise): LessonExercise {
  const withSource = inferSource(exercise)
  const converted = maybeConvertMcqToCloze(withSource)
  if (!converted.type || converted.type === 'mcq') {
    return { ...converted, type: 'mcq' }
  }
  return converted
}

function spiralExercises(chapterId: string, count = 3): LessonExercise[] {
  const index = BUNDLED_CHAPTER_IDS.indexOf(chapterId)
  if (index <= 0) return []
  const priorIds = BUNDLED_CHAPTER_IDS.slice(0, index)
  const pool: LessonExercise[] = []
  for (const priorId of priorIds) {
    const lesson = BUNDLED_LESSONS[priorId]
    if (!lesson?.exercises) continue
    for (const exercise of lesson.exercises) {
      pool.push({
        ...normalizeMcq(exercise),
        id: `spiral-${priorId.slice(-3)}-${exercise.id}`,
        source: 'spiral',
      })
    }
  }
  // Deterministic pick: spread across prior chapters.
  const picked: LessonExercise[] = []
  const step = Math.max(1, Math.floor(pool.length / count))
  for (let i = 0; i < pool.length && picked.length < count; i += step) {
    picked.push(pool[i])
  }
  return picked
}

/** Avoid long runs of the same grammar category. */
function interleaveExercises(exercises: LessonExercise[]): LessonExercise[] {
  const remaining = [...exercises]
  const result: LessonExercise[] = []
  let lastCategory = ''

  while (remaining.length > 0) {
    const alternateIndex = remaining.findIndex((item) => item.category !== lastCategory)
    const pickIndex = alternateIndex >= 0 ? alternateIndex : 0
    const [next] = remaining.splice(pickIndex, 1)
    result.push(next)
    lastCategory = next.category
  }
  return result
}

export function enrichLessonExercises(chapterId: string, base: LessonExercise[] = [], remediationCategories: string[] = []): LessonExercise[] {
  const normalized = base.map(normalizeMcq)
  const extras = CHAPTER_EXERCISE_EXTRAS[chapterId] ?? []
  const spiral = spiralExercises(chapterId)
  const remediation = buildRemediationExercises(remediationCategories)
  const merged = [...normalized, ...extras, ...spiral, ...remediation]
  const valid = merged.filter((exercise) => validateLessonExercise(exercise).ok)
  return interleaveExercises(valid)
}

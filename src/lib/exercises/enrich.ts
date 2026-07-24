import type { LessonExercise } from '@/lib/exercises/types'
import { CHAPTER_EXERCISE_EXTRAS } from '@/lib/exercises/chapter-extras'
import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '@/lib/module1-content'

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
  const index = MODULE1_CHAPTER_IDS.indexOf(chapterId as (typeof MODULE1_CHAPTER_IDS)[number])
  if (index <= 0) return []
  const priorIds = MODULE1_CHAPTER_IDS.slice(0, index)
  const pool: LessonExercise[] = []
  for (const priorId of priorIds) {
    const lesson = MODULE1_LESSONS[priorId]
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

export function buildRemediationExercises(categories: string[]): LessonExercise[] {
  const templates: Record<string, LessonExercise> = {
    'être-present': {
      id: 'remediation-etre',
      type: 'cloze',
      category: 'être-present',
      source: 'remediation',
      text: 'Tu ___ étudiant ?',
      answers: ['es'],
      prompt: 'Extra practice from your mistakes: type the verb.',
      explanation: 'Tu es — second person of être.',
    },
    'cest-versus-il-est': {
      id: 'remediation-cest',
      type: 'minimal-pair',
      category: 'cest-versus-il-est',
      source: 'remediation',
      options: ['C\'est Sophie.', 'Elle est Sophie.', 'Il est Sophie.'],
      answer: 0,
      prompt: 'Extra practice: identify Sophie by name.',
      explanation: 'C\'est + name.',
    },
    'avoir-age': {
      id: 'remediation-age',
      type: 'cloze',
      category: 'avoir-age',
      source: 'remediation',
      text: 'Elle ___ quinze ans.',
      answers: ['a'],
      prompt: 'Extra practice: age with avoir.',
      explanation: 'Elle a quinze ans.',
    },
    'tu-vous': {
      id: 'remediation-vous',
      type: 'register',
      category: 'tu-vous',
      source: 'remediation',
      situation: 'A customer speaks to a shopkeeper.',
      options: ['Tu veux quoi ?', 'Vous désirez ?', 'Salut toi !'],
      answer: 1,
      prompt: 'Extra practice: polite register.',
      explanation: 'Vous in service situations.',
    },
  }

  const seen = new Set<string>()
  const result: LessonExercise[] = []
  for (const category of categories) {
    if (seen.has(category)) continue
    const template = templates[category]
    if (!template) continue
    seen.add(category)
    result.push({ ...template, id: `${template.id}-${result.length}` })
  }
  return result.slice(0, 3)
}

export function enrichLessonExercises(chapterId: string, base: LessonExercise[] = [], remediationCategories: string[] = []): LessonExercise[] {
  const normalized = base.map(normalizeMcq)
  const extras = CHAPTER_EXERCISE_EXTRAS[chapterId] ?? []
  const spiral = spiralExercises(chapterId)
  const remediation = buildRemediationExercises(remediationCategories)
  const merged = [...normalized, ...extras, ...spiral, ...remediation]
  return interleaveExercises(merged)
}

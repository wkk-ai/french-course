import type { ExerciseAnswer, LessonExercise } from '@/lib/exercises/types'
import { isExerciseCorrect } from '@/lib/exercises/grading'

export function calculateLessonScore(answers: Record<string, ExerciseAnswer>, exercises: LessonExercise[]) {
  if (exercises.length === 0) return 100
  const correct = exercises.filter((exercise) => isExerciseCorrect(exercise, answers[exercise.id])).length
  return Math.round((correct / exercises.length) * 100)
}

/** @deprecated Use calculateLessonScore with exercise objects. */
export function calculateLessonScoreLegacy(answers: Record<string, number>, correctAnswers: Record<string, number>) {
  const ids = Object.keys(correctAnswers)
  if (ids.length === 0) return 100
  const correct = ids.filter((id) => answers[id] === correctAnswers[id]).length
  return Math.round((correct / ids.length) * 100)
}

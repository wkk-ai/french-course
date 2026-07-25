import type { ExerciseAnswer, LessonExercise } from '@/lib/exercises/types'
import { isExerciseCorrect } from '@/lib/exercises/grading'

/** Prove (D) pass bar — fail keeps unit incomplete. */
export const PROVE_PASS_SCORE = 70

export function didPassProve(score: number): boolean {
  return score >= PROVE_PASS_SCORE
}

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

export function calculateLessonScore(answers: Record<string, number>, correctAnswers: Record<string, number>) {
  const ids = Object.keys(correctAnswers)
  if (ids.length === 0) return 100
  const correct = ids.filter((id) => answers[id] === correctAnswers[id]).length
  return Math.round((correct / ids.length) * 100)
}

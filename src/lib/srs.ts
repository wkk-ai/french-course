export type SrsState = {
  repetitionCount: number
  easeFactor: number
  intervalDays: number
}

export function calculateSrsSchedule(state: SrsState, quality: number, from = new Date()) {
  let repetitionCount = state.repetitionCount
  let intervalDays = Math.max(state.intervalDays, 1)
  let easeFactor = state.easeFactor || 2.5

  if (quality >= 3) {
    intervalDays = repetitionCount === 0 ? 1 : repetitionCount === 1 ? 6 : Math.round(intervalDays * easeFactor)
    repetitionCount += 1
  } else {
    repetitionCount = 0
    intervalDays = 1
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  const nextReview = new Date(from)
  nextReview.setDate(nextReview.getDate() + intervalDays)

  return { repetitionCount, intervalDays, easeFactor, nextReview }
}

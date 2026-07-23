import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateLessonScore } from '../src/lib/lesson-score'
import { deriveChapterStatus } from '../src/lib/progression'
import { calculateSrsSchedule } from '../src/lib/srs'

test('the first authored lesson is active for a new learner', () => {
  assert.equal(deriveChapterStatus('one', ['one', 'two'], new Set()), 'active')
  assert.equal(deriveChapterStatus('two', ['one', 'two'], new Set()), 'locked')
  assert.equal(deriveChapterStatus('three', ['one', 'two'], new Set()), 'coming-soon')
})

test('completing a chapter exposes the next authored chapter', () => {
  const completed = new Set(['one'])
  assert.equal(deriveChapterStatus('one', ['one', 'two'], completed), 'completed')
  assert.equal(deriveChapterStatus('two', ['one', 'two'], completed), 'active')
})

test('SM-2 resets a missed card and scores contextual exercises', () => {
  const schedule = calculateSrsSchedule({ repetitionCount: 4, easeFactor: 2.5, intervalDays: 12 }, 1, new Date('2026-01-01T00:00:00Z'))
  assert.equal(schedule.repetitionCount, 0)
  assert.equal(schedule.intervalDays, 1)
  assert.equal(schedule.nextReview.toISOString(), '2026-01-02T00:00:00.000Z')
  assert.equal(calculateLessonScore({ a: 1, b: 2 }, { a: 1, b: 0 }), 50)
})

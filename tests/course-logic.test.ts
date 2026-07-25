import assert from 'node:assert/strict'
import test from 'node:test'
import { enrichTokens, syntaxFromPartOfSpeech } from '../src/lib/clickable-text'
import { filterCourseCatalog, LEGACY_MODULE_ID } from '../src/lib/course-catalog'
import { isExerciseCorrect } from '../src/lib/exercises/grading'
import { staggerReviewDates } from '../src/lib/local-vocab-vault'
import { resolveLessonContent } from '../src/lib/lesson-content'
import { calculateLessonScoreLegacy } from '../src/lib/lesson-score'
import { deriveChapterStatus } from '../src/lib/progression'
import { lemmaIdsForChapter, lessonLabelForLemma } from '../src/lib/review/lemmas'
import { buildReviewSession } from '../src/lib/review/session'
import { calculateSrsSchedule } from '../src/lib/srs'

test('legacy Module 1 duplicates are filtered from the catalog', () => {
  const { modules, chapters } = filterCourseCatalog(
    [
      { id: LEGACY_MODULE_ID, order_index: 1 },
      { id: '11111111-0000-0000-0000-000000000001', order_index: 1 },
      { id: '11111111-0000-0000-0000-000000000002', order_index: 2 },
    ],
    [
      { id: '22222222-2222-2222-2222-222222222222', module_id: LEGACY_MODULE_ID, order_index: 1 },
      { id: '22222222-0000-0000-0000-000000000101', module_id: '11111111-0000-0000-0000-000000000001', order_index: 1 },
    ]
  )
  assert.equal(modules.length, 2)
  assert.equal(modules[0].id, '11111111-0000-0000-0000-000000000001')
  assert.equal(chapters.length, 1)
  assert.equal(chapters[0].id, '22222222-0000-0000-0000-000000000101')
})

test('Module 1 lesson content resolves when the database stub is empty', () => {
  const content = resolveLessonContent('22222222-0000-0000-0000-000000000101', { tokens: [] })
  assert.ok(content?.brief)
  assert.ok(content?.reading?.length)
  assert.ok(content?.exercises?.length)
})

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
  assert.equal(calculateLessonScoreLegacy({ a: 1, b: 2 }, { a: 1, b: 0 }), 50)
})

test('enriched Module 1 lessons include varied exercise types', () => {
  const content = resolveLessonContent('22222222-0000-0000-0000-000000000101', { tokens: [] })
  const types = new Set((content?.exercises ?? []).map((exercise) => exercise.type ?? 'mcq'))
  assert.ok(types.has('mcq') || types.has('cloze'))
  assert.ok(types.has('match'))
  assert.ok(types.has('order'))
  assert.ok((content?.exercises?.length ?? 0) >= 30)
})

test('cloze grading accepts accents loosely', () => {
  const exercise = {
    id: 't',
    type: 'cloze' as const,
    category: 'test',
    prompt: 'x',
    text: 'Je ___',
    answers: ['suis'],
    explanation: 'x',
  }
  assert.equal(isExerciseCorrect(exercise, { kind: 'text', value: 'suis' }), true)
  assert.equal(isExerciseCorrect(exercise, { kind: 'text', value: 'wrong' }), false)
})

test('typed answers ignore uppercase', () => {
  const exercise = {
    id: 't',
    type: 'translate' as const,
    category: 'greetings',
    prompt: 'Translate',
    direction: 'en-fr' as const,
    answers: ['bonjour'],
    explanation: 'x',
  }
  assert.equal(isExerciseCorrect(exercise, { kind: 'text', value: 'Bonjour' }), true)
  assert.equal(isExerciseCorrect(exercise, { kind: 'text', value: 'BONJOUR' }), true)
  assert.equal(isExerciseCorrect(exercise, { kind: 'text', value: 'Bounjour' }), false)
})

test('enrichTokens assigns X-Ray syntax from part of speech', () => {
  assert.equal(syntaxFromPartOfSpeech('verb'), 'verb')
  assert.equal(syntaxFromPartOfSpeech('noun'), 'noun')
  const vocab = [{
    id: 'v1',
    word: 'être',
    base_translation: 'to be',
    part_of_speech: 'verb',
    gender: null,
    register: 'Courant',
    ipa_pronunciation: null,
    is_idiom: false,
    is_slang: false,
    idiom_explanation: null,
  }]
  const tokens = enrichTokens([{ id: '1', text: 'suis', syntax: 'none' }], vocab)
  assert.equal(tokens[0]?.syntax, 'verb')
})

test('infinite review session never empties when the pool has items', () => {
  const now = new Date('2026-07-24T12:00:00Z')
  const pool = Array.from({ length: 5 }, (_, index) => ({
    vocab_id: `10000000-0000-0000-0000-00000000000${index + 1}`,
    repetition_count: 0,
    ease_factor: 2.5,
    interval_days: 0,
    total_encounters: 1,
    mistake_count: index,
    next_review_at: new Date(now.getTime() + index * 86400000).toISOString(),
    last_reviewed_at: null,
    source: 'local' as const,
    word: ['bonjour', 'je', "s'appeler", 'Marc', 'être'][index],
    base_translation: ['hello', 'I', 'to be called', 'Marc', 'to be'][index],
  }))
  const daily = buildReviewSession(pool, [], 'daily', { size: 12 })
  assert.equal(daily.tasks.length, 12)
  assert.equal(daily.poolSize, 5)
  const cont = buildReviewSession(pool, [], 'continue', { size: 10 })
  assert.equal(cont.tasks.length, 10)
  const staggered = staggerReviewDates(pool.map((item) => item.vocab_id), now)
  assert.equal(staggered.size, 5)
  const immediate = [...staggered.values()].filter((value) => value === now.toISOString()).length
  assert.ok(immediate <= 10)
})

test('Module 1.1 ships enough lemmas for review backfill', () => {
  const ids = lemmaIdsForChapter('22222222-0000-0000-0000-000000000101')
  assert.ok(ids.length >= 40)
  const label = lessonLabelForLemma('32a8a816-c56b-4e67-8549-bdfbc98e9b60')
  assert.ok(label?.startsWith('Lesson 1.1'))
})

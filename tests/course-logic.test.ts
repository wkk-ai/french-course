import assert from 'node:assert/strict'
import test from 'node:test'
import { enrichTokens, syntaxFromPartOfSpeech } from '../src/lib/clickable-text'
import { filterCourseCatalog, LEGACY_MODULE_ID } from '../src/lib/course-catalog'
import { CHAPTER_EXERCISE_EXTRAS } from '../src/lib/exercises/chapter-extras'
import { buildRemediationExercises } from '../src/lib/exercises/enrich'
import { isExerciseCorrect } from '../src/lib/exercises/grading'
import { GRAMMAR_ONLY_CATEGORIES, validateLessonExercise } from '../src/lib/exercises/validate'
import { staggerReviewDates } from '../src/lib/local-vocab-vault'
import { resolveLessonContent } from '../src/lib/lesson-content'
import { calculateLessonScoreLegacy } from '../src/lib/lesson-score'
import { MODULE1_CHAPTER_IDS } from '../src/lib/module1-content'
import { deriveChapterStatus } from '../src/lib/progression'
import { buildFlashcardDeck, flashcardQuality } from '../src/lib/review/flashcards'
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
  const daily = buildReviewSession(pool, 'daily', { size: 12 })
  assert.equal(daily.tasks.length, 12)
  assert.equal(daily.poolSize, 5)
  assert.equal(daily.weakCount, 4)
  assert.ok(daily.tasks.every((task) => task.kind !== ('repair' as typeof task.kind)))
  const cont = buildReviewSession(pool, 'continue', { size: 10 })
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

test('exercise validator rejects true-false questions posing as statements', () => {
  const bad = validateLessonExercise({
    id: 'bad-tf',
    type: 'true-false',
    category: 'questions',
    prompt: 'Repair: confirm you understand this miss.',
    statement: 'Lesson exercise: Most polite form?',
    answer: true,
    explanation: 'x',
  })
  assert.equal(bad.ok, false)

  const good = validateLessonExercise({
    id: 'good-tf',
    type: 'true-false',
    category: 'greetings',
    prompt: 'Is this correct?',
    statement: 'Bonjour is used in the morning.',
    answer: true,
    explanation: 'x',
  })
  assert.equal(good.ok, true)
})

test('Module 1 lessons and chapter extras pass exercise validation', () => {
  for (const chapterId of MODULE1_CHAPTER_IDS) {
    const content = resolveLessonContent(chapterId, null)
    for (const exercise of content?.exercises ?? []) {
      const result = validateLessonExercise(exercise)
      assert.equal(result.ok, true, `${chapterId} ${exercise.id}: ${!result.ok ? result.reason : ''}`)
    }
  }
  for (const [chapterId, extras] of Object.entries(CHAPTER_EXERCISE_EXTRAS)) {
    for (const exercise of extras) {
      const result = validateLessonExercise(exercise)
      assert.equal(result.ok, true, `extra ${chapterId} ${exercise.id}: ${!result.ok ? result.reason : ''}`)
    }
  }
})

test('every content category has remediation or is grammar-only allowlisted', () => {
  const categories = new Set<string>()
  for (const extras of Object.values(CHAPTER_EXERCISE_EXTRAS)) {
    for (const exercise of extras) categories.add(exercise.category)
  }
  for (const chapterId of MODULE1_CHAPTER_IDS) {
    for (const exercise of resolveLessonContent(chapterId, null)?.exercises ?? []) {
      categories.add(exercise.category)
    }
  }
  for (const category of categories) {
    if (GRAMMAR_ONLY_CATEGORIES.has(category)) continue
    const remediation = buildRemediationExercises([category])
    assert.ok(remediation.length > 0, `missing remediation for category: ${category}`)
  }
})

test('flashcard deck prioritizes misses and filters by POS', () => {
  const now = new Date('2026-07-25T12:00:00Z').getTime()
  const pool = [
    {
      vocab_id: 'v1',
      repetition_count: 0,
      ease_factor: 2.5,
      interval_days: 1,
      total_encounters: 1,
      mistake_count: 3,
      next_review_at: new Date(now + 86400000).toISOString(),
      last_reviewed_at: null,
      source: 'local' as const,
      word: 'être',
      base_translation: 'to be',
      part_of_speech: 'verb',
    },
    {
      vocab_id: 'v2',
      repetition_count: 2,
      ease_factor: 2.5,
      interval_days: 6,
      total_encounters: 3,
      mistake_count: 0,
      next_review_at: new Date(now - 1000).toISOString(),
      last_reviewed_at: null,
      source: 'local' as const,
      word: 'café',
      base_translation: 'coffee',
      part_of_speech: 'noun',
    },
    {
      vocab_id: 'v3',
      repetition_count: 1,
      ease_factor: 2.5,
      interval_days: 1,
      total_encounters: 2,
      mistake_count: 0,
      next_review_at: new Date(now + 7 * 86400000).toISOString(),
      last_reviewed_at: new Date(now).toISOString(),
      source: 'local' as const,
      word: 'grand',
      base_translation: 'tall',
      part_of_speech: 'adjective',
    },
  ]
  const verbs = buildFlashcardDeck(pool, { posFilter: 'verb', size: 10, now })
  assert.equal(verbs.cards.length, 1)
  assert.equal(verbs.cards[0].word, 'être')
  const all = buildFlashcardDeck(pool, { posFilter: 'all', size: 10, now })
  assert.equal(all.cards[0].word, 'être')
  assert.equal(flashcardQuality('again'), 1)
  assert.equal(flashcardQuality('hard'), 3)
  assert.equal(flashcardQuality('easy'), 5)
})

test('repair-style mistake context is never turned into a true-false review card', () => {
  // Regression: grammar_category questions + error_context question prompt used to become T/F.
  const pool = [
    {
      vocab_id: '32a8a816-c56b-4e67-8549-bdfbc98e9b60',
      repetition_count: 0,
      ease_factor: 2.5,
      interval_days: 0,
      total_encounters: 1,
      mistake_count: 1,
      next_review_at: new Date().toISOString(),
      last_reviewed_at: null,
      source: 'local' as const,
      word: 'bonjour',
      base_translation: 'hello',
      part_of_speech: 'interjection',
    },
  ]
  const session = buildReviewSession(pool, 'daily', { size: 5 })
  assert.ok(session.tasks.every((task) => task.exercise.type !== 'true-false' || validateLessonExercise(task.exercise).ok))
  assert.ok(session.tasks.every((task) => !String(task.exercise.prompt).includes('Repair:')))
})

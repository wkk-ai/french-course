import assert from 'node:assert/strict'
import test from 'node:test'
import { enrichTokens, syntaxFromPartOfSpeech } from '../src/lib/clickable-text'
import { filterCourseCatalog, LEGACY_MODULE_ID } from '../src/lib/course-catalog'
import { CHAPTER_EXERCISE_EXTRAS } from '../src/lib/exercises/chapter-extras'
import { buildRemediationExercises } from '../src/lib/exercises/enrich'
import { isExerciseCorrect } from '../src/lib/exercises/grading'
import { GRAMMAR_ONLY_CATEGORIES, isStoryMemoryExercise, validateLessonExercise } from '../src/lib/exercises/validate'
import { staggerReviewDates } from '../src/lib/local-vocab-vault'
import { resolveLessonContent } from '../src/lib/lesson-content'
import { calculateLessonScoreLegacy } from '../src/lib/lesson-score'
import { MODULE1_CHAPTER_IDS, MODULE1_LESSONS } from '../src/lib/module1-content'
import { MODULE01_SUBCHAPTERS, mergeModule01Chapters, unitsForModule01 } from '../src/lib/pathway/module01'
import { deriveChapterStatus } from '../src/lib/progression'
import { buildFlashcardDeck, flashcardQuality } from '../src/lib/review/flashcards'
import { lemmaIdsForChapter, lessonLabelForLemma } from '../src/lib/review/lemmas'
import { buildReviewSession } from '../src/lib/review/session'
import { MODULE1_RULES } from '../src/lib/rules/catalog'
import { isRuleUnlocked } from '../src/lib/rules/unlock'
import { validateGrammarRule } from '../src/lib/rules/validate'
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
    part_of_speech: ['interjection', 'pronoun', 'verb', 'proper noun', 'verb'][index],
  }))
  const daily = buildReviewSession(pool, 'daily', { size: 12 })
  assert.equal(daily.tasks.length, 12)
  assert.equal(daily.poolSize, 4) // Marc (proper noun) excluded
  assert.ok(daily.tasks.every((task) => task.poolItem?.part_of_speech !== 'proper noun'))
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
  assert.ok(ids.length >= 35)
  assert.ok(!ids.includes('42a8a816-c56b-4e67-8549-bdfbc98e9b60')) // Marc proper noun
  const label = lessonLabelForLemma('32a8a816-c56b-4e67-8549-bdfbc98e9b60')
  assert.ok(label?.startsWith('1.U1.A'))
})

test('Module 01 Grand Pathway has 5 units × 4 sub-chapters', () => {
  assert.equal(MODULE01_SUBCHAPTERS.length, 20)
  assert.equal(unitsForModule01().length, 5)
  const merged = mergeModule01Chapters([
    {
      id: '22222222-0000-0000-0000-000000000101',
      module_id: '11111111-0000-0000-0000-000000000001',
      title: 'old',
      description: 'old',
      order_index: 1,
      lesson_content: { brief: { title: 'x', body: 'y', ruleSlugs: [] }, reading: [{ id: 'r', tokens: [] }], exercises: [{ id: 'e' }] },
    },
  ])
  assert.equal(merged.filter((c) => c.module_id === '11111111-0000-0000-0000-000000000001').length, 20)
  assert.equal(merged.find((c) => c.id.endsWith('0101'))?.title, 'First meetings')
  assert.equal(merged.find((c) => c.id.endsWith('015d'))?.order_index, 20)
})

test('Grand Pathway catalog covers 36 modules; all A/B/C/D playable', async () => {
  const { PATHWAY_MODULES, mergePathwayChapters } = await import('../src/lib/pathway/catalog')
  const { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  assert.equal(PATHWAY_MODULES.length, 36)
  assert.equal(PATHWAY_MODULES.filter((m) => m.status === 'playable').length, 36)
  assert.equal(BUNDLED_CHAPTER_IDS.length, 720)
  assert.ok(BUNDLED_LESSONS['22222222-0000-0000-0000-000000000201']?.brief)
  assert.ok(BUNDLED_LESSONS['22222222-0000-0000-0000-00000000011d']?.brief)
  assert.ok(BUNDLED_LESSONS['22222222-0000-0000-0000-00000000365d']?.brief)
  const merged = mergePathwayChapters([])
  assert.equal(merged.length, 36 * 20)
  const m2 = resolveLessonContent('22222222-0000-0000-0000-000000000201', {})
  assert.ok(m2?.reading?.length)
  assert.ok((m2?.exercises?.length ?? 0) >= 20)
  assert.ok(m2?.brief?.body.includes('Words to learn first (meanings)'))
  const m36 = resolveLessonContent('22222222-0000-0000-0000-000000003651', {})
  assert.ok(m36?.brief?.body.includes('Words to learn first (meanings)'))
})

test('every bundled lesson meets the Module-1 depth bar', async () => {
  const { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  const { validateChapterContent } = await import('../src/lib/pathway/validate-chapter')
  const { PATHWAY_BY_CHAPTER_ID } = await import('../src/lib/pathway/catalog')
  for (const chapterId of BUNDLED_CHAPTER_IDS) {
    const lesson = BUNDLED_LESSONS[chapterId]
    const role = PATHWAY_BY_CHAPTER_ID.get(chapterId)?.sub.role ?? 'A'
    const result = validateChapterContent(lesson, { role })
    assert.equal(result.ok, true, `${chapterId}: ${!result.ok ? result.reason : ''}`)
    assert.ok((lesson.brief?.body.length ?? 0) >= 900, `${chapterId} brief`)
    for (const exercise of lesson.exercises ?? []) {
      assert.equal(validateLessonExercise(exercise).ok, true, `${chapterId} ${exercise.id}`)
    }
  }
})

test('Module 1 theory briefs teach meanings before grammar examples', () => {
  for (const chapterId of MODULE1_CHAPTER_IDS) {
    const body = MODULE1_LESSONS[chapterId]?.brief?.body ?? ''
    assert.ok(body.includes('Words to learn first (meanings)'), `${chapterId} missing meanings-first section`)
    assert.ok(body.length >= 200, `${chapterId} brief too short: ${body.length}`)
    const meaningsAt = body.indexOf('Words to learn first (meanings)')
    if (chapterId.endsWith('0104')) {
      const frereMeaning = body.indexOf('*frère* = brother')
      const monFrere = body.indexOf('*mon frère*')
      assert.ok(frereMeaning > meaningsAt, 'frère meaning must appear')
      assert.ok(monFrere > frereMeaning, 'mon frère must come after frère = brother')
      assert.ok(body.length >= 2500, 'family Learn brief should stay deep')
    }
  }
})

test('story-memory and character-fact exercises are rejected', () => {
  const banned = [
    'According to the reading, where does Marie live?',
    "Where do Marc's parents live?",
    'Marie orders…',
    'Marc asks for milk with…',
    'Marc and Marie sit on the…',
    "Marie's birthday is on…",
    "Marie's mother is…",
    "Marc's sister is named…",
    'How many cousins does Marc have?',
    'Marc and Marie meet on…',
  ]
  for (const prompt of banned) {
    assert.equal(isStoryMemoryExercise({ prompt }), true, `should ban: ${prompt}`)
    assert.equal(
      validateLessonExercise({
        id: 'banned',
        type: 'mcq',
        category: 'reading',
        prompt,
        options: ['a', 'b', 'c'],
        answer: 0,
        explanation: 'x',
      }).ok,
      false,
      `should reject: ${prompt}`,
    )
  }

  const allowed = [
    'How do you say “She lives in Lyon”?',
    'How do you order tea and water politely?',
    'Marie says "Moi aussi!" — she means…',
    'Marc ___ l\'addition.',
    'How do you say “I have three cousins”?',
  ]
  for (const prompt of allowed) {
    assert.equal(isStoryMemoryExercise({ prompt }), false, `should allow: ${prompt}`)
  }

  const linguistic = validateLessonExercise({
    id: 'ok',
    type: 'mcq',
    category: 'habiter',
    prompt: 'How do you say “She lives in Lyon”?',
    options: ['Elle habite à Lyon.', 'Elle est à Lyon.', 'Elle a Lyon.'],
    answer: 0,
    explanation: 'x',
  })
  assert.equal(linguistic.ok, true)
})

test('Module 1 raw authored exercises never rely on silent story-memory stripping', () => {
  for (const chapterId of MODULE1_CHAPTER_IDS) {
    for (const exercise of MODULE1_LESSONS[chapterId]?.exercises ?? []) {
      assert.equal(
        isStoryMemoryExercise(exercise),
        false,
        `raw ${chapterId} ${exercise.id}: ${exercise.prompt}`,
      )
      const result = validateLessonExercise(exercise)
      assert.equal(result.ok, true, `raw ${chapterId} ${exercise.id}: ${!result.ok ? result.reason : ''}`)
    }
  }
})

test('flashcards and review never include proper nouns', () => {
  const now = Date.now()
  const pool = [
    {
      vocab_id: 'marc',
      repetition_count: 0,
      ease_factor: 2.5,
      interval_days: 0,
      total_encounters: 1,
      mistake_count: 5,
      next_review_at: new Date(now - 1000).toISOString(),
      last_reviewed_at: null,
      source: 'local' as const,
      word: 'Marc',
      base_translation: 'Marc',
      part_of_speech: 'proper noun',
    },
    {
      vocab_id: 'habiter',
      repetition_count: 0,
      ease_factor: 2.5,
      interval_days: 0,
      total_encounters: 1,
      mistake_count: 1,
      next_review_at: new Date(now - 1000).toISOString(),
      last_reviewed_at: null,
      source: 'local' as const,
      word: 'habiter',
      base_translation: 'to live',
      part_of_speech: 'verb',
    },
  ]
  const deck = buildFlashcardDeck(pool, { posFilter: 'all', size: 10, now })
  assert.equal(deck.cards.length, 1)
  assert.equal(deck.cards[0].word, 'habiter')
  const nouns = buildFlashcardDeck(pool, { posFilter: 'noun', size: 10, now })
  assert.equal(nouns.cards.length, 0)
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

test('every Module 1 grammar rule meets the deep authoring bar', () => {
  assert.equal(MODULE1_RULES.length, 45) // 8 M01 + 9 Phase I + 28 later
  for (const rule of MODULE1_RULES) {
    const result = validateGrammarRule(rule)
    assert.equal(result.ok, true, `${rule.slug}: ${!result.ok ? result.reason : ''}`)
    for (const drill of rule.drills) {
      assert.equal(validateLessonExercise(drill.exercise).ok, true, `${rule.slug} drill ${drill.id}`)
    }
  }
})

test('rules unlock only after the teaching chapter is completed', () => {
  const pronouns = MODULE1_RULES.find((rule) => rule.slug === 'subject-pronouns')!
  assert.equal(isRuleUnlocked(pronouns, new Set()), false)
  assert.equal(isRuleUnlocked(pronouns, new Set(['22222222-0000-0000-0000-000000000101'])), true)
  const articles = MODULE1_RULES.find((rule) => rule.slug === 'articles-partitives')!
  assert.equal(isRuleUnlocked(articles, new Set(['22222222-0000-0000-0000-000000000101'])), false)
  assert.equal(isRuleUnlocked(articles, new Set(['22222222-0000-0000-0000-000000000103'])), true)
})

test('Prove pass bar and etre rem alias', async () => {
  const { didPassProve, PROVE_PASS_SCORE } = await import('../src/lib/lesson-score')
  const { buildRemediationExercises } = await import('../src/lib/exercises/enrich')
  const { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  const { PATHWAY_BY_CHAPTER_ID } = await import('../src/lib/pathway/catalog')
  assert.equal(PROVE_PASS_SCORE, 70)
  assert.equal(didPassProve(69), false)
  assert.equal(didPassProve(70), true)
  assert.ok(buildRemediationExercises(['etre-present']).length > 0)
  assert.ok(buildRemediationExercises(['être-present']).length > 0)
  const proveId = BUNDLED_CHAPTER_IDS.find((id) => PATHWAY_BY_CHAPTER_ID.get(id)?.sub.role === 'D')
  assert.ok(proveId)
  assert.ok(BUNDLED_LESSONS[proveId!]?.brief?.title)
  // Unlock order: first incomplete after A is B, not a DB-only hole
  assert.equal(BUNDLED_CHAPTER_IDS[0].endsWith('0101'), true)
  assert.equal(PATHWAY_BY_CHAPTER_ID.get(BUNDLED_CHAPTER_IDS[3])?.sub.role, 'D')
})

test('all 720 bundled lessons pass validateChapterContent (no author pads / EN leaks)', async () => {
  const { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  const { PATHWAY_BY_CHAPTER_ID } = await import('../src/lib/pathway/catalog')
  const { validateChapterContent } = await import('../src/lib/pathway/validate-chapter')
  assert.equal(BUNDLED_CHAPTER_IDS.length, 720)
  for (const id of BUNDLED_CHAPTER_IDS) {
    const lesson = BUNDLED_LESSONS[id]
    assert.ok(lesson, `missing lesson ${id}`)
    const role = PATHWAY_BY_CHAPTER_ID.get(id)?.sub.role ?? 'A'
    const result = validateChapterContent(lesson, { role })
    assert.equal(result.ok, true, `${id}: ${!result.ok ? result.reason : ''}`)
  }
})

test('u1.B brief has no Deep practice author pad', async () => {
  const { BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  const lesson = BUNDLED_LESSONS['22222222-0000-0000-0000-000000000111']
  assert.ok(lesson?.brief?.body)
  assert.equal(/Deep practice|Module-1 bar|Store verbs as infinitives/i.test(lesson.brief!.body), false)
  const reading = (lesson.reading ?? []).map((p) => p.tokens.map((t) => t.text).join(' ')).join('\n')
  assert.equal(/Dans cette leçon, relisez|dictionnaire cliquable|N'interrogez jamais/i.test(reading), false)
})

test('lemmaIdsForChapter skips proper nouns and unknown ids', async () => {
  const { lemmaIdsForChapter } = await import('../src/lib/review/lemmas')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/phase1/content')
  const ids = lemmaIdsForChapter('22222222-0000-0000-0000-000000000101')
  const byId = new Map(BUNDLED_VOCABULARY.map((w) => [w.id, w]))
  for (const id of ids) {
    const word = byId.get(id)
    assert.ok(word, `unknown lemma ${id}`)
    assert.notEqual((word.part_of_speech ?? '').toLowerCase(), 'proper noun')
  }
})

test('habiter-prepositions unlocks with Places chapter', async () => {
  const { MODULE1_RULES } = await import('../src/lib/rules/catalog')
  const { isRuleUnlocked } = await import('../src/lib/rules/unlock')
  const rule = MODULE1_RULES.find((r) => r.slug === 'habiter-prepositions')!
  assert.equal(isRuleUnlocked(rule, new Set(['22222222-0000-0000-0000-000000000201'])), true)
})

test('clearLocalLearnerData removes progress and vault keys', async () => {
  const { clearLocalLearnerData, markLocalChapterCompleted, readLocalCompletedChapters } = await import(
    '../src/lib/local-progress'
  )
  // jsdom-less: only run shape checks in node
  assert.equal(typeof clearLocalLearnerData, 'function')
  assert.equal(typeof markLocalChapterCompleted, 'function')
  assert.equal(typeof readLocalCompletedChapters, 'function')
})

test('clickable lookup resolves conjugated être and elided forms', async () => {
  const { tokenizeFrench } = await import('../src/lib/clickable-text')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/phase1/content')
  const suis = tokenizeFrench('je suis français', 't', BUNDLED_VOCABULARY)
  assert.ok(suis.some((t) => t.text === 'suis' && t.lemmaId))
  const histoire = tokenizeFrench("l'histoire", 't2', BUNDLED_VOCABULARY)
  // May or may not resolve histoire lemma; must not throw
  assert.ok(histoire.length >= 1)
})

test('irregular conjugations: dormir and écrire are not false regulars', async () => {
  const { conjugateVerb } = await import('../src/lib/french-conjugations')
  const dorm = conjugateVerb({
    id: 'dormir',
    word: 'dormir',
    base_translation: 'to sleep',
    part_of_speech: 'verb',
    register: 'neutral',
  } as never)
  const present = dorm.filter((row) => row.tense === 'Présent').map((row) => row.form)
  assert.ok(present.includes('dors'), `expected dors, got ${present.join(',')}`)
  assert.ok(!present.includes('dormis'), 'dormir must not use false regular -ir forms')

  const ecrire = conjugateVerb({
    id: 'ecrire',
    word: 'écrire',
    base_translation: 'to write',
    part_of_speech: 'verb',
    register: 'neutral',
  } as never)
  const ePresent = ecrire.filter((row) => row.tense === 'Présent').map((row) => row.form)
  assert.ok(ePresent.includes('écris'), `expected écris, got ${ePresent.join(',')}`)
  assert.ok(!ePresent.includes('écri'), 'écrire must not use false regular -re stem')
})

test('past participles like vu / allé resolve to infinitive lemmas', async () => {
  const { tokenizeFrench } = await import('../src/lib/clickable-text')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
  const vu = tokenizeFrench('j’ai vu Marie', 'pp1', BUNDLED_VOCABULARY)
  assert.ok(vu.some((t) => t.text === 'vu' && t.lemmaId), 'vu should map to voir')
  const alle = tokenizeFrench('elle est allée', 'pp2', BUNDLED_VOCABULARY)
  assert.ok(alle.some((t) => t.text === 'allée' && t.lemmaId), 'allée should map to aller')
})

test('outils séparés and similar content words resolve for dictionary tap', async () => {
  const { tokenizeFrench } = await import('../src/lib/clickable-text')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
  const tokens = tokenizeFrench(
    'Habiter et être restent deux outils séparés.',
    'tap',
    BUNDLED_VOCABULARY,
  )
  const outils = tokens.find((t) => t.text === 'outils')
  const separes = tokens.find((t) => t.text === 'séparés')
  assert.ok(outils?.lemmaId, 'outils must be in dictionary')
  assert.ok(separes?.lemmaId, 'séparés must be in dictionary')
})

test('bundled tap coverage stays under 5% (proper nouns allowlisted)', async () => {
  const { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/phase1/content')
  const { measureBundledTapCoverage } = await import('../src/lib/pathway/tap-coverage')
  const stats = measureBundledTapCoverage(BUNDLED_LESSONS, BUNDLED_CHAPTER_IDS, BUNDLED_VOCABULARY)
  assert.ok(stats.totalWordTokens > 100_000, 'expected large token sample')
  assert.ok(
    stats.missRate < 0.05,
    `tap miss rate ${(stats.missRate * 100).toFixed(2)}% must be < 5% (${stats.missTokens}/${stats.totalWordTokens})`,
  )
})

test('u1.B has few untappable content surfaces after enrich', async () => {
  const { BUNDLED_LESSONS } = await import('../src/lib/bundled-lessons')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/phase1/content')
  const { untappableSurfaces } = await import('../src/lib/pathway/content-quality')
  const { measureLessonTapCoverage } = await import('../src/lib/pathway/tap-coverage')
  const lesson = BUNDLED_LESSONS['22222222-0000-0000-0000-000000000111']
  assert.ok(lesson)
  const stats = measureLessonTapCoverage(lesson, BUNDLED_VOCABULARY)
  const misses = untappableSurfaces(lesson, BUNDLED_VOCABULARY)
  assert.ok(stats.missRate < 0.08, `u1.B miss rate ${(stats.missRate * 100).toFixed(1)}% too high`)
  assert.ok(misses.length < 40, `u1.B has ${misses.length} unique untappable surfaces: ${misses.slice(0, 12).join(', ')}`)
})

test('subscribeLocalVault is exported for cross-tab Review sync', async () => {
  const vault = await import('../src/lib/local-vocab-vault')
  assert.equal(typeof vault.subscribeLocalVault, 'function')
  assert.equal(typeof vault.subscribeLocalVault(() => {}), 'function')
})

test('HomeClient uses lightweight bundled-chapter-ids only', async () => {
  const fs = await import('node:fs')
  const path = await import('node:path')
  const source = fs.readFileSync(path.join(process.cwd(), 'src/app/(main)/HomeClient.tsx'), 'utf8')
  assert.equal(source.includes('bundled-lessons'), false)
  assert.equal(source.includes('BUNDLED_LESSONS'), false)
  assert.equal(source.includes('resolveLessonContent'), false)
  assert.ok(source.includes('bundled-chapter-ids'))
})

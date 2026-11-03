import assert from 'node:assert/strict'
import test from 'node:test'

test('units: one lesson per unit, 180 in total, ids are the old A chapters', async () => {
  const { UNIT_LESSONS, UNIT_LESSON_IDS } = await import('../src/lib/pathway/units')
  const { PATHWAY_BY_CHAPTER_ID } = await import('../src/lib/pathway/catalog')
  assert.equal(UNIT_LESSONS.length, 180)
  assert.equal(new Set(UNIT_LESSON_IDS).size, 180)
  for (const unit of UNIT_LESSONS) {
    assert.equal(PATHWAY_BY_CHAPTER_ID.get(unit.id)?.sub.role, 'A', `${unit.id} should be the unit's A chapter`)
    assert.ok(!/·\s*unit/i.test(unit.title), `bad unit title: ${unit.title}`)
    assert.equal(unit.legacyIds.length, 4)
  }
})

test('units: finishing an old B/C/D chapter counts its unit as done', async () => {
  const { UNIT_LESSONS, completedUnitIds } = await import('../src/lib/pathway/units')
  const unit = UNIT_LESSONS[7]
  assert.ok(completedUnitIds([unit.legacyIds[3]]).has(unit.id))
})

test('units: every unit has a playable lesson without junk questions', async () => {
  const { UNIT_LESSON_IDS } = await import('../src/lib/pathway/units')
  const { resolveUnitLesson, isJunkExercise } = await import('../src/lib/units/lessons')
  for (const id of UNIT_LESSON_IDS) {
    const lesson = resolveUnitLesson(id)
    assert.ok(lesson?.brief && lesson.reading?.length && lesson.exercises?.length, `${id}: empty lesson`)
    assert.ok(lesson.exercises.length >= 10, `${id}: only ${lesson.exercises.length} exercises`)
    assert.deepEqual(lesson.exercises.filter(isJunkExercise).map((e) => e.prompt), [], `${id}: junk left`)
  }
})

test('hand-written units meet the bar: meanings first, long reading, dialogue, 24+ exercises, every word tappable', async () => {
  const { UNIT_SPECS } = await import('../src/lib/units/specs')
  const { resolveUnitLesson } = await import('../src/lib/units/lessons')
  const { validateLessonExercise } = await import('../src/lib/exercises/validate')
  const { isExerciseCorrect } = await import('../src/lib/exercises/grading')
  for (const spec of UNIT_SPECS) {
    const lesson = resolveUnitLesson(spec.id)!
    assert.match(lesson.brief!.body, /\*\*1\. Words to learn first \(meanings\)\*\*/, `${spec.key}: brief must open with meanings`)
    assert.ok((lesson.wordCount ?? 0) >= 220, `${spec.key}: reading has ${lesson.wordCount} words`)
    assert.ok(lesson.conversation!.lines.length >= 12, `${spec.key}: dialogue too short`)
    assert.ok(lesson.exercises!.length >= 24, `${spec.key}: ${lesson.exercises!.length} exercises`)
    const types = new Set(lesson.exercises!.map((e) => e.type))
    assert.ok(types.size >= 7, `${spec.key}: only ${types.size} exercise types`)
    const ids = new Set<string>()
    for (const exercise of lesson.exercises!) {
      assert.ok(!ids.has(exercise.id), `${exercise.id} duplicated`)
      ids.add(exercise.id)
      assert.ok(validateLessonExercise(exercise).ok, `${exercise.id} invalid: ${JSON.stringify(validateLessonExercise(exercise))}`)
      if (exercise.type === 'spot-error') assert.ok(exercise.errorIndex >= 0, `${exercise.id}: error word not found`)
      if ('options' in exercise) assert.equal(new Set(exercise.options).size, exercise.options.length, `${exercise.id}: duplicate options`)
      if (exercise.type === 'order') {
        assert.ok(isExerciseCorrect(exercise, { kind: 'order', value: exercise.answer }), `${exercise.id}: order answer fails`)
        assert.notDeepEqual(exercise.words, exercise.answer, `${exercise.id}: words already in order`)
      }
    }
    const missing = new Set<string>()
    for (const token of [...lesson.reading!.flatMap((p) => p.tokens), ...lesson.conversation!.lines.flatMap((l) => l.tokens ?? [])]) {
      if (/[A-Za-zÀ-ÿœ]/.test(token.text) && !token.lemmaId) missing.add(token.text)
    }
    assert.deepEqual([...missing], [], `${spec.key}: words with no dictionary entry`)
    for (const group of spec.words) for (const word of group.items) {
      if (word.pos === 'verb') assert.ok(/(er|ir|re|oir)$/.test(word.fr), `${spec.key}: verb not an infinitive: ${word.fr}`)
    }
  }
})

test('unit index file is up to date (run npx tsx scripts/emit-unit-index.ts)', async () => {
  const fs = await import('node:fs')
  const { unitIndexSource } = await import('../scripts/emit-unit-index')
  assert.equal(fs.readFileSync('src/lib/units/index.generated.ts', 'utf8'), unitIndexSource())
})

test('common forms point to the right word in the dictionary', async () => {
  const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
  const { buildLemmaLookup, lookupLemma } = await import('../src/lib/clickable-text')
  const lookup = buildLemmaLookup(BUNDLED_VOCABULARY)
  const word = (surface: string) => BUNDLED_VOCABULARY.find((w) => w.id === lookupLemma(lookup, surface))?.word
  assert.equal(word('suis'), 'être')
  assert.equal(word('as'), 'avoir')
  assert.equal(word('mais'), 'mais')
  assert.equal(word('marché'), 'marché')
  assert.equal(word('déjeune'), 'déjeuner')
  assert.equal(word("qu'ils"), 'ils')
  assert.equal(word('pars'), 'partir')
  assert.equal(word('dors'), 'dormir')
})

test('typed answers: digits count for numbers written in words', async () => {
  const { isExerciseCorrect } = await import('../src/lib/exercises/grading')
  const cloze = { id: 'n', type: 'cloze', category: 'x', prompt: 'p', text: 'Une année a ___ semaines.', answers: ['cinquante-deux'], explanation: 'e' } as never
  assert.ok(isExerciseCorrect(cloze, { kind: 'text', value: '52' }))
  assert.ok(isExerciseCorrect(cloze, { kind: 'text', value: 'Cinquante deux' }))
  assert.ok(!isExerciseCorrect(cloze, { kind: 'text', value: '53' }))
})

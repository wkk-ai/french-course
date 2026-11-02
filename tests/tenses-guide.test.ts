import assert from 'node:assert/strict'
import test from 'node:test'

test('tenses guide: every goal is complete and every quiz is answerable', async () => {
  const { TENSE_GOALS } = await import('../src/lib/tenses/guide')
  const slugs = new Set<string>()
  for (const goal of TENSE_GOALS) {
    assert.ok(!slugs.has(goal.slug), `duplicate slug ${goal.slug}`)
    slugs.add(goal.slug)
    assert.ok(goal.whenToUse.length >= 3, `${goal.slug}: need 3+ when-to-use lines`)
    assert.ok(goal.steps.length >= 2, `${goal.slug}: need 2+ steps`)
    assert.ok(goal.life.length >= 3, `${goal.slug}: need 3+ everyday examples`)
    assert.ok(goal.work.length >= 3, `${goal.slug}: need 3+ work examples`)
    assert.ok(goal.traps.length >= 2, `${goal.slug}: need 2+ traps`)
    assert.ok(goal.quiz.length >= 3, `${goal.slug}: need 3+ quiz questions`)
    for (const example of [...goal.life, ...goal.work]) {
      assert.ok(example.en.trim().length > 0, `${goal.slug}: missing English for "${example.fr}"`)
      assert.notEqual(example.en.trim(), example.fr.trim(), `${goal.slug}: English equals French for "${example.fr}"`)
    }
    const ids = new Set<string>()
    for (const question of goal.quiz) {
      assert.ok(!ids.has(question.id), `${goal.slug}: duplicate quiz id ${question.id}`)
      ids.add(question.id)
      assert.ok(question.options.length >= 2, `${question.id}: need 2+ options`)
      assert.equal(new Set(question.options).size, question.options.length, `${question.id}: duplicate options`)
      assert.ok(question.answer >= 0 && question.answer < question.options.length, `${question.id}: answer index out of range`)
      assert.ok(question.explanation.trim().length > 0, `${question.id}: missing explanation`)
    }
  }
})

test('tenses guide: phrases are elided and agree like real French', async () => {
  const { conjugationPhrase } = await import('../src/lib/tenses/format')
  assert.equal(conjugationPhrase({ tense: 'Présent', pronoun: 'je', form: 'ai' }), "j'ai")
  assert.equal(conjugationPhrase({ tense: 'Imparfait', pronoun: 'je', form: 'étais' }), "j'étais")
  assert.equal(conjugationPhrase({ tense: 'Futur simple', pronoun: 'je', form: 'irai' }), "j'irai")
  assert.equal(conjugationPhrase({ tense: 'Présent', pronoun: 'je', form: 'parle' }), 'je parle')
  assert.equal(conjugationPhrase({ tense: 'Passé composé', pronoun: 'je', form: "j'ai parlé" }), "j'ai parlé")
  assert.equal(conjugationPhrase({ tense: 'Passé composé', pronoun: 'nous', form: 'sommes allé' }), 'nous sommes allé(e)s')
  assert.equal(conjugationPhrase({ tense: 'Passé composé', pronoun: 'vous', form: 'êtes allé' }), 'vous êtes allé(e)(s)')
  assert.equal(conjugationPhrase({ tense: 'Passé composé', pronoun: 'nous', form: 'avons mangé' }), 'nous avons mangé')
  assert.equal(conjugationPhrase({ tense: 'Impératif', pronoun: 'tu', form: 'parle' }), 'parle !')
})

test('tenses guide: generated tables have no double pronouns or missing elision', async () => {
  const { TENSE_GOALS } = await import('../src/lib/tenses/guide')
  const { tablesForGoal } = await import('../src/lib/tenses/tables')
  let tableCount = 0
  for (const goal of TENSE_GOALS) {
    for (const group of tablesForGoal(goal)) {
      for (const table of group.tables) {
        tableCount += 1
        const expected = table.tense === 'Impératif' ? 3 : table.tense === 'Gérondif' ? 1 : 6
        assert.equal(table.rows.length, expected, `${goal.slug}/${table.verb}/${table.tense}: wrong row count`)
        for (const row of table.rows) {
          assert.ok(!/^je j'/.test(row.phrase), `double pronoun: ${row.phrase}`)
          assert.ok(!/^je [aeiouyàâéèêîôûh]/i.test(row.phrase), `missing elision: ${row.phrase}`)
        }
      }
    }
  }
  assert.ok(tableCount > 40, `expected many tables, got ${tableCount}`)
})

test('tenses guide: extra forms (subjonctif passé, gérondif, passé simple) are right', async () => {
  const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
  const { conjugateVerb } = await import('../src/lib/french-conjugations')
  const { extraForms } = await import('../src/lib/tenses/extra-forms')
  const { conjugationPhrase } = await import('../src/lib/tenses/format')
  const phrases = (verb: string, tense: string) => {
    const word = BUNDLED_VOCABULARY.find((w) => w.word === verb && w.part_of_speech === 'verb')!
    const base = conjugateVerb(word)
    return [...base, ...extraForms(verb, base)].filter((r) => r.tense === tense).map((r) => conjugationPhrase(r))
  }
  assert.deepEqual(phrases('parler', 'Subjonctif passé').slice(0, 2), ["j'aie parlé", 'tu aies parlé'])
  assert.equal(phrases('venir', 'Subjonctif passé')[3], 'nous soyons venu(e)s')
  assert.deepEqual(phrases('parler', 'Gérondif'), ['en parlant'])
  assert.deepEqual(phrases('être', 'Gérondif'), ['en étant'])
  assert.deepEqual(phrases('finir', 'Gérondif'), ['en finissant'])
  assert.deepEqual(phrases('faire', 'Gérondif'), ['en faisant'])
  assert.equal(phrases('parler', 'Passé simple')[2], 'il / elle / on parla')
  assert.equal(phrases('être', 'Passé simple')[5], 'ils / elles furent')
  assert.equal(phrases('venir', 'Passé simple')[2], 'il / elle / on vint')
  assert.equal(phrases('manger', 'Passé simple')[2], 'il / elle / on mangea')
  assert.equal(phrases('avoir', 'Passé simple')[0], "j'eus")
})

test('conjugation engine: common irregular and spelling-change verbs', async () => {
  const { conjugateVerb } = await import('../src/lib/french-conjugations')
  const form = (verb: string, tense: string, i: number) =>
    conjugateVerb({ id: verb, word: verb, base_translation: '', part_of_speech: 'verb', register: 'Courant' } as never).filter((r) => r.tense === tense)[i]?.form
  assert.equal(form('appeler', 'Présent', 0), 'appelle')
  assert.equal(form('appeler', 'Futur simple', 0), 'appellerai')
  assert.equal(form('acheter', 'Futur simple', 0), 'achèterai')
  assert.equal(form('envoyer', 'Futur simple', 0), 'enverrai')
  assert.equal(form('employer', 'Futur simple', 0), 'emploierai')
  assert.equal(form('conduire', 'Présent', 3), 'conduisons')
  assert.equal(form('devenir', 'Présent', 0), 'deviens')
  assert.equal(form('recevoir', 'Présent', 5), 'reçoivent')
  assert.equal(form('offrir', 'Passé composé', 1), 'as offert')
  assert.equal(form('joindre', 'Présent', 3), 'joignons')
  assert.equal(form('mourir', 'Présent', 0), 'meurs')
})

test('tenses guide: every French word on the Grammar pages is tappable', async () => {
  const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
  const { tokenizeFrench } = await import('../src/lib/clickable-text')
  const { TENSE_GOALS } = await import('../src/lib/tenses/guide')
  const { tablesForGoal } = await import('../src/lib/tenses/tables')
  const missing = new Set<string>()
  const check = (text: string) => {
    for (const token of tokenizeFrench(text, 't', BUNDLED_VOCABULARY)) {
      if (/[A-Za-zÀ-ÿœ]/.test(token.text) && !token.lemmaId) missing.add(token.text)
    }
  }
  for (const goal of TENSE_GOALS) {
    for (const example of [...goal.life, ...goal.work]) check(example.fr)
    for (const step of goal.steps) if (step.example) check(step.example.fr)
    for (const [, phrase] of goal.structure?.rows ?? []) check(phrase)
    for (const group of tablesForGoal(goal)) for (const table of group.tables) for (const row of table.rows) check(row.phrase)
    for (const line of goal.whenToUse) { const cut = line.indexOf(': '); if (cut >= 0) check(line.slice(cut + 2)) }
  }
  assert.deepEqual([...missing], [], `words with no dictionary entry: ${[...missing].join(', ')}`)
})

test('tenses hub: every goal appears in exactly one group', async () => {
  const fs = await import('node:fs')
  const { TENSE_GOALS } = await import('../src/lib/tenses/guide')
  const src = fs.readFileSync('src/app/(main)/tenses/page.tsx', 'utf8')
  for (const goal of TENSE_GOALS) {
    const count = (src.match(new RegExp(`slugs: \\[[^\\]]*'${goal.slug}'`, 'g')) ?? []).length
    assert.equal(count, 1, `${goal.slug} must be in exactly one group (found ${count})`)
  }
})

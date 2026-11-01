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
        const expected = table.tense === 'Impératif' ? 3 : 6
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

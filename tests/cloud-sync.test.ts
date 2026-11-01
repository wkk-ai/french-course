import assert from 'node:assert/strict'
import test from 'node:test'

const card = (id: string, reviewed: string | null, reps: number, extra: Partial<Record<string, number>> = {}) => ({
  vocab_id: id,
  repetition_count: reps,
  ease_factor: 2.5,
  interval_days: reps,
  total_encounters: extra.total_encounters ?? 1,
  mistake_count: extra.mistake_count ?? 0,
  next_review_at: '2026-11-10T00:00:00.000Z',
  last_reviewed_at: reviewed,
})

test('sync merge never loses progress from either phone', async () => {
  const { mergeSnapshots } = await import('../src/lib/cloud/merge')
  const phone = {
    completed: ['a', 'b'],
    in_progress: { c: 40, b: 90 },
    streak: { current: 3, lastDate: '2026-11-01' },
    daily_words: { '2026-11-01': 120 },
    vault: { w1: card('w1', '2026-11-01T10:00:00Z', 2, { mistake_count: 1 }), w2: card('w2', null, 0) },
  }
  const cloud = {
    completed: ['b', 'd'],
    in_progress: { c: 60, e: 10 },
    streak: { current: 9, lastDate: '2026-10-30' },
    daily_words: { '2026-11-01': 80, '2026-10-30': 300 },
    vault: { w1: card('w1', '2026-10-30T10:00:00Z', 1, { mistake_count: 4, total_encounters: 7 }), w3: card('w3', null, 0) },
  }
  const merged = mergeSnapshots(phone, cloud)
  assert.deepEqual(merged.completed, ['a', 'b', 'd'])
  assert.deepEqual(merged.in_progress, { c: 60, e: 10 }, 'completed lesson b drops from in-progress; highest % wins')
  assert.deepEqual(merged.streak, { current: 3, lastDate: '2026-11-01' }, 'latest day wins')
  assert.deepEqual(merged.daily_words, { '2026-11-01': 120, '2026-10-30': 300 })
  assert.equal(merged.vault.w1.repetition_count, 2, 'later review wins')
  assert.equal(merged.vault.w1.mistake_count, 4, 'counters keep the maximum')
  assert.equal(merged.vault.w1.total_encounters, 7)
  assert.ok(merged.vault.w2 && merged.vault.w3, 'cards from both phones kept')
})

test('sync merge is stable: merging twice changes nothing', async () => {
  const { mergeSnapshots, snapshotsEqual } = await import('../src/lib/cloud/merge')
  const a = { completed: ['x'], in_progress: { y: 20 }, streak: null, daily_words: {}, vault: { w: card('w', null, 0) } }
  const b = { completed: ['z'], in_progress: {}, streak: { current: 1, lastDate: '2026-11-01' }, daily_words: { d: 5 }, vault: {} }
  const once = mergeSnapshots(a, b)
  assert.ok(snapshotsEqual(mergeSnapshots(once, b), once))
  assert.ok(snapshotsEqual(mergeSnapshots(once, once), once))
})

test('sync normalize drops broken data instead of crashing', async () => {
  const { normalizeSnapshot } = await import('../src/lib/cloud/merge')
  const out = normalizeSnapshot({ completed: ['a', 3, null], in_progress: { a: 'x', b: 5 }, streak: { current: 'no' }, daily_words: [], vault: { bad: 1, ok: card('ok', null, 0) } } as never)
  assert.deepEqual(out.completed, ['a'])
  assert.deepEqual(out.in_progress, { b: 5 })
  assert.equal(out.streak, null)
  assert.deepEqual(out.daily_words, {})
  assert.deepEqual(Object.keys(out.vault), ['ok'])
})

test('login errors are plain language', async () => {
  const { friendlyAuthError } = await import('../src/lib/cloud/auth')
  assert.match(friendlyAuthError(null, undefined), /No connection/)
  assert.equal(friendlyAuthError(401, 'Invalid email or password'), 'Wrong email or password.')
  assert.match(friendlyAuthError(422, 'User already exists'), /already has an account/)
  assert.match(friendlyAuthError(503, ''), /login server/)
})

test('no database password or connection string ships in the app', async () => {
  const fs = await import('node:fs')
  const path = await import('node:path')
  const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
  for (const file of walk(path.join(process.cwd(), 'src'))) {
    const text = fs.readFileSync(file, 'utf8')
    assert.ok(!/postgres(ql)?:\/\//i.test(text), `connection string in ${file}`)
    assert.ok(!/npg_[A-Za-z0-9]{8,}/.test(text), `Neon password in ${file}`)
  }
})

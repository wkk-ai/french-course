import assert from 'node:assert/strict'
import test from 'node:test'

test('tracks: every module is in exactly one track', async () => {
  const { TRACKS } = await import('../src/lib/pathway/tracks')
  const { PATHWAY_MODULES } = await import('../src/lib/pathway/catalog')
  const seen = new Map<number, string>()
  for (const track of TRACKS) {
    for (const order of track.moduleOrders) {
      assert.ok(!seen.has(order), `module ${order} is in ${seen.get(order)} and ${track.id}`)
      seen.set(order, track.id)
    }
  }
  for (const module of PATHWAY_MODULES) assert.ok(seen.has(module.orderIndex), `module ${module.orderIndex} (${module.title}) has no track`)
  assert.equal(seen.size, PATHWAY_MODULES.length)
})

test('tracks: conversation starts at the basics and literature stays optional', async () => {
  const { TRACK_BY_ID, trackForModuleOrder, modulesForTrack } = await import('../src/lib/pathway/tracks')
  assert.equal(TRACK_BY_ID.get('conversation')?.moduleOrders[0], 1)
  assert.equal(TRACK_BY_ID.get('conversation')?.optional, false)
  assert.equal(TRACK_BY_ID.get('advanced')?.optional, true)
  const advancedTitles = modulesForTrack('advanced').map((module) => module.title).join(' | ')
  assert.match(advancedTitles, /Littérature/)
  assert.match(advancedTitles, /Philosophie/)
  assert.match(advancedTitles, /Droit/)
  // Core tenses for conversation live in the main path.
  for (const order of [7, 8, 9, 10]) assert.equal(trackForModuleOrder(order), 'conversation')
  assert.equal(trackForModuleOrder(29), 'business')
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const ROOT = join(import.meta.dirname, '..')

test('CRAFT_MATRIX.md exists and lists hand + Prove + later sample', () => {
  const body = readFileSync(join(ROOT, 'docs/CRAFT_MATRIX.md'), 'utf8')
  assert.match(body, /Hand Module 1/)
  assert.match(body, /M01 Prove/)
  assert.match(body, /Later modules sample/)
  assert.match(body, /failing:\s*0\s*\/\s*720/)
  assert.match(body, /\|\s*pass\s*\|/i)
})

test('factory themes pass craft schema; random ~5% sample validates', async () => {
  const { FACTORY_THEMES } = await import('../src/lib/phase1/content')
  const { assertThemesCraftReady } = await import('../src/lib/pathway/theme-craft-schema')
  const { BUNDLED_LESSONS, BUNDLED_CHAPTER_IDS } = await import('../src/lib/bundled-lessons')
  const { validateChapterContent } = await import('../src/lib/pathway/validate-chapter')
  const { PATHWAY_BY_CHAPTER_ID } = await import('../src/lib/pathway/catalog')

  assertThemesCraftReady(FACTORY_THEMES)

  // Built lessons must not keep theme grammar meta in learner surfaces.
  const sampleTheme = FACTORY_THEMES.find((theme) => /Prove gate/i.test(theme.grammar))
  if (sampleTheme) {
    const { buildCraftLesson } = await import('../src/lib/pathway/craft-from-theme')
    const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
    const lesson = buildCraftLesson(sampleTheme, BUNDLED_VOCABULARY)
    const blob = `${lesson.brief?.body ?? ''}\n${lesson.conversation?.setting ?? ''}`
    assert.equal(/Prove gate|Fail\s*→\s*remediate/i.test(blob), false, 'craft must strip Prove-gate meta')
  }

  const sampleSize = Math.max(36, Math.ceil(BUNDLED_CHAPTER_IDS.length * 0.05))
  const ranked = [...BUNDLED_CHAPTER_IDS].sort((a, b) => {
    const ha = createHash('sha256').update(`craft-sample:${a}`).digest('hex')
    const hb = createHash('sha256').update(`craft-sample:${b}`).digest('hex')
    return ha.localeCompare(hb)
  })
  const sample = ranked.slice(0, sampleSize)
  for (const id of sample) {
    const role = PATHWAY_BY_CHAPTER_ID.get(id)?.sub.role ?? 'A'
    const result = validateChapterContent(BUNDLED_LESSONS[id], { role })
    assert.equal(result.ok, true, `${id} sample fail: ${!result.ok ? result.reason : ''}`)
  }
})

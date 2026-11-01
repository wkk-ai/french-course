import assert from 'node:assert/strict'
import test from 'node:test'

function frenchLines(value: unknown, out: string[] = []): string[] {
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (typeof record.fr === 'string' && typeof record.en === 'string') {
      assert.notEqual(record.en.trim(), record.fr.trim(), `English equals French: ${record.fr}`)
      assert.ok(record.en.trim().length > 0, `missing English for ${record.fr}`)
      out.push(record.fr)
    }
    Object.values(record).forEach((child) => frenchLines(child, out))
  }
  return out
}

test('life documents: every French word is tappable (has a dictionary lemma)', async () => {
  const { LESSON_DOCUMENTS } = await import('../src/lib/visual/module1-documents')
  const { BUNDLED_VOCABULARY } = await import('../src/lib/bundled-vocabulary')
  const { tokenizeFrench } = await import('../src/lib/clickable-text')
  const missing: string[] = []
  let lines = 0
  for (const [chapterId, docs] of Object.entries(LESSON_DOCUMENTS)) {
    assert.ok(docs.length > 0, `${chapterId}: empty document list`)
    for (const text of frenchLines(docs)) {
      lines += 1
      for (const token of tokenizeFrench(text, 'doc', BUNDLED_VOCABULARY)) {
        if (/[A-Za-zÀ-ÿŒœ]/.test(token.text) && !token.lemmaId) missing.push(`${token.text} in "${text}"`)
      }
    }
  }
  assert.ok(lines > 20, `expected many lines, got ${lines}`)
  assert.deepEqual(missing, [], `words with no lemma: ${missing.join(' | ')}`)
})

test('life documents: only real playable chapters get documents', async () => {
  const { LESSON_DOCUMENTS } = await import('../src/lib/visual/module1-documents')
  const { PATHWAY_BY_CHAPTER_ID } = await import('../src/lib/pathway/catalog')
  for (const chapterId of Object.keys(LESSON_DOCUMENTS)) {
    assert.ok(PATHWAY_BY_CHAPTER_ID.has(chapterId), `${chapterId} is not in the pathway catalog`)
  }
})

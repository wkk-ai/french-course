import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

const BANNED_SYMBOLS = [
  'learnerBriefPad',
  'topicFillerFrench',
  'defaultReadingFr',
  'topicReadingParagraphs',
]

const BANNED_LITERALS = [
  'Practice order',
  'read-only if early',
  'useful phrase — say it whole',
  'revient dans la leçon',
  'Nous parlons encore de',
  'Extra practice with meanings',
]

test('pathway sources do not resurrect pad emitters', () => {
  const files = [
    'src/lib/pathway/lesson-factory.ts',
    'src/lib/pathway/deepen-lesson.ts',
    'src/lib/pathway/sanitize-lesson.ts',
    'src/lib/pathway/craft-from-theme.ts',
  ]
  for (const rel of files) {
    const src = readFileSync(join(ROOT, rel), 'utf8')
    for (const symbol of BANNED_SYMBOLS) {
      assert.equal(src.includes(`function ${symbol}`), false, `${rel} defines ${symbol}`)
    }
    for (const lit of BANNED_LITERALS) {
      // Allowed in META_READING_MARKERS / denylist consumers — not as generators.
      if (rel.includes('sanitize-lesson') || rel.includes('content-quality')) continue
      assert.equal(
        src.includes(`\`${lit}`) || src.includes(`'${lit}'`) || src.includes(`"${lit}"`),
        false,
        `${rel} embeds pad literal ${lit}`,
      )
    }
  }
})

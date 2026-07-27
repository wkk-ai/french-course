import { writeFileSync } from 'fs'
import { BUNDLED_LESSONS, BUNDLED_CHAPTER_IDS } from '../src/lib/bundled-lessons'
import { BUNDLED_VOCABULARY } from '../src/lib/bundled-vocabulary'
import { enrichTokens, isPunctuationToken } from '../src/lib/clickable-text'

const counts = new Map<string, number>()
const examples = new Map<string, string>()

for (const id of BUNDLED_CHAPTER_IDS) {
  const lesson = BUNDLED_LESSONS[id]
  if (!lesson) continue
  const scan = (tokens: { text: string; lemmaId?: string }[], where: string) => {
    for (const t of enrichTokens(tokens as never, BUNDLED_VOCABULARY)) {
      if (t.lemmaId || isPunctuationToken(t.text) || !/[A-Za-zÀ-ÿ]/.test(t.text)) continue
      counts.set(t.text, (counts.get(t.text) ?? 0) + 1)
      if (!examples.has(t.text)) {
        examples.set(t.text, `${where}: ${tokens.map((x) => x.text).join('').slice(0, 140)}`)
      }
    }
  }
  for (const [i, p] of (lesson.reading ?? []).entries()) scan(p.tokens, `${id.slice(-4)}/r${i}`)
  for (const [i, line] of (lesson.conversation?.lines ?? []).entries()) {
    scan(line.tokens ?? [], `${id.slice(-4)}/c${i}`)
  }
}

const all = [...counts.entries()].sort((a, b) => b[1] - a[1])
const isAsciiEn = (w: string) =>
  /^[A-Za-z]+$/.test(w) && !/[àâäéèêëîïôöùûüçœæ]/i.test(w) && w.length > 1

console.log('unique', all.length, 'tokens', [...counts.values()].reduce((a, b) => a + b, 0))
console.log('\nTOP 80 misses:')
for (const [w, c] of all.slice(0, 80)) {
  console.log(`${c}\t${w}\t${(examples.get(w) ?? '').replace(/\n/g, ' ').slice(0, 100)}`)
}

writeFileSync(
  '/tmp/tap-misses.json',
  JSON.stringify(
    {
      totalTokens: [...counts.values()].reduce((a, b) => a + b, 0),
      unique: all.length,
      misses: all.map(([word, count]) => ({
        word,
        count,
        ascii: isAsciiEn(word),
        example: examples.get(word) ?? '',
      })),
    },
    null,
    2,
  ),
)
console.log('\nwrote /tmp/tap-misses.json')

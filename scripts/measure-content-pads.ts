/**
 * Measure live pad / clone metrics across BUNDLED_LESSONS.
 * Exit 1 unless every lesson is clean.
 */
import { BUNDLED_CHAPTER_IDS, BUNDLED_LESSONS } from '../src/lib/bundled-lessons'
import { AUTHOR_PAD_DENYLIST, hasAuthorPad } from '../src/lib/pathway/content-quality'
import {
  dialogueFingerprint,
  readingFingerprint,
  validateChapterContent,
} from '../src/lib/pathway/validate-chapter'
import { PATHWAY_BY_CHAPTER_ID } from '../src/lib/pathway/catalog'

const needleCounts = new Map<string, number>()
for (const phrase of AUTHOR_PAD_DENYLIST) needleCounts.set(phrase, 0)

let validateFails = 0
const dialogueMap = new Map<string, string[]>()
const readingMap = new Map<string, string[]>()

for (const id of BUNDLED_CHAPTER_IDS) {
  const lesson = BUNDLED_LESSONS[id]
  const role = PATHWAY_BY_CHAPTER_ID.get(id)?.sub.role ?? 'A'
  const result = validateChapterContent(lesson, { role })
  if (!result.ok) validateFails += 1

  const brief = lesson.brief?.body ?? ''
  const reading = (lesson.reading ?? []).map((p) => p.tokens.map((t) => t.text).join(' ')).join('\n')
  const dialogue = (lesson.conversation?.lines ?? []).map((l) => l.text).join('\n')
  const haystack = `${brief}\n${reading}\n${dialogue}\n${lesson.conversation?.setting ?? ''}`
  if (hasAuthorPad(haystack)) {
    for (const phrase of AUTHOR_PAD_DENYLIST) {
      if (haystack.toLowerCase().includes(phrase.toLowerCase())) {
        needleCounts.set(phrase, (needleCounts.get(phrase) ?? 0) + 1)
      }
    }
  }

  const df = dialogueFingerprint(lesson)
  const rf = readingFingerprint(lesson)
  dialogueMap.set(df, [...(dialogueMap.get(df) ?? []), id])
  readingMap.set(rf, [...(readingMap.get(rf) ?? []), id])
}

const padLessons = [...needleCounts.values()].reduce((a, b) => a + (b > 0 ? 1 : 0), 0)
const dialogueClones = [...dialogueMap.values()].filter((ids) => ids.length > 1)
const readingClones = [...readingMap.values()].filter((ids) => ids.length > 1)

const report = {
  total: BUNDLED_CHAPTER_IDS.length,
  validateFails,
  padNeedleHits: Object.fromEntries([...needleCounts.entries()].filter(([, n]) => n > 0)),
  dialogueCloneGroups: dialogueClones.length,
  readingCloneGroups: readingClones.length,
  failing: validateFails + (padLessons > 0 ? 1 : 0) + dialogueClones.length,
}

console.log(JSON.stringify(report, null, 2))
console.log(`failing: ${report.failing} / ${report.total}`)

if (validateFails > 0 || dialogueClones.length > 0 || Object.keys(report.padNeedleHits).length > 0) {
  process.exit(1)
}

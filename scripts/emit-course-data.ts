/**
 * Write compact per-lesson JSON for offline study.
 * Do not inline BUNDLED_LESSONS into client bundles — pages fetch these files.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { UNIT_LESSON_IDS } from '../src/lib/pathway/units'
import { resolveUnitLesson } from '../src/lib/units/lessons'

const root = join(process.cwd(), 'public/course-data')
const lessonsDir = join(root, 'lessons')

rmSync(root, { recursive: true, force: true })
mkdirSync(lessonsDir, { recursive: true })

const urls: string[] = ['/course-data/manifest.json']
let bytes = 0
let missing = 0

for (const id of UNIT_LESSON_IDS) {
  const content = resolveUnitLesson(id)
  if (!content) {
    missing += 1
    console.error(`missing lesson ${id}`)
    continue
  }
  const json = JSON.stringify(content)
  bytes += Buffer.byteLength(json)
  writeFileSync(join(lessonsDir, `${id}.json`), json)
  urls.push(`/course-data/lessons/${id}.json`)
}

const rulesDir = join(process.cwd(), 'public/rules-data')
for (const file of readdirSync(rulesDir)) {
  if (file.endsWith('.json')) urls.push(`/rules-data/${file}`)
}

if (missing) {
  console.error(`emit-course-data: ${missing} lessons missing`)
  process.exit(1)
}

const manifest = {
  version: new Date().toISOString().slice(0, 10),
  lessonCount: UNIT_LESSON_IDS.length,
  bytes,
  urls,
}
writeFileSync(join(root, 'manifest.json'), JSON.stringify(manifest))
console.log(
  `emit-course-data: ${manifest.lessonCount} lessons, ${(bytes / 1e6).toFixed(1)} MB JSON, ${urls.length} cache URLs`,
)

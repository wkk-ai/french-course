import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

if (!existsSync('public/course-data/manifest.json')) {
  const result = spawnSync('npx', ['tsx', 'scripts/emit-course-data.ts'], { stdio: 'inherit' })
  if (result.status) process.exit(result.status ?? 1)
}

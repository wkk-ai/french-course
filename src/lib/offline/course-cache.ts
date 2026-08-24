const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export type CourseManifest = {
  version: string
  lessonCount: number
  bytes: number
  urls: string[]
}

const VERSION_KEY = 'french-course:offline-version'

function withBase(path: string) {
  if (!path.startsWith('/')) return `${basePath}/${path}`
  return `${basePath}${path}`
}

export async function readCourseManifest(): Promise<CourseManifest> {
  const response = await fetch(withBase('/course-data/manifest.json'))
  if (!response.ok) throw new Error('Could not read the course list.')
  return (await response.json()) as CourseManifest
}

export function readSavedCourseVersion(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(VERSION_KEY)
  } catch {
    return null
  }
}

function assetUrlsFromHtml(html: string): string[] {
  const found = new Set<string>()
  const pattern = /(?:src|href)="([^"]*\/_next\/static\/[^"]+)"/g
  let match: RegExpExecArray | null = pattern.exec(html)
  while (match) {
    found.add(match[1])
    match = pattern.exec(html)
  }
  return [...found]
}

export async function downloadCourseToPhone(onProgress: (done: number, total: number) => void): Promise<string> {
  if (!('caches' in window)) throw new Error('This browser cannot save the course offline.')
  const manifest = await readCourseManifest()
  const cache = await caches.open(`ladf-${manifest.version}`)
  const shells = ['/', '/review/', '/rules/', '/center/']
  const lessonPages = manifest.urls
    .filter((url) => url.includes('/course-data/lessons/'))
    .map((url) => url.replace('/course-data/lessons/', '/lesson/').replace(/\.json$/, '/'))
  const rulePages = manifest.urls
    .filter((url) => url.includes('/rules-data/'))
    .map((url) => url.replace('/rules-data/', '/rules/').replace(/\.json$/, '/'))
  const pending = [...new Set([...manifest.urls, ...shells, ...lessonPages, ...rulePages].map(withBase))]
  const parseHtml = new Set([...shells.map(withBase), withBase(lessonPages[0] ?? '/'), withBase(rulePages[0] ?? '/')])
  const extra = new Set<string>()
  let done = 0
  const chunkSize = 8

  for (let index = 0; index < pending.length; index += chunkSize) {
    const chunk = pending.slice(index, index + chunkSize)
    await Promise.all(
      chunk.map(async (url) => {
        const response = await fetch(url, { credentials: 'same-origin' })
        if (!response.ok) throw new Error(`Could not save ${url}`)
        await cache.put(url, response.clone())
        if (parseHtml.has(url)) {
          for (const asset of assetUrlsFromHtml(await response.text())) extra.add(asset)
        }
      }),
    )
    done += chunk.length
    onProgress(done, pending.length + extra.size)
  }

  for (const url of extra) {
    const response = await fetch(url, { credentials: 'same-origin' })
    if (response.ok) await cache.put(url, response.clone())
    done += 1
    onProgress(done, pending.length + extra.size)
  }

  try {
    await navigator.storage?.persist?.()
  } catch {
    // persist is best-effort on iPhone
  }
  localStorage.setItem(VERSION_KEY, manifest.version)
  return manifest.version
}

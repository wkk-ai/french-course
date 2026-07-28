/** Local completed-chapter IDs — backup when remote complete_chapter / FK fails. */

const KEY = 'french-course:completed-chapters'
const STREAK_KEY = 'french-course:local-streak'
const DAILY_ARTICLES_KEY = (date: string) => `french-course:daily-articles:${date}`

export function readLocalCompletedChapters(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function markLocalChapterCompleted(chapterId: string) {
  if (typeof window === 'undefined') return
  const next = new Set(readLocalCompletedChapters())
  next.add(chapterId)
  localStorage.setItem(KEY, JSON.stringify([...next]))
  bumpLocalStreak()
}

export function mergeCompletedChapterIds(remote: Iterable<string>): Set<string> {
  return new Set([...remote, ...readLocalCompletedChapters()])
}

type LocalStreak = { current: number; lastDate: string }

function localDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function yesterdayString() {
  const now = new Date()
  now.setDate(now.getDate() - 1)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function readLocalStreak(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw) as LocalStreak
    const today = localDateString()
    if (parsed.lastDate === today || parsed.lastDate === yesterdayString()) {
      return Math.max(0, Number(parsed.current) || 0)
    }
    return 0
  } catch {
    return 0
  }
}

export function bumpLocalStreak() {
  if (typeof window === 'undefined') return
  const today = localDateString()
  let current = 1
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as LocalStreak
      if (parsed.lastDate === today) {
        current = Math.max(1, Number(parsed.current) || 1)
      } else if (parsed.lastDate === yesterdayString()) {
        current = Math.max(1, (Number(parsed.current) || 0) + 1)
      }
    }
  } catch {
    current = 1
  }
  localStorage.setItem(STREAK_KEY, JSON.stringify({ current, lastDate: today }))
}

/** True the first time this chapter counts toward today's articles_completed. */
export function shouldCountDailyArticle(chapterId: string): boolean {
  if (typeof window === 'undefined') return true
  const today = localDateString()
  try {
    const raw = localStorage.getItem(DAILY_ARTICLES_KEY(today))
    const ids = raw ? (JSON.parse(raw) as unknown) : []
    const set = new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [])
    if (set.has(chapterId)) return false
    set.add(chapterId)
    localStorage.setItem(DAILY_ARTICLES_KEY(today), JSON.stringify([...set]))
    return true
  } catch {
    return true
  }
}

export function clearLocalLearnerData() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
  localStorage.removeItem(STREAK_KEY)
  localStorage.removeItem('ladf-vocab-vault-v1')
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('french-course:lesson-draft:')) localStorage.removeItem(key)
    if (key.startsWith('french-course:daily-articles:')) localStorage.removeItem(key)
  }
}

/** Cross-tab sync when another tab marks a chapter complete locally. */
export function subscribeCompletedChapters(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === STREAK_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

/** Local completed-chapter IDs — backup when remote complete_chapter / FK fails. */

const KEY = 'french-course:completed-chapters'
const IN_PROGRESS_KEY = 'french-course:in-progress'
const STREAK_KEY = 'french-course:local-streak'
const DAILY_WORDS_KEY = 'french-course:daily-words'
const DAILY_ARTICLES_KEY = (date: string) => `french-course:daily-articles:${date}`
const PROGRESS_EVENT = 'french-course-progress'

function notifyProgress() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

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
  clearLessonInProgress(chapterId)
  bumpLocalStreak()
  notifyProgress()
}

export function readInProgressPercents(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const parsed = JSON.parse(localStorage.getItem(IN_PROGRESS_KEY) ?? '{}') as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const out: Record<string, number> = {}
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      const percent = typeof value === 'number' ? value : Number(value)
      if (Number.isFinite(percent) && percent > 0) out[id] = Math.min(99, Math.round(percent))
    }
    return out
  } catch {
    return {}
  }
}

export function setLessonInProgress(chapterId: string, percent: number) {
  if (typeof window === 'undefined' || percent <= 0) return
  if (readLocalCompletedChapters().includes(chapterId)) return
  const map = readInProgressPercents()
  map[chapterId] = Math.min(99, Math.max(1, Math.round(percent)))
  localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(map))
  notifyProgress()
}

export function clearLessonInProgress(chapterId: string) {
  if (typeof window === 'undefined') return
  const map = readInProgressPercents()
  if (!(chapterId in map)) return
  delete map[chapterId]
  localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(map))
  notifyProgress()
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
  notifyProgress()
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

type DailyWords = Record<string, number>

function readDailyWordsMap(): DailyWords {
  if (typeof window === 'undefined') return {}
  try {
    const parsed = JSON.parse(localStorage.getItem(DAILY_WORDS_KEY) ?? '{}') as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const out: DailyWords = {}
    for (const [date, value] of Object.entries(parsed as DailyWords)) {
      if (typeof value === 'number' && Number.isFinite(value)) out[date] = value
    }
    return out
  } catch {
    return {}
  }
}

export function addLocalDailyWords(words: number, date = localDateString()) {
  if (typeof window === 'undefined' || words <= 0) return
  const map = readDailyWordsMap()
  map[date] = (map[date] ?? 0) + words
  localStorage.setItem(DAILY_WORDS_KEY, JSON.stringify(map))
  notifyProgress()
}

export function readLocalDailyWords(date = localDateString()): number {
  return readDailyWordsMap()[date] ?? 0
}

export function readLocalDailyReadingHistory(): Array<{ date: string; words_read: number }> {
  return Object.entries(readDailyWordsMap()).map(([date, words_read]) => ({ date, words_read }))
}

export function clearLocalLearnerData() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
  localStorage.removeItem(IN_PROGRESS_KEY)
  localStorage.removeItem(STREAK_KEY)
  localStorage.removeItem(DAILY_WORDS_KEY)
  localStorage.removeItem('ladf-vocab-vault-v1')
  localStorage.removeItem('french-course:offline-version')
  localStorage.removeItem('french-course:last-sync')
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('french-course:lesson-draft:')) localStorage.removeItem(key)
    if (key.startsWith('french-course:daily-articles:')) localStorage.removeItem(key)
  }
  try {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith('french-course:lesson-draft:')) sessionStorage.removeItem(key)
    }
  } catch {
    // sessionStorage may be blocked
  }
}

/** Cross-tab sync when another tab marks a chapter complete locally. */
export function subscribeCompletedChapters(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === STREAK_KEY || event.key === IN_PROGRESS_KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(PROGRESS_EVENT, listener)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(PROGRESS_EVENT, listener)
  }
}

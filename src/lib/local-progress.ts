/** Local completed-chapter IDs — backup when remote complete_chapter / FK fails. */

const KEY = 'french-course:completed-chapters'

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
}

export function mergeCompletedChapterIds(remote: Iterable<string>): Set<string> {
  return new Set([...remote, ...readLocalCompletedChapters()])
}

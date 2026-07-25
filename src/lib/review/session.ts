import { taskFromPoolItem } from '@/lib/review/tasks'
import type {
  ReviewPoolItem,
  ReviewSessionPlan,
  ReviewTask,
  SessionMode,
} from '@/lib/review/types'

const DAY_MS = 24 * 60 * 60 * 1000

function isDue(item: ReviewPoolItem, now: number) {
  return new Date(item.next_review_at).getTime() <= now
}

function isSoon(item: ReviewPoolItem, now: number) {
  const at = new Date(item.next_review_at).getTime()
  return at > now && at <= now + 2 * DAY_MS
}

function isOverdue(item: ReviewPoolItem, now: number) {
  return new Date(item.next_review_at).getTime() < now - DAY_MS
}

function interleaveTasks(tasks: ReviewTask[]): ReviewTask[] {
  const buckets = new Map<string, ReviewTask[]>()
  for (const task of tasks) {
    const key = task.kind
    const list = buckets.get(key) ?? []
    list.push(task)
    buckets.set(key, list)
  }
  const order: Array<ReviewTask['kind']> = ['overdue', 'due', 'weak', 'soon', 'spiral']
  const result: ReviewTask[] = []
  let added = true
  while (added) {
    added = false
    for (const kind of order) {
      const list = buckets.get(kind)
      if (list?.length) {
        result.push(list.shift()!)
        added = true
      }
    }
  }
  return result
}

/**
 * Build a review session from the master pool.
 * Never returns empty when the pool has items — fills with spiral/weak/soon.
 */
export function buildReviewSession(
  pool: ReviewPoolItem[],
  mode: SessionMode,
  options?: { size?: number; excludeTaskIds?: string[] },
): ReviewSessionPlan {
  const size = options?.size ?? (mode === 'daily' ? 15 : 12)
  const exclude = new Set(options?.excludeTaskIds ?? [])
  const now = Date.now()

  const overdue = pool.filter((item) => isOverdue(item, now)).sort((a, b) => a.next_review_at.localeCompare(b.next_review_at))
  const due = pool.filter((item) => isDue(item, now) && !isOverdue(item, now)).sort((a, b) => a.next_review_at.localeCompare(b.next_review_at))
  const soon = pool.filter((item) => isSoon(item, now)).sort((a, b) => a.next_review_at.localeCompare(b.next_review_at))
  const weak = [...pool].sort((a, b) => b.mistake_count - a.mistake_count || a.next_review_at.localeCompare(b.next_review_at))
  const spiral = [...pool].sort((a, b) => (a.last_reviewed_at ?? '').localeCompare(b.last_reviewed_at ?? '') || a.vocab_id.localeCompare(b.vocab_id))

  const tasks: ReviewTask[] = []
  const usedVocab = new Set<string>()

  const pushFrom = (items: ReviewPoolItem[], kind: ReviewTask['kind'], limit: number, modalityOffset = 0) => {
    let added = 0
    for (const item of items) {
      if (added >= limit) break
      if (usedVocab.has(item.vocab_id) && kind !== 'spiral') continue
      const task = taskFromPoolItem(item, kind, modalityOffset + added)
      if (!task || exclude.has(task.id)) continue
      tasks.push(task)
      usedVocab.add(item.vocab_id)
      added += 1
    }
  }

  if (mode === 'daily') {
    pushFrom(overdue, 'overdue', 4)
    pushFrom(due, 'due', 5)
    pushFrom(weak.filter((item) => item.mistake_count > 0), 'weak', 3, 1)
    pushFrom(soon, 'soon', 3, 1)
    pushFrom(spiral, 'spiral', size, 2)
  } else {
    pushFrom(weak.filter((item) => item.mistake_count > 0), 'weak', 4, 1)
    pushFrom(soon, 'soon', 3, 1)
    pushFrom(due, 'due', 3)
    pushFrom(spiral, 'spiral', size, Math.floor(Date.now() / DAY_MS) % 3)
  }

  let pass = 0
  while (tasks.length < size && pool.length > 0 && pass < 5) {
    pushFrom(spiral, 'spiral', size - tasks.length, pass + 3)
    pass += 1
  }

  while (tasks.length < size && pool.length > 0) {
    const item = pool[tasks.length % pool.length]
    const task = taskFromPoolItem(item, 'spiral', tasks.length)
    if (!task) break
    task.id = `${task.id}-extra-${tasks.length}`
    if (!exclude.has(task.id)) tasks.push(task)
    else break
  }

  const mixed = interleaveTasks(tasks).slice(0, size)
  const dueCount = overdue.length + due.length
  const weakCount = pool.filter((item) => item.mistake_count > 0).length
  return {
    mode,
    tasks: mixed,
    poolSize: pool.length,
    dueCount,
    weakCount,
    estimatedMinutes: Math.max(5, Math.round(mixed.length * 0.8)),
  }
}

export function emptySessionMessage(poolSize: number) {
  if (poolSize === 0) return 'Finish a lesson to start your infinite review loop.'
  return 'Your loop is ready — start a session anytime.'
}

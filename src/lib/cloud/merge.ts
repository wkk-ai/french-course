/**
 * Pure merge rules for progress synced between phones. No data is ever lost:
 * - completed lessons: union
 * - in-progress %: highest per lesson (dropped once the lesson is completed)
 * - daily words: highest per day
 * - streak: the one with the latest day; on the same day, the longer streak
 * - review cards: later review wins, counters take the maximum
 */

export type VaultItem = {
  vocab_id: string
  repetition_count: number
  ease_factor: number
  interval_days: number
  total_encounters: number
  mistake_count: number
  next_review_at: string
  last_reviewed_at: string | null
}

export type Streak = { current: number; lastDate: string }

export type LearnerSnapshot = {
  completed: string[]
  in_progress: Record<string, number>
  streak: Streak | null
  daily_words: Record<string, number>
  vault: Record<string, VaultItem>
}

export const SNAPSHOT_KEYS = ['completed', 'in_progress', 'streak', 'daily_words', 'vault'] as const
export type SnapshotKey = (typeof SNAPSHOT_KEYS)[number]

export const EMPTY_SNAPSHOT: LearnerSnapshot = { completed: [], in_progress: {}, streak: null, daily_words: {}, vault: {} }

function numberMapMax(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = { ...a }
  for (const [key, value] of Object.entries(b)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) continue
    out[key] = Math.max(out[key] ?? 0, value)
  }
  return out
}

function reviewedMs(item: VaultItem): number {
  return item.last_reviewed_at ? new Date(item.last_reviewed_at).getTime() || 0 : 0
}

export function mergeVaultItem(left: VaultItem, right: VaultItem): VaultItem {
  const l = reviewedMs(left)
  const r = reviewedMs(right)
  const base = r > l || (r === l && right.repetition_count > left.repetition_count) ? right : left
  return {
    ...base,
    total_encounters: Math.max(left.total_encounters ?? 0, right.total_encounters ?? 0),
    mistake_count: Math.max(left.mistake_count ?? 0, right.mistake_count ?? 0),
  }
}

export function mergeStreak(a: Streak | null, b: Streak | null): Streak | null {
  if (!a) return b
  if (!b) return a
  if (a.lastDate !== b.lastDate) return a.lastDate > b.lastDate ? a : b
  return a.current >= b.current ? a : b
}

export function mergeSnapshots(a: LearnerSnapshot, b: LearnerSnapshot): LearnerSnapshot {
  const completed = [...new Set([...a.completed, ...b.completed])].sort()
  const done = new Set(completed)
  const inProgress = numberMapMax(a.in_progress, b.in_progress)
  for (const id of Object.keys(inProgress)) if (done.has(id)) delete inProgress[id]
  const vault: Record<string, VaultItem> = { ...a.vault }
  for (const [id, item] of Object.entries(b.vault)) {
    if (!item || typeof item !== 'object') continue
    vault[id] = vault[id] ? mergeVaultItem(vault[id], item) : item
  }
  return {
    completed,
    in_progress: inProgress,
    streak: mergeStreak(a.streak, b.streak),
    daily_words: numberMapMax(a.daily_words, b.daily_words),
    vault,
  }
}

/** Accept anything from storage or the server; drop what is malformed. */
export function normalizeSnapshot(raw: Partial<Record<SnapshotKey, unknown>>): LearnerSnapshot {
  const completed = Array.isArray(raw.completed) ? raw.completed.filter((id): id is string => typeof id === 'string') : []
  const asNumberMap = (value: unknown) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])))
  }
  const streakRaw = raw.streak as Partial<Streak> | null | undefined
  const streak = streakRaw && typeof streakRaw.current === 'number' && typeof streakRaw.lastDate === 'string' ? { current: streakRaw.current, lastDate: streakRaw.lastDate } : null
  const vaultRaw = raw.vault && typeof raw.vault === 'object' && !Array.isArray(raw.vault) ? (raw.vault as Record<string, VaultItem>) : {}
  const vault = Object.fromEntries(Object.entries(vaultRaw).filter(([, item]) => item && typeof item === 'object' && typeof item.vocab_id === 'string'))
  return { completed, in_progress: asNumberMap(raw.in_progress), streak, daily_words: asNumberMap(raw.daily_words), vault }
}

export function snapshotsEqual(a: LearnerSnapshot, b: LearnerSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

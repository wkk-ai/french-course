import { getCachedUser, getDatabaseToken } from '@/lib/cloud/auth'
import { NEON_DATA_API_URL } from '@/lib/cloud/config'
import {
  EMPTY_SNAPSHOT,
  mergeSnapshots,
  normalizeSnapshot,
  SNAPSHOT_KEYS,
  snapshotsEqual,
  type LearnerSnapshot,
  type SnapshotKey,
} from '@/lib/cloud/merge'

/**
 * Phone-first sync. The phone is always the source you study from (works offline).
 * When online and signed in: download, merge (nothing is lost), save on the phone, upload.
 */

const LOCAL_KEYS: Record<SnapshotKey, string> = {
  completed: 'french-course:completed-chapters',
  in_progress: 'french-course:in-progress',
  streak: 'french-course:local-streak',
  daily_words: 'french-course:daily-words',
  vault: 'ladf-vocab-vault-v1',
}
const LAST_SYNC_KEY = 'french-course:last-sync'
const STATUS_EVENT = 'french-course-sync'

export type SyncStatus =
  | { state: 'idle' | 'syncing' }
  | { state: 'done'; at: string }
  | { state: 'offline' }
  | { state: 'needs-login'; detail?: string }
  | { state: 'error'; message: string }

let status: SyncStatus = { state: 'idle' }
let running: Promise<SyncStatus> | null = null

function setStatus(next: SyncStatus) {
  status = next
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(STATUS_EVENT))
}

export function getSyncStatus(): SyncStatus {
  return status
}

export function getLastSyncAt(): string | null {
  try {
    return localStorage.getItem(LAST_SYNC_KEY)
  } catch {
    return null
  }
}

export function subscribeSync(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(STATUS_EVENT, listener)
  return () => window.removeEventListener(STATUS_EVENT, listener)
}

export function readLocalSnapshot(): LearnerSnapshot {
  const raw: Partial<Record<SnapshotKey, unknown>> = {}
  for (const key of SNAPSHOT_KEYS) {
    try {
      const value = localStorage.getItem(LOCAL_KEYS[key])
      if (value) raw[key] = JSON.parse(value)
    } catch {
      // ignore broken entry
    }
  }
  return normalizeSnapshot(raw)
}

function writeLocalSnapshot(snapshot: LearnerSnapshot) {
  for (const key of SNAPSHOT_KEYS) {
    const value = snapshot[key]
    if (value === null) continue
    localStorage.setItem(LOCAL_KEYS[key], JSON.stringify(value))
  }
  // Same event the app already listens to for progress changes.
  window.dispatchEvent(new Event('french-course-progress'))
}

async function request(path: string, jwt: string, init?: RequestInit): Promise<Response> {
  return fetch(`${NEON_DATA_API_URL}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${jwt}`, 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
}

async function runSync(): Promise<SyncStatus> {
  const user = getCachedUser()
  if (!user) return { state: 'needs-login' }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { state: 'offline' }

  const token = await getDatabaseToken()
  if (!token.ok) {
    if (token.reason === 'offline') return { state: 'offline' }
    if (token.reason === 'signed-out') return { state: 'needs-login', detail: token.detail }
    return { state: 'error', message: `Could not reach the login server (${token.detail ?? 'unknown'}).` }
  }

  let remote: LearnerSnapshot = EMPTY_SNAPSHOT
  try {
    const response = await request('/learner_state?select=key,value', token.jwt)
    if (!response.ok) return { state: 'error', message: `Download failed (${response.status}).` }
    const rows = (await response.json()) as Array<{ key: SnapshotKey; value: unknown }>
    remote = normalizeSnapshot(Object.fromEntries(rows.map((row) => [row.key, row.value])))
  } catch {
    return { state: 'offline' }
  }

  const local = readLocalSnapshot()
  const merged = mergeSnapshots(local, remote)
  if (!snapshotsEqual(merged, local)) writeLocalSnapshot(merged)

  if (!snapshotsEqual(merged, remote)) {
    const now = new Date().toISOString()
    const rows = SNAPSHOT_KEYS.filter((key) => merged[key] !== null).map((key) => ({ user_id: user.id, key, value: merged[key], updated_at: now }))
    try {
      const response = await request('/learner_state?on_conflict=user_id,key', token.jwt, {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(rows),
      })
      if (!response.ok) return { state: 'error', message: `Upload failed (${response.status}).` }
    } catch {
      return { state: 'offline' }
    }
  }

  const at = new Date().toISOString()
  try {
    localStorage.setItem(LAST_SYNC_KEY, at)
  } catch {
    // ignore
  }
  return { state: 'done', at }
}

/** Run one sync. Calls made while a sync is running share it. */
export function syncNow(): Promise<SyncStatus> {
  if (running) return running
  setStatus({ state: 'syncing' })
  running = runSync()
    .catch((error: unknown) => ({ state: 'error', message: error instanceof Error ? error.message : 'Sync failed.' }) as SyncStatus)
    .then((result) => {
      setStatus(result)
      running = null
      return result
    })
  return running
}

let debounce: ReturnType<typeof setTimeout> | null = null

/** Start background sync: on open, when back online, after progress changes, when the app is hidden. */
export function startAutoSync(): () => void {
  if (typeof window === 'undefined') return () => {}
  const soon = () => {
    if (debounce) clearTimeout(debounce)
    debounce = setTimeout(() => void syncNow(), 4000)
  }
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') void syncNow()
  }
  const onOnline = () => void syncNow()
  void syncNow()
  window.addEventListener('online', onOnline)
  window.addEventListener('french-course-progress', soon)
  window.addEventListener('french-course-vault', soon)
  document.addEventListener('visibilitychange', onVisibility)
  return () => {
    if (debounce) clearTimeout(debounce)
    window.removeEventListener('online', onOnline)
    window.removeEventListener('french-course-progress', soon)
    window.removeEventListener('french-course-vault', soon)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}

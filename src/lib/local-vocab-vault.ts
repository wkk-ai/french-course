import type { VocabularyWord } from '@/lib/course'
import { calculateSrsSchedule } from '@/lib/srs'

const STORAGE_KEY = 'ladf-vocab-vault-v1'

export type LocalVaultItem = {
  vocab_id: string
  repetition_count: number
  ease_factor: number
  interval_days: number
  total_encounters: number
  mistake_count: number
  next_review_at: string
  last_reviewed_at: string | null
}

type VaultStore = Record<string, LocalVaultItem>

function readStore(): VaultStore {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as VaultStore
  } catch {
    return {}
  }
}

function writeStore(store: VaultStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

/** Spread new lemmas across days so Review stays infinite without dumping everything due today. */
export function staggerReviewDates(lemmaIds: string[], from = new Date()): Map<string, string> {
  const map = new Map<string, string>()
  const unique = [...new Set(lemmaIds)]
  const immediate = Math.min(10, unique.length)
  for (let index = 0; index < unique.length; index += 1) {
    const date = new Date(from)
    if (index < immediate) {
      // Due now
    } else {
      // Spread remaining across the next 7 days
      const dayOffset = 1 + ((index - immediate) % 7)
      date.setDate(date.getDate() + dayOffset)
    }
    map.set(unique[index], date.toISOString())
  }
  return map
}

/** Enqueue lemmas into the local Vocab Vault (staggered by default). */
export function enqueueLocalVocabulary(lemmaIds: string[], options?: { stagger?: boolean }) {
  const store = readStore()
  const stagger = options?.stagger !== false
  const dates = stagger ? staggerReviewDates(lemmaIds) : null
  const now = new Date().toISOString()
  for (const vocab_id of lemmaIds) {
    if (store[vocab_id]) {
      store[vocab_id].total_encounters += 1
      continue
    }
    store[vocab_id] = {
      vocab_id,
      repetition_count: 0,
      ease_factor: 2.5,
      interval_days: 0,
      total_encounters: 1,
      mistake_count: 0,
      next_review_at: dates?.get(vocab_id) ?? now,
      last_reviewed_at: null,
    }
  }
  writeStore(store)
}

/** Full local pool for the infinite review loop. */
export function getAllLocalVocabulary(): LocalVaultItem[] {
  return Object.values(readStore()).sort((left, right) => left.next_review_at.localeCompare(right.next_review_at))
}

export function getDueLocalVocabulary(limit = 20): LocalVaultItem[] {
  const now = Date.now()
  return getAllLocalVocabulary()
    .filter((item) => new Date(item.next_review_at).getTime() <= now)
    .slice(0, limit)
}

export function scoreLocalVocabulary(vocabId: string, quality: number) {
  const store = readStore()
  const item = store[vocabId]
  if (!item) return
  const schedule = calculateSrsSchedule(
    {
      repetitionCount: item.repetition_count,
      easeFactor: item.ease_factor,
      intervalDays: item.interval_days,
    },
    quality,
  )
  store[vocabId] = {
    ...item,
    repetition_count: schedule.repetitionCount,
    ease_factor: schedule.easeFactor,
    interval_days: schedule.intervalDays,
    next_review_at: schedule.nextReview.toISOString(),
    last_reviewed_at: new Date().toISOString(),
    total_encounters: item.total_encounters + 1,
    mistake_count: item.mistake_count + (quality < 3 ? 1 : 0),
  }
  writeStore(store)
}

export function resolveVaultWord(vocabId: string, vocabulary: VocabularyWord[]) {
  return vocabulary.find((word) => word.id === vocabId) ?? null
}

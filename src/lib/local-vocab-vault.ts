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

/** Enqueue lemmas into the local Vocab Vault (due immediately). */
export function enqueueLocalVocabulary(lemmaIds: string[]) {
  const store = readStore()
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
      next_review_at: now,
      last_reviewed_at: null,
    }
  }
  writeStore(store)
}

export function getDueLocalVocabulary(limit = 20): LocalVaultItem[] {
  const now = Date.now()
  return Object.values(readStore())
    .filter((item) => new Date(item.next_review_at).getTime() <= now)
    .sort((left, right) => left.next_review_at.localeCompare(right.next_review_at))
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

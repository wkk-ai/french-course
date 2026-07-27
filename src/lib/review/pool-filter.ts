import { isReviewablePartOfSpeech } from '@/lib/exercises/validate'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import type { ReviewPoolItem } from '@/lib/review/types'

/** Resolve POS from pool row or bundled vocabulary fallback. */
export function resolvedPartOfSpeech(item: Pick<ReviewPoolItem, 'vocab_id' | 'part_of_speech'>): string | null {
  const direct = (item.part_of_speech ?? '').trim()
  if (direct) return direct
  const bundled = BUNDLED_VOCABULARY.find((word) => word.id === item.vocab_id)
  return bundled?.part_of_speech ?? null
}

/** Hard filter: never quiz proper nouns / character names (Marc, Paris, etc.). */
export function isReviewablePoolItem(item: Pick<ReviewPoolItem, 'vocab_id' | 'part_of_speech'>): boolean {
  return isReviewablePartOfSpeech(resolvedPartOfSpeech(item))
}

export function filterReviewPool<T extends ReviewPoolItem>(items: T[]): T[] {
  return items.filter(isReviewablePoolItem)
}

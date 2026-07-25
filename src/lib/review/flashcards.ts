import type { FlashcardDeck, FlashcardItem, FlashcardPosFilter, ReviewPoolItem } from '@/lib/review/types'

const POS_MATCH: Record<Exclude<FlashcardPosFilter, 'all'>, string[]> = {
  verb: ['verb'],
  noun: ['noun', 'proper noun'],
  adjective: ['adjective'],
  adverb: ['adverb'],
  pronoun: ['pronoun'],
}

export const FLASHCARD_FILTERS: Array<{ id: FlashcardPosFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'verb', label: 'Verbs' },
  { id: 'noun', label: 'Nouns' },
  { id: 'adjective', label: 'Adjectives' },
  { id: 'adverb', label: 'Adverbs' },
  { id: 'pronoun', label: 'Pronouns' },
]

export function matchesPosFilter(partOfSpeech: string | null | undefined, filter: FlashcardPosFilter): boolean {
  if (filter === 'all') return true
  const normalized = (partOfSpeech ?? '').toLowerCase().trim()
  return POS_MATCH[filter].includes(normalized)
}

function isDue(item: ReviewPoolItem, now: number) {
  return new Date(item.next_review_at).getTime() <= now
}

function toFlashcard(item: ReviewPoolItem): FlashcardItem | null {
  const word = item.word?.trim()
  const translation = item.base_translation?.trim()
  if (!word || !translation) return null
  return { ...item, word, base_translation: translation }
}

/**
 * Build a flashcard deck from the learner's pool.
 * Priority: mistake_count > 0, then due, then fill. Due-only preference for well-known words.
 */
export function buildFlashcardDeck(
  pool: ReviewPoolItem[],
  options?: { posFilter?: FlashcardPosFilter; size?: number; now?: number },
): FlashcardDeck {
  const posFilter = options?.posFilter ?? 'all'
  const size = options?.size ?? 20
  const now = options?.now ?? Date.now()

  const filtered = pool
    .filter((item) => matchesPosFilter(item.part_of_speech, posFilter))
    .map(toFlashcard)
    .filter((item): item is FlashcardItem => Boolean(item))

  const weak = filtered.filter((item) => item.mistake_count > 0).sort((a, b) => b.mistake_count - a.mistake_count)
  const due = filtered.filter((item) => item.mistake_count === 0 && isDue(item, now)).sort((a, b) => a.next_review_at.localeCompare(b.next_review_at))
  // Only pull non-due when the deck would otherwise be short (keeps Easy-rated words out longer).
  const rest = filtered
    .filter((item) => item.mistake_count === 0 && !isDue(item, now))
    .sort((a, b) => (a.last_reviewed_at ?? '').localeCompare(b.last_reviewed_at ?? ''))

  const used = new Set<string>()
  const cards: FlashcardItem[] = []
  for (const list of [weak, due, rest]) {
    for (const card of list) {
      if (cards.length >= size) break
      if (used.has(card.vocab_id)) continue
      used.add(card.vocab_id)
      cards.push(card)
    }
  }

  return { cards, posFilter }
}

export function countPoolByFilter(pool: ReviewPoolItem[], filter: FlashcardPosFilter): number {
  return pool.filter((item) => matchesPosFilter(item.part_of_speech, filter) && item.word && item.base_translation).length
}

/** Again=1, Hard=3 (success, shorter), Easy=5 (longest). */
export function flashcardQuality(rating: 'again' | 'easy' | 'hard'): number {
  if (rating === 'again') return 1
  if (rating === 'hard') return 3
  return 5
}

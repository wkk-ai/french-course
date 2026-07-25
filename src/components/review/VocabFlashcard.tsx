'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import type { FlashcardItem } from '@/lib/review/types'
import { isConjugableVerb } from '@/lib/french-conjugations'
import { BUNDLED_VOCABULARY } from '@/lib/phase1/content'

const REGISTER_LABEL: Record<string, string> = {
  Courant: 'Everyday',
  Soutenu: 'Formal',
  Familier: 'Casual',
  Argot: 'Slang',
}

export function VocabFlashcard({
  card,
  index,
  total,
  onRate,
  disabled,
}: {
  card: FlashcardItem
  index: number
  total: number
  onRate: (rating: 'again' | 'easy' | 'hard') => void
  disabled?: boolean
}) {
  const [revealed, setRevealed] = useState(false)
  const bundled = BUNDLED_VOCABULARY.find((word) => word.id === card.vocab_id)
  const meanings = bundled?.meanings?.length
    ? bundled.meanings
    : card.base_translation.split(';').map((part) => part.trim()).filter(Boolean)
  const exampleFrench = card.example_french ?? bundled?.example?.french ?? null
  const exampleEnglish = card.example_english ?? bundled?.example?.english ?? null
  const showConjugate = bundled ? isConjugableVerb(bundled) : card.part_of_speech === 'verb'
  const register = card.register ?? bundled?.register ?? null

  return (
    <div className="space-y-4">
      <p className="text-label-caps text-on-surface-variant">
        FLASHCARD · {index + 1} OF {total}
        {card.mistake_count > 0 ? ` · Missed ${card.mistake_count}×` : ''}
      </p>

      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="tactile-card flex min-h-[220px] w-full flex-col items-center justify-center gap-3 p-8 text-center"
      >
        <p className="text-label-caps text-on-surface-variant">{card.part_of_speech ?? 'word'}</p>
        <p className="text-headline-lg">{card.word}</p>
        {register && (
          <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-on-primary">
            {REGISTER_LABEL[register] ?? register}
          </span>
        )}
        {!revealed && (
          <p className="mt-4 text-sm text-on-surface-variant">Tap to reveal meaning</p>
        )}
        {revealed && (
          <div className="mt-2 w-full space-y-3 text-left">
            {meanings.length > 1 ? (
              <ul className="list-disc space-y-1 pl-5 text-body-ui">
                {meanings.map((meaning) => (
                  <li key={meaning}>{meaning}</li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-body-ui text-on-surface-variant">{meanings[0]}</p>
            )}
            {exampleFrench && (
              <div className="rounded-lg bg-surface-container-low p-3 text-sm">
                <p className="font-medium">{exampleFrench}</p>
                {exampleEnglish && <p className="mt-1 text-on-surface-variant">{exampleEnglish}</p>}
              </div>
            )}
            {showConjugate && (
              <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-primary">
                <BookOpen className="size-3.5" /> Conjugable verb — practice in lessons too
              </p>
            )}
          </div>
        )}
      </button>

      {revealed && (
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRate('again')}
            className="tactile-button rounded-xl border-2 border-error/40 bg-error-container/30 py-4 font-bold text-on-error-container disabled:opacity-50"
          >
            Again
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRate('easy')}
            className="tactile-button rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary disabled:opacity-50"
          >
            Easy
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRate('hard')}
            className="tactile-button rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface disabled:opacity-50"
          >
            Hard
          </button>
        </div>
      )}
    </div>
  )
}

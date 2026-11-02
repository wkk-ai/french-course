'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { VocabularyWord } from '@/lib/course'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { tokenizeFrench } from '@/lib/clickable-text'
import { CONJUGATION_TENSES, conjugationsForWord, isConjugableVerb } from '@/lib/french-conjugations'
import { conjugationPhrase } from '@/lib/tenses/format'
import { SpeakButton } from '@/components/SpeakButton'

/**
 * Tap any French word to see its meaning. One bottom sheet per page (the provider),
 * any number of <FrenchText> inside it.
 */

type Ctx = { open: (word: VocabularyWord) => void; byId: Map<string, VocabularyWord> }
const DictionaryContext = createContext<Ctx | null>(null)

const REGISTER: Record<string, string> = { Courant: 'Everyday', Soutenu: 'Formal', Familier: 'Casual', Argot: 'Slang' }

export function DictionaryProvider({ children }: { children: ReactNode }) {
  const [word, setWord] = useState<VocabularyWord | null>(null)
  const [tense, setTense] = useState<string>('Présent')
  const [mounted, setMounted] = useState(false)
  const byId = useMemo(() => new Map(BUNDLED_VOCABULARY.map((item) => [item.id, item])), [])
  const open = useCallback((next: VocabularyWord) => {
    setTense('Présent')
    setWord(next)
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => setMounted(true))
  }, [])

  useEffect(() => {
    if (!word) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setWord(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [word])

  const meanings = word ? (word.meanings?.length ? word.meanings : word.base_translation.split(';').map((m) => m.trim()).filter(Boolean)) : []
  const conjugable = word ? isConjugableVerb(word) : false
  const rows = word && conjugable ? conjugationsForWord(word).filter((row) => row.tense === tense) : []

  return (
    <DictionaryContext.Provider value={{ open, byId }}>
      {children}
      {mounted && word && createPortal(
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/30" onClick={() => setWord(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`${word.word}: meaning`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[80vh] w-full max-w-[680px] overflow-y-auto rounded-t-[28px] bg-white px-5 pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-10px_40px_rgba(17,17,20,0.16)]"
          >
            <span aria-hidden="true" className="mx-auto mb-3 block h-1.5 w-9 rounded-full bg-surface-container-highest" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xl font-bold">{word.word}</p>
                <p className="text-xs text-on-surface-variant">
                  {[word.part_of_speech, word.gender, REGISTER[word.register] ?? word.register].filter(Boolean).join(' · ')}
                  {word.ipa_pronunciation ? ` · ${word.ipa_pronunciation}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <SpeakButton text={word.word} />
                <button type="button" onClick={() => setWord(null)} aria-label="Close" className="flex size-11 items-center justify-center rounded-full bg-surface-container-low">
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-body-ui">
              {meanings.map((meaning) => <li key={meaning}>{meaning}</li>)}
            </ul>
            {word.example && (
              <div className="mt-3 rounded-2xl bg-surface-container-low p-3">
                <p className="text-[17px]">{word.example.french}</p>
                <p className="text-sm text-on-surface-variant">{word.example.english}</p>
              </div>
            )}
            {word.idiom_explanation && <p className="mt-2 text-sm text-on-surface-variant">{word.idiom_explanation}</p>}
            {conjugable && (
              <div className="mt-4">
                <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1" role="tablist" aria-label="Tense">
                  {CONJUGATION_TENSES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={tense === name}
                      onClick={() => setTense(name)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${tense === name ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <ul className="mt-2">
                  {rows.map((row) => (
                    <li key={row.id} className="py-1 text-body-ui font-semibold">{conjugationPhrase(row)}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>,
        document.body,
      )}
    </DictionaryContext.Provider>
  )
}

/** French text where every known word opens its meaning. Unknown words render as plain text.
 * Spacing is copied from the original text, so punctuation looks exactly as written. */
export function FrenchText({ text, className }: { text: string; className?: string }) {
  const ctx = useContext(DictionaryContext)
  const pieces = useMemo(() => {
    const tokens = tokenizeFrench(text, 'ft', BUNDLED_VOCABULARY)
    const out: Array<{ key: string; gap: string; text: string; lemmaId?: string }> = []
    let cursor = 0
    for (const token of tokens) {
      const at = text.indexOf(token.text, cursor)
      const gap = at >= 0 ? text.slice(cursor, at) : ' '
      out.push({ key: token.id, gap, text: token.text, lemmaId: token.lemmaId })
      if (at >= 0) cursor = at + token.text.length
    }
    return { out, tail: text.slice(cursor) }
  }, [text])
  if (!ctx) return <span className={className}>{text}</span>
  return (
    <span className={className}>
      {pieces.out.map((piece) => {
        const word = piece.lemmaId ? ctx.byId.get(piece.lemmaId) : undefined
        return (
          <span key={piece.key}>
            {piece.gap}
            {word ? (
              <button
                type="button"
                onClick={(event) => { event.preventDefault(); event.stopPropagation(); ctx.open(word) }}
                className="-my-1 rounded-[4px] py-1 underline decoration-primary/35 decoration-dotted underline-offset-4 hover:bg-primary-fixed/60 active:bg-primary-fixed"
              >
                {piece.text}
              </button>
            ) : (
              piece.text
            )}
          </span>
        )
      })}
      {pieces.tail}
    </span>
  )
}

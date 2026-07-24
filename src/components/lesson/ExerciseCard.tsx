'use client'

import { useMemo, useState } from 'react'
import type { ExerciseAnswer, LessonExercise } from '@/lib/exercises/types'
import { exerciseType } from '@/lib/exercises/types'
import { correctAnswerLabel, isExerciseCorrect } from '@/lib/exercises/grading'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function optionClasses(locked: boolean, isSelected: boolean, isCorrectOption: boolean, userCorrect: boolean) {
  if (locked && isCorrectOption) return 'border-success bg-success/10 text-tertiary'
  if (locked && isSelected && !userCorrect) return 'border-error bg-error-container/40 text-on-error-container'
  if (!locked) return 'border-surface-variant hover:bg-surface-container-low'
  return 'border-surface-variant'
}

export function ExerciseCard({
  exercise,
  index,
  total,
  answer,
  onAnswer,
  onMistake,
}: {
  exercise: LessonExercise
  index: number
  total: number
  answer: ExerciseAnswer | undefined
  onAnswer: (value: ExerciseAnswer) => void
  onMistake: () => void
}) {
  const locked = answer !== undefined
  const correct = locked && isExerciseCorrect(exercise, answer)
  const [hintShown, setHintShown] = useState(false)
  const [orderBank, setOrderBank] = useState<string[]>(() => ('type' in exercise && exercise.type === 'order' ? shuffle(exercise.words) : []))
  const [orderPicked, setOrderPicked] = useState<string[]>(() => (answer?.kind === 'order' ? answer.value : []))
  const [matchSelection, setMatchSelection] = useState<{ side: 'left' | 'right'; index: number } | null>(null)
  const [matchPairs, setMatchPairs] = useState<Record<number, number>>(() => (answer?.kind === 'match' ? answer.value : {}))

  const usedRight = useMemo(() => new Set(Object.values(matchPairs)), [matchPairs])

  const submitChoice = (value: number) => {
    if (locked) return
    onAnswer({ kind: 'choice', value })
    if (!isExerciseCorrect(exercise, { kind: 'choice', value })) onMistake()
  }

  const submitText = (value: string) => {
    if (locked) return
    const response = { kind: 'text' as const, value }
    onAnswer(response)
    if (!isExerciseCorrect(exercise, response)) onMistake()
  }

  const submitBoolean = (value: boolean) => {
    if (locked) return
    const response = { kind: 'boolean' as const, value }
    onAnswer(response)
    if (!isExerciseCorrect(exercise, response)) onMistake()
  }

  const submitIndex = (value: number) => {
    if (locked) return
    const response = { kind: 'index' as const, value }
    onAnswer(response)
    if (!isExerciseCorrect(exercise, response)) onMistake()
  }

  const lockOrder = (picked: string[]) => {
    const response = { kind: 'order' as const, value: picked }
    onAnswer(response)
    if (!isExerciseCorrect(exercise, response)) onMistake()
  }

  const lockMatch = (pairs: Record<number, number>) => {
    const response = { kind: 'match' as const, value: pairs }
    onAnswer(response)
    if (!isExerciseCorrect(exercise, response)) onMistake()
  }

  const pickOrderWord = (word: string, wordIndex: number) => {
    if (locked || exercise.type !== 'order') return
    const next = [...orderPicked, word]
    const nextBank = orderBank.filter((_, i) => i !== wordIndex)
    setOrderPicked(next)
    setOrderBank(nextBank)
    if (next.length === exercise.answer.length) lockOrder(next)
  }

  const resetOrder = () => {
    if (locked || exercise.type !== 'order') return
    setOrderPicked([])
    setOrderBank(shuffle(exercise.words))
  }

  const handleMatchClick = (side: 'left' | 'right', index: number) => {
    if (locked || exercise.type !== 'match') return
    if (!matchSelection) {
      setMatchSelection({ side, index })
      return
    }
    if (matchSelection.side === side) {
      setMatchSelection({ side, index })
      return
    }
    const leftIndex = side === 'left' ? index : matchSelection.index
    const rightIndex = side === 'right' ? index : matchSelection.index
    const next = { ...matchPairs, [leftIndex]: rightIndex }
    setMatchPairs(next)
    setMatchSelection(null)
    if (Object.keys(next).length === exercise.pairs.length) lockMatch(next)
  }

  const sourceLabel = exercise.source === 'spiral' ? ' · spiral review' : exercise.source === 'remediation' ? ' · from your mistakes' : ''

  return (
    <article className="tactile-card p-5">
      <p className="text-label-caps text-primary">
        {exerciseType(exercise).toUpperCase()} · QUESTION {index + 1} OF {total}{sourceLabel}
      </p>
      <h2 className="mt-2 text-body-ui font-bold">{exercise.prompt}</h2>

      {exercise.type === 'cloze' && (
        <div className="mt-4">
          <p className="text-body-reading">{exercise.text.replace(/___+/g, '______')}</p>
          <input
            type="text"
            disabled={locked}
            placeholder="Type your answer…"
            className="mt-3 w-full rounded-lg border-2 border-surface-variant bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70"
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitText((event.target as HTMLInputElement).value)
            }}
            onBlur={(event) => {
              if (event.target.value.trim()) submitText(event.target.value)
            }}
          />
        </div>
      )}

      {exercise.type === 'translate' && (
        <div className="mt-4">
          <p className="text-sm text-on-surface-variant">{exercise.direction === 'en-fr' ? 'English → French' : 'French → English'}</p>
          <input
            type="text"
            disabled={locked}
            placeholder="Type your translation…"
            className="mt-3 w-full rounded-lg border-2 border-surface-variant bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70"
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitText((event.target as HTMLInputElement).value)
            }}
            onBlur={(event) => {
              if (event.target.value.trim()) submitText(event.target.value)
            }}
          />
        </div>
      )}

      {exercise.type === 'conjugation' && (
        <div className="mt-4">
          <p className="text-body-reading">
            <span className="font-semibold">{exercise.verb}</span> · {exercise.tense} · <span className="text-primary">{exercise.pronoun}</span> ______
          </p>
          <input
            type="text"
            disabled={locked}
            placeholder="Type the conjugated form…"
            className="mt-3 w-full rounded-lg border-2 border-surface-variant bg-surface-container-lowest px-3 py-2 text-sm disabled:opacity-70"
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitText((event.target as HTMLInputElement).value)
            }}
            onBlur={(event) => {
              if (event.target.value.trim()) submitText(event.target.value)
            }}
          />
        </div>
      )}

      {exercise.type === 'true-false' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <p className="col-span-2 rounded-lg bg-surface-container-low p-3 text-sm">{exercise.statement}</p>
          {([true, false] as const).map((value) => {
            const isSelected = answer?.kind === 'boolean' && answer.value === value
            const isCorrectOption = value === exercise.answer
            return (
              <button
                key={String(value)}
                type="button"
                disabled={locked}
                onClick={() => submitBoolean(value)}
                className={`rounded-lg border-2 p-3 text-sm font-semibold disabled:cursor-default ${optionClasses(locked, isSelected, isCorrectOption, correct)}`}
              >
                {value ? 'True' : 'False'}
              </button>
            )
          })}
        </div>
      )}

      {exercise.type === 'spot-error' && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-on-surface-variant">Tap the incorrect word.</p>
          <div className="flex flex-wrap gap-2">
            {exercise.words.map((word, wordIndex) => {
              const isSelected = answer?.kind === 'index' && answer.value === wordIndex
              const isCorrectOption = wordIndex === exercise.errorIndex
              return (
                <button
                  key={`${word}-${wordIndex}`}
                  type="button"
                  disabled={locked}
                  onClick={() => submitIndex(wordIndex)}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold disabled:cursor-default ${optionClasses(locked, isSelected, isCorrectOption, correct)}`}
                >
                  {word}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {exercise.type === 'order' && (
        <div className="mt-4 space-y-3">
          <p className="rounded-lg border-2 border-dashed border-primary/40 bg-primary-fixed/10 p-3 text-body-reading min-h-[3rem]">
            {orderPicked.length ? orderPicked.join(' ') : 'Tap words below to build the sentence…'}
          </p>
          <div className="flex flex-wrap gap-2">
            {orderBank.map((word, wordIndex) => (
              <button
                key={`${word}-${wordIndex}`}
                type="button"
                disabled={locked}
                onClick={() => pickOrderWord(word, wordIndex)}
                className="rounded-lg border-2 border-surface-variant bg-surface-container-low px-3 py-2 text-sm font-semibold hover:bg-surface-container-high disabled:opacity-60"
              >
                {word}
              </button>
            ))}
          </div>
          {!locked && orderPicked.length > 0 && (
            <button type="button" onClick={resetOrder} className="text-xs font-bold text-primary underline">
              Reset
            </button>
          )}
        </div>
      )}

      {exercise.type === 'match' && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            {exercise.left.map((item, leftIndex) => {
              const pairedRight = matchPairs[leftIndex]
              const isSelected = matchSelection?.side === 'left' && matchSelection.index === leftIndex
              return (
                <button
                  key={item}
                  type="button"
                  disabled={locked || pairedRight !== undefined}
                  onClick={() => handleMatchClick('left', leftIndex)}
                  className={`w-full rounded-lg border-2 p-2 text-left text-sm font-semibold disabled:cursor-default ${isSelected ? 'border-primary bg-primary-fixed/30' : pairedRight !== undefined ? 'border-success/50 bg-success/5' : 'border-surface-variant hover:bg-surface-container-low'}`}
                >
                  {item}
                  {pairedRight !== undefined ? ` → ${exercise.right[pairedRight]}` : ''}
                </button>
              )
            })}
          </div>
          <div className="space-y-2">
            {exercise.right.map((item, rightIndex) => {
              const isUsed = usedRight.has(rightIndex)
              const isSelected = matchSelection?.side === 'right' && matchSelection.index === rightIndex
              return (
                <button
                  key={item}
                  type="button"
                  disabled={locked || isUsed}
                  onClick={() => handleMatchClick('right', rightIndex)}
                  className={`w-full rounded-lg border-2 p-2 text-left text-sm font-semibold disabled:cursor-default ${isSelected ? 'border-primary bg-primary-fixed/30' : isUsed ? 'opacity-40' : 'border-surface-variant hover:bg-surface-container-low'}`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {(exercise.type === 'register' || exercise.type === 'dialogue') && (
        <div className="mt-4 space-y-3">
          {'situation' in exercise && <p className="rounded-lg bg-surface-container-low p-3 text-sm text-on-surface-variant">{exercise.situation}</p>}
          {'context' in exercise && <p className="rounded-lg bg-surface-container-low p-3 text-sm text-on-surface-variant">{exercise.context}</p>}
          <div className="grid gap-2">
            {exercise.options.map((option, optionIndex) => {
              const isSelected = answer?.kind === 'choice' && answer.value === optionIndex
              const isCorrectOption = optionIndex === exercise.answer
              return (
                <button
                  key={option}
                  type="button"
                  disabled={locked}
                  onClick={() => submitChoice(optionIndex)}
                  className={`rounded-lg border-2 p-3 text-left text-sm font-semibold disabled:cursor-default ${optionClasses(locked, isSelected, isCorrectOption, correct)}`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {(!exercise.type || exercise.type === 'mcq' || exercise.type === 'reading' || exercise.type === 'minimal-pair') && (
        <div className="mt-4 grid gap-2">
          {exercise.options.map((option, optionIndex) => {
            const isSelected = answer?.kind === 'choice' && answer.value === optionIndex
            const isCorrectOption = optionIndex === exercise.answer
            return (
              <button
                key={option}
                type="button"
                disabled={locked}
                onClick={() => submitChoice(optionIndex)}
                className={`rounded-lg border-2 p-3 text-left text-sm font-semibold disabled:cursor-default ${optionClasses(locked, isSelected, isCorrectOption, correct)}`}
              >
                {option}
                {locked && isCorrectOption ? ' ✓' : ''}
                {locked && isSelected && !correct ? ' ✗' : ''}
              </button>
            )
          })}
        </div>
      )}

      {!locked && exercise.hint && !hintShown && (
        <button type="button" onClick={() => setHintShown(true)} className="mt-3 text-xs font-bold text-primary underline">
          Show hint
        </button>
      )}
      {!locked && hintShown && exercise.hint && (
        <p className="mt-3 rounded-lg bg-primary-fixed/20 p-3 text-sm text-on-surface-variant">{exercise.hint}</p>
      )}

      {locked && (
        <p className={`mt-4 text-sm ${correct ? 'text-tertiary' : 'text-secondary'}`}>
          {correct ? 'Correct. ' : `Not quite — the answer is “${correctAnswerLabel(exercise)}”. `}
          {exercise.explanation}
        </p>
      )}
    </article>
  )
}

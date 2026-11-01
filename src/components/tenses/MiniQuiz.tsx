'use client'

import { useState } from 'react'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import type { GuideQuestion } from '@/lib/tenses/guide'

/** Five quick questions. A wrong answer can be retried. Nothing is saved or graded. */
export function MiniQuiz({ questions }: { questions: GuideQuestion[] }) {
  const [picked, setPicked] = useState<Record<string, number>>({})
  const correct = questions.filter((q) => picked[q.id] === q.answer).length

  return (
    <div className="space-y-5">
      {questions.map((question, index) => {
        const choice = picked[question.id]
        const done = choice === question.answer
        const wrong = choice !== undefined && !done
        return (
          <section key={question.id} className="tactile-card p-4">
            <p className="text-label-caps text-primary">QUESTION {index + 1} OF {questions.length}</p>
            <p className="mt-2 text-body-ui font-semibold text-on-surface">{question.prompt}</p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const isChoice = choice === optionIndex
                const state = isChoice ? (done ? 'ok' : 'bad') : 'idle'
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={done}
                    onClick={() => setPicked((prev) => ({ ...prev, [question.id]: optionIndex }))}
                    className={`min-h-11 rounded-xl border-2 px-4 py-3 text-left text-body-ui ${
                      state === 'ok'
                        ? 'border-success bg-success/10 font-bold'
                        : state === 'bad'
                          ? 'border-error bg-error-container/50'
                          : 'border-surface-variant bg-surface-container-lowest hover:bg-surface-container-low'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {done && (
              <p className="mt-3 flex items-start gap-2 text-sm text-on-surface-variant">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> {question.explanation}
              </p>
            )}
            {wrong && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm text-error">
                  <XCircle className="size-4" /> Not this one. Try again.
                </p>
                <button
                  type="button"
                  onClick={() => setPicked((prev) => { const next = { ...prev }; delete next[question.id]; return next })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-primary"
                >
                  <RotateCcw className="size-4" /> Reset
                </button>
              </div>
            )}
          </section>
        )
      })}
      <p className="text-center text-sm font-bold text-on-surface-variant" aria-live="polite">
        {correct === questions.length ? 'Well done. ' : ''}
        {correct} of {questions.length} correct
      </p>
    </div>
  )
}

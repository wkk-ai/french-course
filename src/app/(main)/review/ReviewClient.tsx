'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { calculateSrsSchedule } from '@/lib/srs'

type Vocabulary = {
  word: string
  base_translation: string
  register: string
  part_of_speech: string | null
}

type DueWord = {
  vocab_id: string
  repetition_count: number
  ease_factor: number
  interval_days: number
  total_encounters: number
  mistake_count: number
  vocabulary: Vocabulary | null
}

type Mistake = {
  id: string
  error_count: number
  grammar_category: string | null
  error_context: string | null
  vocabulary: Pick<Vocabulary, 'word' | 'base_translation'> | null
}

export default function ReviewClient() {
  const [words, setWords] = useState<DueWord[]>([])
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const item = words[index]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return

      const [dueResult, mistakesResult] = await Promise.all([
        supabase
          .from('user_vocab_progress')
          .select('*, vocabulary(*)')
          .eq('user_id', user.id)
          .lte('next_review_at', new Date().toISOString())
          .order('next_review_at')
          .limit(20),
        supabase
          .from('user_mistakes')
          .select('*, vocabulary(word, base_translation)')
          .eq('user_id', user.id)
          .eq('is_resolved', false)
          .order('last_error_at', { ascending: false })
          .limit(10),
      ])
      if (cancelled) return
      setWords((dueResult.data ?? []) as DueWord[])
      setMistakes((mistakesResult.data ?? []) as Mistake[])
    })().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const score = async (quality: number) => {
    if (!item) return
    setLoading(true)
    setError(null)
    const schedule = calculateSrsSchedule({
      repetitionCount: item.repetition_count,
      easeFactor: item.ease_factor,
      intervalDays: item.interval_days,
    }, quality)
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) throw new Error('Your session has expired. Please sign in again.')
      const { error: updateError } = await supabase.from('user_vocab_progress').update({
        repetition_count: schedule.repetitionCount,
        ease_factor: schedule.easeFactor,
        interval_days: schedule.intervalDays,
        next_review_at: schedule.nextReview.toISOString(),
        last_reviewed_at: new Date().toISOString(),
        total_encounters: item.total_encounters + 1,
        mistake_count: item.mistake_count + (quality < 3 ? 1 : 0),
      }).eq('user_id', user.id).eq('vocab_id', item.vocab_id)
      if (updateError) throw updateError

      if (quality < 3) {
        const { data: existing } = await supabase.from('user_mistakes').select('id, error_count').eq('user_id', user.id).eq('vocab_id', item.vocab_id).eq('is_resolved', false).maybeSingle()
        if (existing) {
          await supabase.from('user_mistakes').update({ error_count: existing.error_count + 1, last_error_at: new Date().toISOString() }).eq('id', existing.id)
        } else {
          await supabase.from('user_mistakes').insert({ user_id: user.id, vocab_id: item.vocab_id, error_context: 'Vocab Vault review' })
        }
      }
      if (index + 1 < words.length) {
        setIndex((current) => current + 1)
        setShowAnswer(false)
      } else {
        setWords([])
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save this review.')
    } finally {
      setLoading(false)
    }
  }

  const resolveMistake = async (mistakeId: string) => {
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.from('user_mistakes').update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq('id', mistakeId)
      if (updateError) throw updateError
      setMistakes((items) => items.filter((item) => item.id !== mistakeId))
      router.refresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to resolve this item.')
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-8">
      <header>
        <p className="text-label-caps text-primary">VOCAB VAULT</p>
        <h1 className="text-headline-lg">Review</h1>
        <p className="mt-2 text-body-reading text-on-surface-variant">Short, scheduled reviews make the words you read stay with you.</p>
      </header>

      {item ? <section>
        <div className="mb-3 flex justify-between text-label-caps text-on-surface-variant"><span>{index + 1} OF {words.length}</span><span>SM-2 SCHEDULE</span></div>
        <div className="tactile-card min-h-72 p-8 text-center">
          <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-on-primary">{item.vocabulary?.register ?? 'Courant'}</span>
          <h2 className="mt-8 font-reading text-4xl font-bold">{item.vocabulary?.word ?? 'Vocabulary item'}</h2>
          {showAnswer ? <div className="mt-8"><p className="text-headline-md text-primary">{item.vocabulary?.base_translation}</p><p className="mt-2 text-sm italic text-on-surface-variant">{item.vocabulary?.part_of_speech}</p></div> : <button onClick={() => setShowAnswer(true)} className="mt-8 rounded-full border-2 border-primary-fixed-dim bg-primary-fixed/20 px-6 py-2 font-bold text-primary">SHOW ANSWER</button>}
        </div>
        {showAnswer && <div className="mt-4 grid grid-cols-4 gap-2">
          {[[1, 'AGAIN', 'bg-error text-on-error border-[#93000a]'], [3, 'HARD', 'bg-surface-dim border-outline-variant'], [4, 'GOOD', 'bg-success text-on-primary border-[#46a302]'], [5, 'EASY', 'bg-primary text-on-primary border-[#002b54]']].map(([quality, label, classes]) => <button key={String(quality)} disabled={loading} onClick={() => score(Number(quality))} className={`tactile-button rounded-xl py-3 text-label-caps ${classes} disabled:opacity-50`}>{label}</button>)}
        </div>}
      </section> : <section className="tactile-card p-6 text-center"><CheckCircle2 className="mx-auto size-10 text-success" /><h2 className="mt-3 text-headline-md">You&apos;re caught up</h2><p className="mt-2 text-on-surface-variant">New words from completed lessons will appear here when they are due.</p></section>}

      <section>
        <div className="flex items-center justify-between"><div><p className="text-label-caps text-secondary">REMEMBRANCE QUEUE</p><h2 className="text-headline-md">Needs another look</h2></div><RotateCcw className="text-secondary" /></div>
        {mistakes.length ? <div className="mt-4 grid gap-3">{mistakes.map((mistake) => <article key={mistake.id} className="tactile-card flex items-center justify-between gap-4 p-4"><div><h3 className="font-bold">{mistake.vocabulary?.word ?? mistake.grammar_category ?? 'Grammar item'}</h3><p className="mt-1 text-sm text-on-surface-variant">{mistake.vocabulary?.base_translation ?? mistake.error_context ?? 'Review this structure in context.'}</p><p className="mt-1 text-label-caps text-secondary">{mistake.error_count} MISSED</p></div><button onClick={() => resolveMistake(mistake.id)} className="rounded-lg border-2 border-success px-3 py-2 text-sm font-bold text-tertiary">MARK MASTERED</button></article>)}</div> : <p className="mt-3 text-on-surface-variant">No unresolved mistakes. Keep reading and reviewing.</p>}
      </section>
      {error && <p role="alert" className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}
    </div>
  )
}

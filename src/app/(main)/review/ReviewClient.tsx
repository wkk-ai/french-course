'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronRight, Infinity as InfinityIcon, Play, RotateCcw } from 'lucide-react'
import { ExerciseCard } from '@/components/lesson/ExerciseCard'
import type { ExerciseAnswer } from '@/lib/exercises/types'
import { isExerciseCorrect } from '@/lib/exercises/grading'
import { MODULE1_CHAPTER_IDS, MODULE1_VOCABULARY } from '@/lib/module1-content'
import { getAllLocalVocabulary, enqueueLocalVocabulary, scoreLocalVocabulary } from '@/lib/local-vocab-vault'
import { buildReviewSession, emptySessionMessage } from '@/lib/review/session'
import { lemmaIdsForChapter, vocabularyRowsForLemmas } from '@/lib/review/lemmas'
import type { ReviewMistake, ReviewPoolItem, ReviewSessionPlan, ReviewTask, SessionMode } from '@/lib/review/types'
import { calculateSrsSchedule } from '@/lib/srs'
import { createClient } from '@/utils/supabase/client'

function resolveBundled(vocabId: string) {
  return MODULE1_VOCABULARY.find((item) => item.id === vocabId) ?? null
}

function enrichPoolItem(item: Omit<ReviewPoolItem, 'source'> & { source?: 'remote' | 'local' }, source: 'remote' | 'local'): ReviewPoolItem {
  const bundled = resolveBundled(item.vocab_id)
  return {
    ...item,
    source,
    word: item.word ?? bundled?.word ?? null,
    base_translation: item.base_translation ?? bundled?.base_translation ?? null,
    part_of_speech: item.part_of_speech ?? bundled?.part_of_speech ?? null,
    register: item.register ?? bundled?.register ?? null,
    example_french: item.example_french ?? bundled?.example?.french ?? null,
    example_english: item.example_english ?? bundled?.example?.english ?? null,
  }
}

const KIND_LABEL: Record<ReviewTask['kind'], string> = {
  repair: 'Repair',
  overdue: 'Overdue',
  due: 'Due',
  soon: 'Coming up',
  spiral: 'Spiral',
  weak: 'Weak spot',
}

export default function ReviewClient() {
  const [pool, setPool] = useState<ReviewPoolItem[]>([])
  const [mistakes, setMistakes] = useState<ReviewMistake[]>([])
  const [session, setSession] = useState<ReviewSessionPlan | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({})
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedInSession, setCompletedInSession] = useState(0)
  const [seenTaskIds, setSeenTaskIds] = useState<string[]>([])
  const [pendingQuality, setPendingQuality] = useState<number | null>(null)

  const task = session?.tasks[index]

  const loadPool = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      const local = getAllLocalVocabulary().map((item) => enrichPoolItem(item, 'local'))
      setPool(local)
      setMistakes([])
      return
    }

    const [progressResult, mistakesResult, completedResult] = await Promise.all([
      supabase
        .from('user_vocab_progress')
        .select('vocab_id, repetition_count, ease_factor, interval_days, total_encounters, mistake_count, next_review_at, last_reviewed_at, vocabulary(word, base_translation, part_of_speech, register)')
        .eq('user_id', user.id)
        .order('next_review_at')
        .limit(500),
      supabase
        .from('user_mistakes')
        .select('id, error_count, grammar_category, error_context, vocab_id, vocabulary(word, base_translation)')
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('last_error_at', { ascending: false })
        .limit(30),
      supabase
        .from('user_chapter_progress')
        .select('chapter_id')
        .eq('user_id', user.id)
        .eq('status', 'completed'),
    ])

    let remote: ReviewPoolItem[] = (progressResult.data ?? []).map((row) => {
      const vocabulary = Array.isArray(row.vocabulary) ? row.vocabulary[0] : row.vocabulary
      return enrichPoolItem(
        {
          vocab_id: row.vocab_id,
          repetition_count: row.repetition_count ?? 0,
          ease_factor: row.ease_factor ?? 2.5,
          interval_days: row.interval_days ?? 0,
          total_encounters: row.total_encounters ?? 1,
          mistake_count: row.mistake_count ?? 0,
          next_review_at: row.next_review_at ?? new Date().toISOString(),
          last_reviewed_at: row.last_reviewed_at ?? null,
          word: vocabulary?.word,
          base_translation: vocabulary?.base_translation,
          part_of_speech: vocabulary?.part_of_speech,
          register: vocabulary?.register,
        },
        'remote',
      )
    })

    // Backfill: completed Module 1 chapters with empty vocab pool (e.g. finished before enqueue worked).
    const completedIds = (completedResult.data ?? []).map((row) => row.chapter_id)
    const module1Completed = completedIds.filter((id) => (MODULE1_CHAPTER_IDS as readonly string[]).includes(id))
    const remoteIds = new Set(remote.map((item) => item.vocab_id))
    let localItems = getAllLocalVocabulary()

    if (remote.length === 0 && localItems.length === 0 && module1Completed.length > 0) {
      const lemmaIds = [...new Set(module1Completed.flatMap((id) => lemmaIdsForChapter(id)))]
      if (lemmaIds.length) {
        enqueueLocalVocabulary(lemmaIds)
        const rows = vocabularyRowsForLemmas(lemmaIds).map((word) => ({
          id: word.id,
          word: word.word,
          base_translation: word.base_translation,
          part_of_speech: word.part_of_speech,
          gender: word.gender,
          register: word.register,
          ipa_pronunciation: word.ipa_pronunciation,
          is_idiom: word.is_idiom,
          is_slang: word.is_slang,
          idiom_explanation: word.idiom_explanation,
        }))
        const { error: rpcError } = await supabase.rpc('enqueue_lesson_vocabulary', {
          p_vocab_rows: rows,
          p_lemma_ids: lemmaIds,
        })
        if (!rpcError) {
          const refreshed = await supabase
            .from('user_vocab_progress')
            .select('vocab_id, repetition_count, ease_factor, interval_days, total_encounters, mistake_count, next_review_at, last_reviewed_at, vocabulary(word, base_translation, part_of_speech, register)')
            .eq('user_id', user.id)
            .order('next_review_at')
            .limit(500)
          remote = (refreshed.data ?? []).map((row) => {
            const vocabulary = Array.isArray(row.vocabulary) ? row.vocabulary[0] : row.vocabulary
            return enrichPoolItem(
              {
                vocab_id: row.vocab_id,
                repetition_count: row.repetition_count ?? 0,
                ease_factor: row.ease_factor ?? 2.5,
                interval_days: row.interval_days ?? 0,
                total_encounters: row.total_encounters ?? 1,
                mistake_count: row.mistake_count ?? 0,
                next_review_at: row.next_review_at ?? new Date().toISOString(),
                last_reviewed_at: row.last_reviewed_at ?? null,
                word: vocabulary?.word,
                base_translation: vocabulary?.base_translation,
                part_of_speech: vocabulary?.part_of_speech,
                register: vocabulary?.register,
              },
              'remote',
            )
          })
        }
        localItems = getAllLocalVocabulary()
      }
    }

    const local = localItems
      .filter((item) => !remoteIds.has(item.vocab_id) && !remote.some((entry) => entry.vocab_id === item.vocab_id))
      .map((item) => enrichPoolItem(item, 'local'))

    setPool([...remote, ...local])
    setMistakes(
      (mistakesResult.data ?? []).map((row) => {
        const vocabulary = Array.isArray(row.vocabulary) ? row.vocabulary[0] : row.vocabulary
        return {
          id: row.id,
          error_count: row.error_count ?? 1,
          grammar_category: row.grammar_category,
          error_context: row.error_context,
          vocab_id: row.vocab_id,
          word: vocabulary?.word ?? null,
          base_translation: vocabulary?.base_translation ?? null,
        }
      }),
    )
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadPool()
      } catch {
        if (!cancelled) {
          setPool(getAllLocalVocabulary().map((item) => enrichPoolItem(item, 'local')))
        }
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadPool])

  const preview = useMemo(() => {
    if (!pool.length && !mistakes.length) return null
    return buildReviewSession(pool, mistakes, 'daily', { size: 15 })
  }, [pool, mistakes])

  const startSession = (mode: SessionMode) => {
    const plan = buildReviewSession(pool, mistakes, mode, {
      size: mode === 'daily' ? 15 : 12,
      excludeTaskIds: mode === 'continue' ? seenTaskIds : [],
    })
    if (!plan.tasks.length) {
      setError(emptySessionMessage(pool.length))
      return
    }
    setSession(plan)
    setIndex(0)
    setAnswers({})
    setPendingQuality(null)
    setCompletedInSession(0)
    setError(null)
    if (mode === 'daily') setSeenTaskIds([])
  }

  const goToNextCard = (current: ReviewTask, quality: number) => {
    setCompletedInSession((value) => value + 1)
    setSeenTaskIds((ids) => [...ids, current.id])
    setPendingQuality(null)
    setPool((currentPool) =>
      currentPool.map((item) => {
        if (item.vocab_id !== current.vocabId) return item
        const schedule = calculateSrsSchedule(
          {
            repetitionCount: item.repetition_count,
            easeFactor: item.ease_factor,
            intervalDays: item.interval_days,
          },
          quality,
        )
        return {
          ...item,
          repetition_count: schedule.repetitionCount,
          ease_factor: schedule.easeFactor,
          interval_days: schedule.intervalDays,
          next_review_at: schedule.nextReview.toISOString(),
          last_reviewed_at: new Date().toISOString(),
          total_encounters: item.total_encounters + 1,
          mistake_count: item.mistake_count + (quality < 3 ? 1 : 0),
        }
      }),
    )

    if (session && index + 1 < session.tasks.length) {
      setIndex((value) => value + 1)
      return
    }
    setIndex(session?.tasks.length ?? 0)
  }

  const persistVocabScore = async (current: ReviewTask, quality: number) => {
    if (!current.vocabId || !current.poolItem) return
    if (current.poolItem.source === 'local') {
      scoreLocalVocabulary(current.vocabId, quality)
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      scoreLocalVocabulary(current.vocabId, quality)
      return
    }
    const schedule = calculateSrsSchedule(
      {
        repetitionCount: current.poolItem.repetition_count,
        easeFactor: current.poolItem.ease_factor,
        intervalDays: current.poolItem.interval_days,
      },
      quality,
    )
    const { error: updateError } = await supabase
      .from('user_vocab_progress')
      .update({
        repetition_count: schedule.repetitionCount,
        ease_factor: schedule.easeFactor,
        interval_days: schedule.intervalDays,
        next_review_at: schedule.nextReview.toISOString(),
        last_reviewed_at: new Date().toISOString(),
        total_encounters: current.poolItem.total_encounters + 1,
        mistake_count: current.poolItem.mistake_count + (quality < 3 ? 1 : 0),
      })
      .eq('user_id', user.id)
      .eq('vocab_id', current.vocabId)
    if (updateError) scoreLocalVocabulary(current.vocabId, quality)
  }

  const resolveMistake = async (mistakeId: string) => {
    const supabase = createClient()
    await supabase.from('user_mistakes').update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq('id', mistakeId)
    setMistakes((items) => items.filter((item) => item.id !== mistakeId))
  }

  const onCardAnswer = async (answer: ExerciseAnswer) => {
    if (!task || pendingQuality !== null) return
    setAnswers((current) => ({ ...current, [task.id]: answer }))
    const correct = isExerciseCorrect(task.exercise, answer)
    const quality = correct ? 4 : 1
    setLoading(true)
    setError(null)
    try {
      if (task.kind === 'repair' && task.mistakeId) {
        if (correct) await resolveMistake(task.mistakeId)
      } else if (task.vocabId) {
        await persistVocabScore(task, quality)
      }
      setPendingQuality(quality)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save this review.')
    } finally {
      setLoading(false)
    }
  }

  if (booting) {
    return (
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-center p-8">
        <p className="text-on-surface-variant">Loading your review loop…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[680px] flex-col gap-8">
      <header>
        <p className="text-label-caps text-primary">INFINITE LOOP</p>
        <h1 className="text-headline-lg">Review</h1>
        <p className="mt-2 text-body-reading text-on-surface-variant">
          Everything you learn joins one perpetual loop. New lessons add words; mistakes become repair drills; old chapters spiral back forever.
        </p>
      </header>

      {!session && (
        <section className="tactile-card space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-label-caps text-on-surface-variant">YOUR LOOP</p>
              <h2 className="text-headline-md">{pool.length} words in the pool</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Due now: {preview?.dueCount ?? 0} · Repairs: {mistakes.length} · ~{preview?.estimatedMinutes ?? 0} min session
              </p>
            </div>
            <InfinityIcon className="size-8 text-primary" aria-hidden />
          </div>

          {pool.length === 0 && mistakes.length === 0 ? (
            <p className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
              {emptySessionMessage(0)}
            </p>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant">
                {pool.length === 0
                  ? 'Your word pool is empty, but repair drills are ready — start a session to practice them. Completing lessons also backfills words into the loop.'
                  : 'Your loop never empties once you have learned something. Start a mixed session, or keep reviewing forever from spiral + weak spots.'}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => startSession('daily')}
                  className="tactile-button flex items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary"
                >
                  <Play className="size-5" /> Start session
                </button>
                <button
                  type="button"
                  onClick={() => startSession('continue')}
                  disabled={pool.length === 0 && mistakes.length === 0}
                  className="tactile-button flex items-center justify-center gap-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface disabled:opacity-50"
                >
                  <InfinityIcon className="size-5" /> Keep reviewing
                </button>
              </div>
            </>
          )}
          {completedInSession > 0 && (
            <p className="text-sm text-tertiary">Last run: {completedInSession} cards practiced. Keep going anytime.</p>
          )}
        </section>
      )}

      {session && !task && (
        <section className="tactile-card space-y-4 p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" />
          <h2 className="text-headline-md">Session complete</h2>
          <p className="text-on-surface-variant">{completedInSession} cards done. The loop continues — keep reviewing?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => startSession('continue')} className="tactile-button rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary">
              Keep reviewing
            </button>
            <button type="button" onClick={() => setSession(null)} className="tactile-button rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
              Back to hub
            </button>
          </div>
        </section>
      )}

      {session && task && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-label-caps text-on-surface-variant">
            <span>
              {index + 1} OF {session.tasks.length} · {KIND_LABEL[task.kind]}
            </span>
            <span>{session.mode === 'daily' ? 'DAILY MIX' : 'KEEP GOING'}</span>
          </div>
          {task.lessonLabel && (
            <p className="rounded-lg border border-primary/20 bg-primary-fixed/20 px-3 py-2 text-sm font-semibold text-primary">
              From {task.lessonLabel}
            </p>
          )}
          <ExerciseCard
            key={task.id}
            exercise={task.exercise}
            index={index}
            total={session.tasks.length}
            answer={answers[task.id]}
            onAnswer={(value) => {
              if (answers[task.id] || loading || pendingQuality !== null) return
              void onCardAnswer(value)
            }}
            onMistake={() => {
              // Scored via quality in onCardAnswer
            }}
          />
          {loading && <p className="text-center text-sm text-on-surface-variant">Saving…</p>}
          {pendingQuality !== null && !loading && (
            <button
              type="button"
              onClick={() => goToNextCard(task, pendingQuality)}
              className="tactile-button flex w-full items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary"
            >
              {index + 1 < session.tasks.length ? 'Next' : 'Finish session'}
              <ChevronRight className="size-5" />
            </button>
          )}
        </section>
      )}

      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label-caps text-secondary">REPAIR LANE</p>
            <h2 className="text-headline-md">Needs another look</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Mistakes enter the next session as real drills. Correct answers resolve them — no passive “mastered”.</p>
          </div>
          <RotateCcw className="text-secondary" />
        </div>
        {mistakes.length ? (
          <div className="mt-4 grid gap-3">
            {mistakes.slice(0, 8).map((mistake) => (
              <article key={mistake.id} className="tactile-card p-4">
                <h3 className="font-bold">{mistake.word ?? mistake.grammar_category ?? 'Grammar item'}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">{mistake.base_translation ?? mistake.error_context ?? 'Queued for repair drills.'}</p>
                <p className="mt-1 text-label-caps text-secondary">{mistake.error_count} MISSED · IN LOOP</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-on-surface-variant">No open repairs. Keep reading — wrong answers feed this lane automatically.</p>
        )}
      </section>

      {error && <p role="alert" className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}
    </div>
  )
}

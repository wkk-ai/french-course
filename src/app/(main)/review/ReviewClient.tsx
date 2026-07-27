'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ChevronRight, Infinity as InfinityIcon, Layers, LogOut, Play } from 'lucide-react'
import { ExerciseCard } from '@/components/lesson/ExerciseCard'
import { VocabFlashcard } from '@/components/review/VocabFlashcard'
import { useReviewSessionLock } from '@/components/review/ReviewSessionLock'
import type { ExerciseAnswer } from '@/lib/exercises/types'
import { isExerciseCorrect } from '@/lib/exercises/grading'
import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { getAllLocalVocabulary, enqueueLocalVocabulary, scoreLocalVocabulary, subscribeLocalVault } from '@/lib/local-vocab-vault'
import { mergeCompletedChapterIds } from '@/lib/local-progress'
import { buildFlashcardDeck, countPoolByFilter, FLASHCARD_FILTERS, flashcardQuality } from '@/lib/review/flashcards'
import { filterReviewPool } from '@/lib/review/pool-filter'
import { buildReviewSession, emptySessionMessage } from '@/lib/review/session'
import { lemmaIdsForChapter, vocabularyRowsForLemmas } from '@/lib/review/lemmas'
import type {
  FlashcardDeck,
  FlashcardPosFilter,
  ReviewPoolItem,
  ReviewSessionPlan,
  ReviewTask,
  SessionMode,
} from '@/lib/review/types'
import { calculateSrsSchedule } from '@/lib/srs'
import { createClient } from '@/utils/supabase/client'

function resolveBundled(vocabId: string) {
  return BUNDLED_VOCABULARY.find((item) => item.id === vocabId) ?? null
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

function enrichPoolItems(
  items: Array<Omit<ReviewPoolItem, 'source'> & { source?: 'remote' | 'local' }>,
  source: 'remote' | 'local',
): ReviewPoolItem[] {
  return filterReviewPool(items.map((item) => enrichPoolItem(item, source)))
}

const KIND_LABEL: Record<ReviewTask['kind'], string> = {
  overdue: 'Overdue',
  due: 'Due',
  soon: 'Coming up',
  spiral: 'Spiral',
  weak: 'Weak spot',
}

type HubMode = 'exercises' | 'flashcards'

export default function ReviewClient() {
  const [pool, setPool] = useState<ReviewPoolItem[]>([])
  const [session, setSession] = useState<ReviewSessionPlan | null>(null)
  const [flashDeck, setFlashDeck] = useState<FlashcardDeck | null>(null)
  const [hubMode, setHubMode] = useState<HubMode>('exercises')
  const [posFilter, setPosFilter] = useState<FlashcardPosFilter>('all')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({})
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedInSession, setCompletedInSession] = useState(0)
  const [seenTaskIds, setSeenTaskIds] = useState<string[]>([])
  const [pendingQuality, setPendingQuality] = useState<number | null>(null)
  const { setActive: setReviewSessionLock } = useReviewSessionLock()

  const task = session?.tasks[index]
  const flashCard = flashDeck?.cards[index]
  const weakCount = useMemo(() => pool.filter((item) => item.mistake_count > 0).length, [pool])
  const missByVocab = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of pool) {
      if (item.mistake_count > 0) map.set(item.vocab_id, item.mistake_count)
    }
    return map
  }, [pool])

  const loadPool = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setPool(enrichPoolItems(getAllLocalVocabulary(), 'local'))
      return
    }

    const [progressResult, completedResult] = await Promise.all([
      supabase
        .from('user_vocab_progress')
        .select('vocab_id, repetition_count, ease_factor, interval_days, total_encounters, mistake_count, next_review_at, last_reviewed_at, vocabulary(word, base_translation, part_of_speech, register)')
        .eq('user_id', user.id)
        .order('next_review_at')
        .limit(2500),
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

    const completedIds = [...mergeCompletedChapterIds((completedResult.data ?? []).map((row) => row.chapter_id))]
    const authoredCompleted = completedIds.filter((id) => BUNDLED_CHAPTER_IDS.includes(id))
    const remoteIds = new Set(remote.map((item) => item.vocab_id))
    let localItems = getAllLocalVocabulary()
    const localIds = new Set(localItems.map((item) => item.vocab_id))
    const knownIds = new Set([...remoteIds, ...localIds])

    // Backfill any missing reviewable lemmas from completed authored chapters (not only empty pools).
    if (authoredCompleted.length > 0) {
      const needed = [...new Set(authoredCompleted.flatMap((id) => lemmaIdsForChapter(id)))]
      const missing = needed.filter((id) => !knownIds.has(id))
      if (missing.length) {
        enqueueLocalVocabulary(missing)
        const rows = vocabularyRowsForLemmas(missing).map((word) => ({
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
          p_lemma_ids: missing,
        })
        if (!rpcError) {
          const refreshed = await supabase
            .from('user_vocab_progress')
            .select('vocab_id, repetition_count, ease_factor, interval_days, total_encounters, mistake_count, next_review_at, last_reviewed_at, vocabulary(word, base_translation, part_of_speech, register)')
            .eq('user_id', user.id)
            .order('next_review_at')
            .limit(2500)
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

    const local = enrichPoolItems(
      localItems.filter((item) => !remoteIds.has(item.vocab_id) && !remote.some((entry) => entry.vocab_id === item.vocab_id)),
      'local',
    )

    setPool(filterReviewPool([...remote, ...local]))
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await loadPool()
      } catch {
        if (!cancelled) {
          setPool(enrichPoolItems(getAllLocalVocabulary(), 'local'))
        }
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadPool])

  useEffect(() => {
    return subscribeLocalVault(() => {
      const localItems = enrichPoolItems(getAllLocalVocabulary(), 'local')
      setPool((current) => {
        const remote = filterReviewPool(current.filter((item) => item.source === 'remote'))
        const remoteIds = new Set(remote.map((item) => item.vocab_id))
        const local = localItems.filter((item) => !remoteIds.has(item.vocab_id))
        return filterReviewPool([...remote, ...local])
      })
    })
  }, [])

  useEffect(() => {
    const inSession = Boolean(session || flashDeck)
    setReviewSessionLock(inSession)
    return () => setReviewSessionLock(false)
  }, [session, flashDeck, setReviewSessionLock])

  const preview = useMemo(() => {
    if (!pool.length) return null
    return buildReviewSession(pool, 'daily', { size: 15 })
  }, [pool])

  const applyScoreToPool = (vocabId: string, quality: number, previous: ReviewPoolItem) => {
    const schedule = calculateSrsSchedule(
      {
        repetitionCount: previous.repetition_count,
        easeFactor: previous.ease_factor,
        intervalDays: previous.interval_days,
      },
      quality,
    )
    return {
      ...previous,
      repetition_count: schedule.repetitionCount,
      ease_factor: schedule.easeFactor,
      interval_days: schedule.intervalDays,
      next_review_at: schedule.nextReview.toISOString(),
      last_reviewed_at: new Date().toISOString(),
      total_encounters: previous.total_encounters + 1,
      mistake_count: previous.mistake_count + (quality < 3 ? 1 : 0),
    }
  }

  const persistVocabScore = async (item: ReviewPoolItem, quality: number) => {
    // Always mirror locally so a later remote refresh cannot erase an unsaved rating.
    scoreLocalVocabulary(item.vocab_id, quality)
    if (item.source === 'local') return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const schedule = calculateSrsSchedule(
      {
        repetitionCount: item.repetition_count,
        easeFactor: item.ease_factor,
        intervalDays: item.interval_days,
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
        total_encounters: item.total_encounters + 1,
        mistake_count: item.mistake_count + (quality < 3 ? 1 : 0),
      })
      .eq('user_id', user.id)
      .eq('vocab_id', item.vocab_id)
    if (updateError) {
      throw new Error('Could not save this review online. It is kept on this device — try again.')
    }
  }

  const startSession = (mode: SessionMode) => {
    const plan = buildReviewSession(pool, mode, {
      size: mode === 'daily' ? 15 : 12,
      excludeTaskIds: mode === 'continue' ? seenTaskIds : [],
    })
    if (!plan.tasks.length) {
      setError(emptySessionMessage(pool.length))
      return
    }
    setHubMode('exercises')
    setFlashDeck(null)
    setSession(plan)
    setIndex(0)
    setAnswers({})
    setPendingQuality(null)
    setCompletedInSession(0)
    setError(null)
    if (mode === 'daily') setSeenTaskIds([])
  }

  const startFlashcards = () => {
    const deck = buildFlashcardDeck(pool, { posFilter, size: 20 })
    if (!deck.cards.length) {
      setError('No words match this filter yet. Finish a lesson or pick All.')
      return
    }
    setHubMode('flashcards')
    setSession(null)
    setFlashDeck(deck)
    setIndex(0)
    setCompletedInSession(0)
    setError(null)
  }

  const goToNextExercise = (current: ReviewTask, quality: number) => {
    setCompletedInSession((value) => value + 1)
    setSeenTaskIds((ids) => [...ids, current.id])
    setPendingQuality(null)
    if (current.vocabId) {
      setPool((currentPool) =>
        currentPool.map((item) => (item.vocab_id === current.vocabId ? applyScoreToPool(current.vocabId!, quality, item) : item)),
      )
    }
    if (session && index + 1 < session.tasks.length) {
      setIndex((value) => value + 1)
      return
    }
    setIndex(session?.tasks.length ?? 0)
  }

  const onCardAnswer = async (answer: ExerciseAnswer) => {
    if (!task || pendingQuality !== null) return
    setAnswers((current) => ({ ...current, [task.id]: answer }))
    const correct = isExerciseCorrect(task.exercise, answer)
    const quality = correct ? 4 : 1
    setLoading(true)
    setError(null)
    try {
      if (task.vocabId && task.poolItem) {
        await persistVocabScore(task.poolItem, quality)
      }
      setPendingQuality(quality)
    } catch (caughtError) {
      // Unlock the card so the learner can retry after a save failure.
      setPendingQuality(null)
      setAnswers((current) => {
        const next = { ...current }
        delete next[task.id]
        return next
      })
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save this review.')
    } finally {
      setLoading(false)
    }
  }

  const onFlashRate = async (rating: 'again' | 'easy' | 'hard') => {
    if (!flashCard || loading) return
    const quality = flashcardQuality(rating)
    setLoading(true)
    setError(null)
    try {
      await persistVocabScore(flashCard, quality)
      setPool((currentPool) =>
        currentPool.map((item) => (item.vocab_id === flashCard.vocab_id ? applyScoreToPool(flashCard.vocab_id, quality, item) : item)),
      )
      setCompletedInSession((value) => value + 1)
      if (flashDeck && index + 1 < flashDeck.cards.length) {
        setIndex((value) => value + 1)
      } else {
        setIndex(flashDeck?.cards.length ?? 0)
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save this flashcard.')
    } finally {
      setLoading(false)
    }
  }

  const backToHub = () => {
    setSession(null)
    setFlashDeck(null)
    setIndex(0)
    setPendingQuality(null)
  }

  const confirmExitSession = () => {
    if (window.confirm('Exit this review session? Cards you already finished are saved.')) {
      backToHub()
    }
  }

  useEffect(() => {
    if (!session && !flashDeck) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    const onPopState = () => {
      if (window.confirm('Exit this review session? Cards you already finished are saved.')) {
        backToHub()
        return
      }
      history.pushState(null, '', window.location.href)
    }
    history.pushState(null, '', window.location.href)
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('popstate', onPopState)
    }
  }, [session, flashDeck])

  const inExerciseSession = Boolean(session)
  const inFlashSession = Boolean(flashDeck)
  const inActiveSession = (inExerciseSession && Boolean(task)) || (inFlashSession && Boolean(flashCard))
  const exerciseDone = inExerciseSession && !task
  const flashDone = inFlashSession && !flashCard
  const showHub = !inExerciseSession && !inFlashSession

  if (booting) {
    return (
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-center p-8">
        <p className="text-on-surface-variant">Loading your review loop…</p>
      </div>
    )
  }

  return (
    <div className={`mx-auto flex w-full max-w-[680px] flex-col gap-8 ${inActiveSession ? 'pb-24' : ''}`}>
      <header>
        <p className="text-label-caps text-primary">INFINITE LOOP</p>
        <h1 className="text-headline-lg">Review</h1>
        <p className="mt-2 text-body-reading text-on-surface-variant">
          Everything you learn joins one perpetual loop. Practice with mixed exercises or train meanings with flashcards.
        </p>
      </header>

      {showHub && (
        <section className="tactile-card space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-label-caps text-on-surface-variant">YOUR LOOP</p>
              <h2 className="text-headline-md">{pool.length} words in the pool</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Due now: {preview?.dueCount ?? 0} · Weak spots: {weakCount} · ~{preview?.estimatedMinutes ?? 0} min session
              </p>
            </div>
            <InfinityIcon className="size-8 text-primary" aria-hidden />
          </div>

          {pool.length === 0 ? (
            <p className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant">
              {emptySessionMessage(0)}
            </p>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant">
                Your loop never empties once you have learned something. Start a mixed session, or keep reviewing forever from spiral + weak spots.
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
                  disabled={pool.length === 0}
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

      {(exerciseDone || flashDone) && (
        <section className="tactile-card space-y-4 p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" />
          <h2 className="text-headline-md">Session complete</h2>
          <p className="text-on-surface-variant">{completedInSession} cards done. The loop continues — keep reviewing?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => (hubMode === 'flashcards' ? startFlashcards() : startSession('continue'))}
              className="tactile-button rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary"
            >
              Keep reviewing
            </button>
            <button type="button" onClick={backToHub} className="tactile-button rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
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
              {task.vocabId && (missByVocab.get(task.vocabId) ?? 0) > 0
                ? ` · Missed ${missByVocab.get(task.vocabId)}×`
                : ''}
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
              onClick={() => goToNextExercise(task, pendingQuality)}
              className="tactile-button flex w-full items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary"
            >
              {index + 1 < session.tasks.length ? 'Next' : 'Finish session'}
              <ChevronRight className="size-5" />
            </button>
          )}
        </section>
      )}

      {flashDeck && flashCard && (
        <VocabFlashcard
          key={flashCard.vocab_id + index}
          card={flashCard}
          index={index}
          total={flashDeck.cards.length}
          onRate={(rating) => void onFlashRate(rating)}
          disabled={loading}
        />
      )}

      {showHub && (
        <section>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-label-caps text-secondary">VOCABULARY FLASHCARDS</p>
              <h2 className="text-headline-md">Train meanings</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Flip cards from your pool. Rate Again · Easy · Hard — Easy words come back less often.
              </p>
            </div>
            <Layers className="text-secondary" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {FLASHCARD_FILTERS.map((filter) => {
              const count = countPoolByFilter(pool, filter.id)
              const active = posFilter === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setPosFilter(filter.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                    active
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {filter.label} ({count})
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={startFlashcards}
            disabled={pool.length === 0}
            className="tactile-button mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary disabled:opacity-50"
          >
            <Layers className="size-5" /> Start flashcards · 20 cards
          </button>
        </section>
      )}

      {error && <p role="alert" className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}

      {inActiveSession && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-surface-variant bg-surface-container-lowest p-4 pb-safe md:left-24">
          <button
            type="button"
            onClick={confirmExitSession}
            className="tactile-button flex w-full items-center justify-center gap-2 rounded-xl border-2 border-surface-variant bg-surface-container-low py-3 font-bold text-on-surface"
          >
            <LogOut className="size-5" aria-hidden />
            Exit session
          </button>
        </div>
      )}
    </div>
  )
}

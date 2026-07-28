'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { BookOpen, ChevronRight, Eye, Flame, MessagesSquare, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ExerciseAnswer, GrammarRule, LessonContent, VerbConjugation, VocabularyWord, WordToken } from '@/lib/course'
import { ExerciseCard } from '@/components/lesson/ExerciseCard'
import { buildRemediationExercises } from '@/lib/exercises/remediation'
import { isExerciseAnswered, isExerciseCorrect } from '@/lib/exercises/grading'
import { RichText } from '@/components/RichText'
import { enrichTokens, isPunctuationToken, tokenizeFrench } from '@/lib/clickable-text'
import { CONJUGATION_TENSES, conjugationsForWord, isConjugableVerb } from '@/lib/french-conjugations'
import { isCanonicalChapterId } from '@/lib/course-catalog'
import { calculateLessonScore, didPassProve, PROVE_PASS_SCORE } from '@/lib/lesson-score'
import { createClient } from '@/utils/supabase/client'
import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { bumpLocalMistakeCount, enqueueLocalVocabulary } from '@/lib/local-vocab-vault'
import { markLocalChapterCompleted, mergeCompletedChapterIds, shouldCountDailyArticle } from '@/lib/local-progress'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import { PATHWAY_BY_CHAPTER_ID } from '@/lib/pathway/catalog'
import { lemmaIdsFromLesson, vocabularyRowsForLemmas } from '@/lib/review/lemmas-from-lesson'
import { isReviewablePartOfSpeech } from '@/lib/exercises/validate'
import type { LessonExercise } from '@/lib/exercises/types'

const DRAFT_KEY = (id: string) => `french-course:lesson-draft:${id}`

function lemmaIdFromExercise(exercise: LessonExercise): string | null {
  const candidates: string[] = []
  if ('answers' in exercise && Array.isArray(exercise.answers)) {
    candidates.push(...exercise.answers)
  }
  if ('verb' in exercise && typeof exercise.verb === 'string') {
    candidates.push(exercise.verb)
  }
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase().trim()
    const match = BUNDLED_VOCABULARY.find((word) => word.word.toLowerCase() === normalized)
    if (match && isReviewablePartOfSpeech(match.part_of_speech)) return match.id
  }
  return null
}

function siblingRemediationLinks(chapterId: string): Array<{ id: string; label: string }> {
  const hit = PATHWAY_BY_CHAPTER_ID.get(chapterId)
  if (!hit) return []
  const unit = hit.module.subchapters.filter((sub) => sub.unitIndex === hit.sub.unitIndex)
  return unit
    .filter((sub) => sub.role === 'B' || sub.role === 'C')
    .map((sub) => ({ id: sub.id, label: `${sub.roleLabel}: ${sub.title}` }))
}

type Stage = 'brief' | 'reading' | 'conversation' | 'exercise'

const STAGES: Stage[] = ['brief', 'reading', 'conversation', 'exercise']

function isStage(value: string | null | undefined): value is Stage {
  return Boolean(value && (STAGES as string[]).includes(value))
}

const REGISTER_LABEL: Record<string, string> = {
  Courant: 'Everyday',
  Soutenu: 'Formal',
  Familier: 'Casual',
  Argot: 'Slang',
}

function registerDisplay(register: string) {
  return REGISTER_LABEL[register] ?? register
}

export default function LessonClient({
  chapterId,
  title,
  content,
  vocabulary,
  conjugations,
  rules,
}: {
  chapterId: string
  title: string
  content: LessonContent
  vocabulary: VocabularyWord[]
  conjugations: VerbConjugation[]
  rules: GrammarRule[]
}) {
  const [stage, setStage] = useState<Stage>('brief')
  const [xRayEnabled, setXRayEnabled] = useState(false)
  const [activeWordId, setActiveWordId] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const dictAnchorRef = useRef<HTMLButtonElement | null>(null)
  const [dictPopupPos, setDictPopupPos] = useState<{ top: number; left: number } | null>(null)
  const [conjugationWord, setConjugationWord] = useState<VocabularyWord | null>(null)
  const [conjugationTense, setConjugationTense] = useState<string>('Présent')
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({})
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const exerciseSectionRef = useRef<HTMLElement>(null)
  const [remediationCategories, setRemediationCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gate, setGate] = useState<'loading' | 'ready' | 'login' | 'locked'>('loading')
  const router = useRouter()
  const hasConversation = Boolean(content.conversation?.lines.length)

  useEffect(() => {
    if (!activeWordId) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (popupRef.current?.contains(target)) return
      if (target instanceof Element && target.closest('[data-dict-word]')) return
      setActiveWordId(null)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveWordId(null)
        setConjugationWord(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [activeWordId])

  useLayoutEffect(() => {
    if (!activeWordId || !dictAnchorRef.current || !popupRef.current) {
      setDictPopupPos(null)
      return
    }
    const anchor = dictAnchorRef.current.getBoundingClientRect()
    const popup = popupRef.current
    const width = popup.offsetWidth || 288
    const height = popup.offsetHeight || 160
    const margin = 8
    let top = anchor.top - height - 12
    if (top < margin) top = anchor.bottom + 12
    let left = anchor.left + anchor.width / 2 - width / 2
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))
    setDictPopupPos({ top, left })
  }, [activeWordId])

  // Restore draft answers / stage (URL wins over draft when present)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const fromUrl = params.get('stage')
      if (isStage(fromUrl)) {
        if (fromUrl === 'conversation' && !hasConversation) setStage('exercise')
        else setStage(fromUrl)
      }
      const raw = sessionStorage.getItem(DRAFT_KEY(chapterId))
      if (!raw) return
      const parsed = JSON.parse(raw) as { stage?: Stage; answers?: Record<string, ExerciseAnswer>; exerciseIndex?: number }
      if (!isStage(fromUrl) && parsed.stage) setStage(parsed.stage)
      if (parsed.answers) setAnswers(parsed.answers)
      if (typeof parsed.exerciseIndex === 'number' && parsed.exerciseIndex >= 0) setExerciseIndex(parsed.exerciseIndex)
    } catch {
      // ignore corrupt draft
    }
  }, [chapterId, hasConversation])

  const goToStage = (next: Stage, historyMode: 'push' | 'replace' = 'push') => {
    let target = next
    if (target === 'conversation' && !hasConversation) target = 'exercise'
    setStage(target)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('stage', target)
      if (historyMode === 'replace') window.history.replaceState({ stage: target }, '', url.toString())
      else window.history.pushState({ stage: target }, '', url.toString())
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      const fromState = typeof event.state?.stage === 'string' ? event.state.stage : null
      const fromUrl = new URLSearchParams(window.location.search).get('stage')
      const next = isStage(fromState) ? fromState : isStage(fromUrl) ? fromUrl : null
      if (next) {
        setStage(next === 'conversation' && !hasConversation ? 'exercise' : next)
        return
      }
    }
    window.addEventListener('popstate', onPop)
    // Seed history so the first Back stays inside the lesson stages when possible.
    try {
      const url = new URL(window.location.href)
      if (!url.searchParams.get('stage')) {
        url.searchParams.set('stage', 'brief')
        window.history.replaceState({ stage: 'brief' }, '', url.toString())
      }
    } catch {
      // ignore
    }
    return () => window.removeEventListener('popstate', onPop)
  }, [hasConversation])

  // Persist draft while working
  useEffect(() => {
    if (gate !== 'ready') return
    try {
      sessionStorage.setItem(DRAFT_KEY(chapterId), JSON.stringify({ stage, answers, exerciseIndex }))
    } catch {
      // quota
    }
  }, [chapterId, stage, answers, exerciseIndex, gate])

  useEffect(() => {
    const dirty = Object.keys(answers).length > 0 && stage !== 'brief'
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [answers, stage])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) setGate('login')
        router.replace('/login/')
        return
      }

      const [{ data: progress }, { data: mistakes }] = await Promise.all([
        supabase.from('user_chapter_progress').select('chapter_id, status').eq('user_id', user.id),
        supabase.from('user_mistakes').select('grammar_category').eq('user_id', user.id).eq('is_resolved', false),
      ])

      if (!cancelled) {
        setRemediationCategories([
          ...new Set((mistakes ?? []).map((item) => item.grammar_category).filter((category): category is string => Boolean(category))),
        ])
      }

      const completed = mergeCompletedChapterIds(
        (progress ?? []).filter((item) => item.status === 'completed').map((item) => item.chapter_id),
      )
      const orderedAuthored = BUNDLED_CHAPTER_IDS.filter((id) => isCanonicalChapterId(id))
      const firstIncomplete = orderedAuthored.find((id) => !completed.has(id))
      const allowed = completed.has(chapterId) || firstIncomplete === chapterId || orderedAuthored.length === 0

      if (!allowed) {
        if (!cancelled) setGate('locked')
        router.replace('/')
        return
      }
      if (!cancelled) setGate('ready')
    })().catch(() => {
      if (!cancelled) setGate('login')
      router.replace('/login/')
    })
    return () => {
      cancelled = true
    }
  }, [chapterId, router])

  const dictVocabulary = useMemo(() => {
    const byId = new Map(BUNDLED_VOCABULARY.map((word) => [word.id, word]))
    for (const word of vocabulary) byId.set(word.id, word)
    return [...byId.values()]
  }, [vocabulary])
  const vocabularyById = useMemo(() => new Map(dictVocabulary.map((word) => [word.id, word])), [dictVocabulary])
  // Always enrich against the full client bank so id-collisions / thin props cannot drop surfaces.
  const readingParagraphs = useMemo(
    () =>
      content.reading?.map((paragraph) => ({
        ...paragraph,
        tokens: enrichTokens(paragraph.tokens, dictVocabulary),
      })) ?? [],
    [content.reading, dictVocabulary],
  )
  const conversationLines = useMemo(
    () =>
      content.conversation?.lines.map((line, index) => ({
        ...line,
        tokens: line.tokens?.length
          ? enrichTokens(line.tokens, dictVocabulary)
          : tokenizeFrench(line.text, `conv-${index}`, dictVocabulary),
      })) ?? [],
    [content.conversation, dictVocabulary],
  )
  const isProve = PATHWAY_BY_CHAPTER_ID.get(chapterId)?.sub.role === 'D'
  const baseExercises = useMemo(() => content.exercises ?? [], [content.exercises])
  const remediationExercises = useMemo(() => {
    if (isProve) return [] // Prove score must not include rem drills
    const remediation = buildRemediationExercises(remediationCategories)
    const existingIds = new Set(baseExercises.map((exercise) => exercise.id))
    return remediation.filter((exercise) => !existingIds.has(exercise.id))
  }, [baseExercises, remediationCategories, isProve])
  const exercises = useMemo(() => [...baseExercises, ...remediationExercises], [baseExercises, remediationExercises])
  const currentExercise = exercises[exerciseIndex]
  const currentExerciseAnswered = currentExercise
    ? isExerciseAnswered(currentExercise, answers[currentExercise.id])
    : false
  const answeredExerciseCount = exercises.filter((exercise) => isExerciseAnswered(exercise, answers[exercise.id])).length
  const scoringExercises = baseExercises
  const answeredAll =
    scoringExercises.length > 0 &&
    scoringExercises.every((exercise) => isExerciseAnswered(exercise, answers[exercise.id])) &&
    remediationExercises.every((exercise) => isExerciseAnswered(exercise, answers[exercise.id]))
  const liveScore = useMemo(() => calculateLessonScore(answers, scoringExercises), [answers, scoringExercises])
  const provePassed = !isProve || (answeredAll && didPassProve(liveScore))
  const progress = stage === 'brief' ? 20 : stage === 'reading' ? 45 : stage === 'conversation' ? 70 : answeredAll ? 100 : 90
  const remediateLinks = useMemo(() => siblingRemediationLinks(chapterId), [chapterId])

  useEffect(() => {
    if (exercises.length === 0) {
      if (exerciseIndex !== 0) setExerciseIndex(0)
      return
    }
    if (exerciseIndex >= exercises.length) setExerciseIndex(exercises.length - 1)
  }, [exerciseIndex, exercises.length])

  useEffect(() => {
    if (stage !== 'exercise') return
    exerciseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [exerciseIndex, stage])

  const syntaxClass = (token: WordToken) => {
    if (!xRayEnabled) return ''
    if (token.syntax === 'noun') return 'rounded-sm bg-syntax-noun/15 text-syntax-noun'
    if (token.syntax === 'verb') return 'rounded-sm bg-syntax-verb/15 text-syntax-verb'
    if (token.syntax === 'adj') return 'rounded-sm bg-syntax-adj/15 text-syntax-adj'
    return ''
  }

  const recordMistake = async (category: string, context: string, vocabId?: string | null) => {
    // Always bump local/remote vocab miss counts when we can resolve a lemma.
    if (vocabId) {
      bumpLocalMistakeCount(vocabId)
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: progress } = await supabase
            .from('user_vocab_progress')
            .select('mistake_count')
            .eq('user_id', user.id)
            .eq('vocab_id', vocabId)
            .maybeSingle()
          if (progress) {
            await supabase
              .from('user_vocab_progress')
              .update({ mistake_count: (progress.mistake_count ?? 0) + 1 })
              .eq('user_id', user.id)
              .eq('vocab_id', vocabId)
          }
        }
      } catch {
        // Local vault already bumped.
      }
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: existing } = await supabase
        .from('user_mistakes')
        .select('id, error_count')
        .eq('user_id', user.id)
        .eq('grammar_category', category)
        .eq('is_resolved', false)
        .is('vocab_id', null)
        .maybeSingle()
      if (existing) {
        await supabase
          .from('user_mistakes')
          .update({ error_count: existing.error_count + 1, last_error_at: new Date().toISOString(), error_context: context })
          .eq('id', existing.id)
        return
      }
      await supabase.from('user_mistakes').insert({
        user_id: user.id,
        grammar_category: category,
        error_context: context,
        vocab_id: vocabId ?? null,
      })
    } catch {
      // Review logging is best-effort; do not block answering.
    }
  }

  const needsSpaceBefore = (tokens: WordToken[], index: number) => {
    if (index === 0) return false
    const current = tokens[index].text
    const previous = tokens[index - 1].text
    // French guillemets take a space on the outside/inside: « bonjour »
    if (current === '«' || current === '»') return true
    // Other closing punctuation clings to the previous word.
    if (isPunctuationToken(current)) return false
    // After opening guillemet: space before the quoted word.
    if (previous === '«') return true
    // After any other punctuation: space before the next word.
    if (isPunctuationToken(previous)) return true
    // Between two words.
    return true
  }

  const renderTokens = (tokens: WordToken[]) => (
    <p className="text-body-reading leading-relaxed select-none [-webkit-user-select:none] [-webkit-touch-callout:none]">
      {tokens.map((token, index) => {
        const isWord = /[A-Za-zÀ-ÿŒœÆæ]/.test(token.text) && !isPunctuationToken(token.text)
        const word =
          (token.lemmaId ? vocabularyById.get(token.lemmaId) : undefined) ??
          (isWord
            ? ({
                id: `missing:${token.text.normalize('NFC').toLowerCase()}`,
                word: token.text,
                base_translation: 'Not in the dictionary yet — tap reported for fix.',
                meanings: ['Not in the dictionary yet'],
                part_of_speech: 'unknown',
                gender: null,
                register: 'Courant',
                ipa_pronunciation: null,
                is_idiom: false,
                is_slang: false,
                idiom_explanation: null,
              } satisfies VocabularyWord)
            : undefined)
        const active = token.id === activeWordId
        const spaceBefore = needsSpaceBefore(tokens, index)
        const meanings = word?.meanings?.length
          ? word.meanings
          : word?.base_translation
            ? word.base_translation.split(';').map((part) => part.trim()).filter(Boolean)
            : []
        const showConjugate = word && word.part_of_speech !== 'unknown' ? isConjugableVerb(word) : false
        const known = Boolean(token.lemmaId && vocabularyById.get(token.lemmaId))
        const clickableClass = showConjugate
          ? 'cursor-pointer rounded px-0.5 text-left hover:bg-syntax-verb/10'
          : known
            ? 'cursor-pointer rounded px-0.5 text-left hover:bg-surface-container-high'
            : 'cursor-pointer rounded px-0.5 text-left underline decoration-dotted decoration-on-surface-variant/40 hover:bg-surface-container-high'
        return (
          <span key={token.id} className="relative inline">
            {spaceBefore ? ' ' : null}
            {word ? (
              <button
                type="button"
                data-dict-word
                ref={active ? dictAnchorRef : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  dictAnchorRef.current = event.currentTarget
                  setActiveWordId(active ? null : token.id)
                }}
                onContextMenu={(event) => event.preventDefault()}
                className={`transition-colors select-none [-webkit-user-select:none] ${clickableClass} ${syntaxClass(token)} ${active ? 'bg-surface-container-high' : ''}`}
              >
                {token.text}
              </button>
            ) : (
              <span className={syntaxClass(token)}>{token.text}</span>
            )}
            {active && word && (
              <div
                ref={popupRef}
                role="dialog"
                aria-label={`${word.word} definition`}
                onPointerDown={(event) => event.stopPropagation()}
                className="fixed z-50 w-72 rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-4 text-left shadow-lg"
                style={
                  dictPopupPos
                    ? { top: dictPopupPos.top, left: dictPopupPos.left }
                    : { top: 0, left: 0, visibility: 'hidden' }
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{word.word}</p>
                    {word.part_of_speech && word.part_of_speech !== 'unknown' && (
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                        {word.part_of_speech}
                        {showConjugate ? ' · conjugable' : ''}
                      </p>
                    )}
                    {word.ipa_pronunciation && <p className="mt-1 text-xs text-ink-medium">/{word.ipa_pronunciation}/</p>}
                  </div>
                  {word.part_of_speech !== 'unknown' && (
                    <span
                      title={`Register: ${word.register} — how formal the word sounds`}
                      className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-on-primary"
                    >
                      {registerDisplay(word.register)}
                    </span>
                  )}
                </div>
                {meanings.length > 1 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-on-surface-variant">
                    {meanings.map((meaning) => (
                      <li key={meaning}>{meaning}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-on-surface-variant">{meanings[0] ?? word.base_translation}</p>
                )}
                {word.example && word.part_of_speech !== 'unknown' && (
                  <div className="mt-3 rounded-lg bg-surface-container-low p-3 text-sm">
                    <p className="font-medium">{word.example.french}</p>
                    <p className="mt-1 text-on-surface-variant">{word.example.english}</p>
                  </div>
                )}
                {word.idiom_explanation && <p className="mt-2 text-xs italic text-on-surface-variant">{word.idiom_explanation}</p>}
                {showConjugate && (
                  <button
                    type="button"
                    onClick={() => {
                      setConjugationTense('Présent')
                      setConjugationWord(word)
                    }}
                    className="tactile-button mt-4 w-full rounded-lg border-primary-container bg-primary py-2 text-label-caps text-on-primary"
                  >
                    CONJUGATE
                  </button>
                )}
              </div>
            )}
          </span>
        )
      })}
    </p>
  )

  const enqueueLessonVocabulary = async (_userId: string) => {
    // Reviewable lemmas only — never enqueue proper nouns / plot names.
    const lemmaIds = lemmaIdsFromLesson(content)
    if (!lemmaIds.length) return

    // Always seed the local infinite loop first — remote FK/RLS must not leave Review empty.
    enqueueLocalVocabulary(lemmaIds)

    try {
      const supabase = createClient()
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

      if (rpcError) {
        // Fallback when RPC is not applied yet: best-effort direct writes.
        if (rows.length) await supabase.from('vocabulary').upsert(rows, { onConflict: 'id' })
        await supabase.from('user_vocab_progress').upsert(
          lemmaIds.map((vocab_id) => ({
            user_id: _userId,
            vocab_id,
            next_review_at: new Date().toISOString(),
            last_reviewed_at: null,
          })),
          { onConflict: 'user_id,vocab_id', ignoreDuplicates: true },
        )
      }
    } catch {
      // Local vault already seeded above.
    }
  }

  const wordsReadInLesson = useMemo(() => {
    if (content.wordCount && content.wordCount > 0) return content.wordCount
    const readingWords = readingParagraphs.reduce(
      (sum, paragraph) => sum + paragraph.tokens.filter((token) => !isPunctuationToken(token.text)).length,
      0,
    )
    const dialogueWords = conversationLines.reduce(
      (sum, line) => sum + line.tokens.filter((token) => !isPunctuationToken(token.text)).length,
      0,
    )
    return readingWords + dialogueWords
  }, [content.wordCount, readingParagraphs, conversationLines])

  const localDateString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const recordDailyReading = async (userId: string, words: number) => {
    if (words <= 0) return
    const countArticle = shouldCountDailyArticle(chapterId)
    try {
      const supabase = createClient()
      const today = localDateString()
      const { data: existing } = await supabase
        .from('user_daily_reading_stats')
        .select('words_read, articles_completed')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle()
      if (existing) {
        await supabase
          .from('user_daily_reading_stats')
          .update({
            words_read: (existing.words_read ?? 0) + words,
            articles_completed: (existing.articles_completed ?? 0) + (countArticle ? 1 : 0),
          })
          .eq('user_id', userId)
          .eq('date', today)
        return
      }
      await supabase.from('user_daily_reading_stats').insert({
        user_id: userId,
        date: today,
        words_read: words,
        articles_completed: countArticle ? 1 : 0,
      })
    } catch {
      // Daily reading stats are best-effort.
    }
  }

  const completeLesson = async () => {
    if (loading) return
    if (!answeredAll) return
    if (isProve && !didPassProve(liveScore)) {
      setError(
        `Prove needs ${PROVE_PASS_SCORE}%+. You scored ${liveScore}%. Open Apply/Integrate below, then retry Prove.`,
      )
      return
    }
    setLoading(true)
    setError(null)
    const grammarResults = scoringExercises.map((exercise) => ({
      category: exercise.category,
      correct: isExerciseCorrect(exercise, answers[exercise.id]),
      context: `Lesson exercise: ${exercise.prompt}`,
    }))
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Please sign in again.')

      const score = calculateLessonScore(answers, scoringExercises)
      const wordsRead = wordsReadInLesson
      const pathway = PATHWAY_BY_CHAPTER_ID.get(chapterId)
      if (pathway) {
        await supabase.rpc('ensure_chapter_row', {
          p_chapter_id: chapterId,
          p_module_id: pathway.module.id,
          p_title: pathway.sub.title,
          p_description: pathway.sub.description,
          p_order_index: pathway.sub.orderIndex,
          p_module_title: pathway.module.title,
          p_module_description: pathway.module.description,
          p_cefr: pathway.module.cefr,
          p_module_order: pathway.module.orderIndex,
        })
      }

      const { error: rpcError } = await supabase.rpc('complete_chapter', {
        p_chapter_id: chapterId,
        p_score: score,
        p_words_read: 0,
        p_grammar_results: grammarResults,
      })

      if (rpcError) {
        const { error: progressError } = await supabase.from('user_chapter_progress').upsert({
          user_id: user.id,
          chapter_id: chapterId,
          status: 'completed',
          score,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,chapter_id' })
        if (progressError) {
          throw new Error('We could not save this lesson. Check your connection and try again.')
        }

        await Promise.all(
          scoringExercises
            .filter((exercise) => !isExerciseCorrect(exercise, answers[exercise.id]))
            .map((exercise) =>
              recordMistake(exercise.category, `Lesson exercise: ${exercise.prompt}`, lemmaIdFromExercise(exercise)),
            ),
        )
      }

      await enqueueLessonVocabulary(user.id)
      await recordDailyReading(user.id, wordsRead)

      // Resolve open mistake categories that were answered correctly this lesson.
      const correctCats = [
        ...new Set(
          scoringExercises
            .filter((exercise) => isExerciseCorrect(exercise, answers[exercise.id]))
            .map((exercise) => exercise.category),
        ),
      ]
      if (correctCats.length) {
        await supabase
          .from('user_mistakes')
          .update({ is_resolved: true })
          .eq('user_id', user.id)
          .eq('is_resolved', false)
          .in('grammar_category', correctCats)
      }

      // Only unlock locally after remote (or fallback) progress actually saved.
      markLocalChapterCompleted(chapterId)
      try {
        sessionStorage.removeItem(DRAFT_KEY(chapterId))
      } catch {
        // ignore
      }

      router.push('/')
      router.refresh()
    } catch (caughtError) {
      // Do NOT mark local complete on auth/pre-save failure.
      setError(caughtError instanceof Error ? caughtError.message : 'We could not save this lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (gate !== 'ready') {
    return (
      <main className="mx-auto flex min-h-screen max-w-[680px] items-center justify-center p-6">
        <p className="text-on-surface-variant">
          {gate === 'locked' ? 'This lesson is not unlocked yet.' : gate === 'login' ? 'Redirecting to sign in…' : 'Loading lesson…'}
        </p>
      </main>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[680px] flex-col">
      <header className="sticky top-0 z-40 flex items-center justify-between bg-surface-container-lowest p-4 pt-safe">
        <Link
          href="/"
          aria-label="Leave lesson"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low"
          onClick={(event) => {
            if (Object.keys(answers).length === 0) return
            if (!window.confirm('Leave this lesson? Your answers are saved on this device until you finish or clear them.')) {
              event.preventDefault()
            }
          }}
        >
          <X className="size-6" />
        </Link>
        <div className="mx-4 flex-1"><div className="h-3 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} /></div></div>
        <div className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1"><Flame className="size-4 fill-warning/20 text-warning" /><span className="text-sm font-bold">Lesson</span></div>
      </header>

      <main className="flex-1 p-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <p className="text-label-caps text-primary">{isProve ? 'PROVE GATE · NO HINTS' : 'MODULE LESSON'}</p>
        <h1 className="mt-1 text-headline-md">{title}</h1>

        {stage === 'brief' && content.brief && (
          <section className="mt-8 flex flex-col gap-5">
            <div className="tactile-card p-6">
              <div className="flex items-center gap-2 text-primary"><BookOpen className="size-5" /><p className="text-label-caps">THEORY FIRST</p></div>
              <h2 className="mt-3 text-headline-md">{content.brief.title}</h2>
              <RichText text={content.brief.body} className="mt-4 text-body-reading text-on-surface-variant" />
            </div>
            {rules.length > 0 && (
              <div>
                <p className="text-label-caps text-on-surface-variant">RELATED RULES</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {rules.map((rule) => (
                    <Link key={rule.id} href={`/rules/${rule.slug}/`} className="rounded-full border-2 border-primary-fixed-dim bg-primary-fixed/30 px-3 py-2 text-sm font-bold text-primary">
                      {rule.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <button type="button" onClick={() => goToStage('reading')} className="tactile-button mt-2 flex items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary">
              START READING <ChevronRight className="size-5" />
            </button>
          </section>
        )}

        {stage === 'reading' && (
          <section className="mt-8">
            <div className="relative rounded-xl border-2 border-surface-variant border-b-4 bg-reading-bg p-6">
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <Eye className="size-4 text-on-surface-variant" />
                <span className="text-label-caps text-on-surface-variant">X-RAY</span>
                <button type="button" aria-pressed={xRayEnabled} aria-label="Toggle X-Ray syntax annotations" onClick={() => setXRayEnabled((value) => !value)} className={`relative h-6 w-11 rounded-full p-1 ${xRayEnabled ? 'bg-success' : 'bg-surface-dim'}`}>
                  <span className={`block size-4 rounded-full bg-white transition-transform ${xRayEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <p className="mb-4 pr-28 text-sm text-on-surface-variant">Tap any word for meaning. Verbs include a <span className="font-semibold text-primary">Conjugate</span> button. Turn on X-Ray to color nouns/pronouns, verbs, and other words.</p>
              <div className="mt-2 space-y-6">
                {(() => {
                  const blocks: ReactNode[] = []
                  let listBuffer: { tokens: WordToken[]; key: number }[] = []
                  const flushList = () => {
                    if (!listBuffer.length) return
                    blocks.push(
                      <ul key={`list-${listBuffer[0].key}`} className="list-disc space-y-2 pl-6">
                        {listBuffer.map((item) => (
                          <li key={item.key} className="marker:text-primary">{renderTokens(item.tokens)}</li>
                        ))}
                      </ul>,
                    )
                    listBuffer = []
                  }
                  readingParagraphs.forEach((paragraph, index) => {
                    if (paragraph.listItem) {
                      listBuffer.push({ tokens: paragraph.tokens, key: index })
                      return
                    }
                    flushList()
                    blocks.push(<div key={index}>{renderTokens(paragraph.tokens)}</div>)
                  })
                  flushList()
                  return blocks
                })()}
              </div>
              {xRayEnabled && (
                <div className="mt-8 flex flex-wrap gap-4 border-t border-surface-variant pt-4 text-syntax-label text-on-surface-variant">
                  <span><i className="mr-1 inline-block size-3 rounded-full bg-syntax-noun" />Noun / pronoun</span>
                  <span><i className="mr-1 inline-block size-3 rounded-full bg-syntax-verb" />Verb</span>
                  <span><i className="mr-1 inline-block size-3 rounded-full bg-syntax-adj" />Adj / other</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => goToStage('brief')} className="tactile-button flex-1 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
                BACK
              </button>
              <button
                type="button"
                onClick={() => goToStage(hasConversation ? 'conversation' : 'exercise')}
                className="tactile-button flex-[2] flex items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary"
              >
                {hasConversation ? 'OPEN CONVERSATION' : 'PRACTICE THE RULES'} <ChevronRight className="size-5" />
              </button>
            </div>
          </section>
        )}

        {stage === 'conversation' && content.conversation && (
          <section className="mt-8 space-y-5">
            <div className="tactile-card p-5">
              <div className="flex items-center gap-2 text-primary"><MessagesSquare className="size-5" /><p className="text-label-caps">ROUTINE SPEECH</p></div>
              <h2 className="mt-3 text-headline-md">{content.conversation.title}</h2>
              <p className="mt-2 text-sm text-on-surface-variant">{content.conversation.setting}</p>
            </div>
            <div className="space-y-3">
              {conversationLines.map((line, index) => (
                <article key={`${line.speaker}-${index}`} className={`rounded-xl border-2 border-surface-variant p-4 ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-primary-fixed/20'}`}>
                  <p className="text-label-caps text-primary">{line.speaker}</p>
                  <div className="mt-2">{renderTokens(line.tokens)}</div>
                </article>
              ))}
            </div>
            <p className="text-sm text-on-surface-variant">Dialogue words are tappable too — try a verb for Conjugate.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => goToStage('reading')} className="tactile-button flex-1 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
                BACK
              </button>
              <button
                type="button"
                onClick={() => goToStage('exercise')}
                className="tactile-button flex-[2] flex items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary"
              >
                PRACTICE THE RULES <ChevronRight className="size-5" />
              </button>
            </div>
          </section>
        )}

        {stage === 'exercise' && (
          <section ref={exerciseSectionRef} className="mt-8 space-y-5">
            <p className="text-body-reading text-on-surface-variant">
              {isProve
                ? `Prove gate: no hints. Score at least ${PROVE_PASS_SCORE}% to pass. Fail → remediate Apply/Integrate, then retry.`
                : 'Mixed drills: multiple choice, fill-in, matching, word order, and more. Answer each once — wrong answers feed Review.'}
            </p>
            {exercises.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-surface-variant bg-surface-container-low p-4">
                <div>
                  <p className="text-label-caps text-primary">
                    Question {exerciseIndex + 1} of {exercises.length}
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {answeredExerciseCount} of {exercises.length} answered
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={exerciseIndex === 0}
                    onClick={() => setExerciseIndex((index) => Math.max(0, index - 1))}
                    className="tactile-button rounded-lg border-2 border-surface-variant bg-surface-container-lowest px-4 py-2 text-sm font-bold text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={exerciseIndex >= exercises.length - 1 || !currentExerciseAnswered}
                    onClick={() => setExerciseIndex((index) => Math.min(exercises.length - 1, index + 1))}
                    className="tactile-button rounded-lg border-2 border-surface-variant bg-surface-container-lowest px-4 py-2 text-sm font-bold text-on-surface disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {isProve && answeredAll && (
              <div className={`space-y-2 rounded-lg p-3 text-sm ${provePassed ? 'bg-success/15 text-tertiary' : 'bg-error-container text-on-error-container'}`}>
                <p>Score {liveScore}% {provePassed ? '· pass' : `· need ${PROVE_PASS_SCORE}%+`}</p>
                {!provePassed && remediateLinks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">Remediate, then retry Prove:</p>
                    {remediateLinks.map((link) => (
                      <Link key={link.id} href={`/lesson/${link.id}/`} className="underline font-bold text-primary">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            {currentExercise && (
              <ExerciseCard
                key={currentExercise.id}
                exercise={currentExercise}
                index={exerciseIndex}
                total={exercises.length}
                answer={answers[currentExercise.id]}
                allowHints={!isProve}
                onAnswer={(value) => setAnswers((current) => ({ ...current, [currentExercise.id]: value }))}
                onMistake={() =>
                  void recordMistake(
                    currentExercise.category,
                    `Lesson exercise: ${currentExercise.prompt}`,
                    lemmaIdFromExercise(currentExercise),
                  )
                }
                onRetry={() =>
                  setAnswers((current) => {
                    const next = { ...current }
                    delete next[currentExercise.id]
                    return next
                  })
                }
              />
            )}
            {error && <p role="alert" className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => goToStage(hasConversation ? 'conversation' : 'reading')} className="tactile-button flex-1 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
                BACK
              </button>
              <button
                type="button"
                disabled={!answeredAll || loading || (isProve && !provePassed)}
                onClick={completeLesson}
                className="tactile-button flex-[2] rounded-xl border-[#46a302] bg-success py-4 font-bold text-[#0b3d0b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'SAVING…' : isProve ? 'PASS PROVE' : 'COMPLETE LESSON'}
              </button>
            </div>
          </section>
        )}
      </main>

      {conjugationWord && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${conjugationWord.word} conjugations`}
          className="fixed inset-0 z-50 flex items-end bg-black/30 p-4 sm:items-center sm:justify-center"
          onClick={() => setConjugationWord(null)}
        >
          <section
            className="flex max-h-[85vh] w-full max-w-md flex-col rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-label-caps text-primary">VERB ENGINE</p>
                <h2 className="text-headline-md">{conjugationWord.word}</h2>
                <p className="mt-1 text-on-surface-variant">{conjugationWord.base_translation}</p>
              </div>
              <button type="button" onClick={() => setConjugationWord(null)} aria-label="Close conjugations" className="rounded-lg p-1 hover:bg-surface-container-low"><X /></button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {CONJUGATION_TENSES.map((tense) => (
                <button
                  key={tense}
                  type="button"
                  onClick={() => setConjugationTense(tense)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${conjugationTense === tense ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}
                >
                  {tense}
                </button>
              ))}
            </div>
            <div className="mt-4 flex-1 divide-y divide-surface-variant overflow-y-auto">
              {conjugationsForWord(conjugationWord, conjugations)
                .filter((conjugation) => conjugation.tense === conjugationTense)
                .map((conjugation) => (
                  <div key={conjugation.id} className="flex justify-between gap-3 py-2 text-body-ui">
                    <span className="text-on-surface-variant">{conjugation.pronoun}</span>
                    <strong className="text-right">{conjugation.form}</strong>
                  </div>
                ))}
            </div>
            {conjugationTense === 'Passé composé' && (
              <p className="mt-3 text-xs text-on-surface-variant">Participe passé shown in masculine singular; with *être*, agree with the subject in gender/number.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

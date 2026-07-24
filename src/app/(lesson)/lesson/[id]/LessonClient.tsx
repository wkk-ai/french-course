'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BookOpen, ChevronRight, Eye, Flame, MessagesSquare, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { GrammarRule, LessonContent, VerbConjugation, VocabularyWord, WordToken } from '@/lib/course'
import { RichText } from '@/components/RichText'
import { isCanonicalChapterId } from '@/lib/course-catalog'
import { calculateLessonScore } from '@/lib/lesson-score'
import { resolveLessonContent } from '@/lib/lesson-content'
import { createClient } from '@/utils/supabase/client'

type Stage = 'brief' | 'reading' | 'conversation' | 'exercise'

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
  const [conjugationWord, setConjugationWord] = useState<VocabularyWord | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gate, setGate] = useState<'loading' | 'ready' | 'login' | 'locked'>('loading')
  const router = useRouter()
  const hasConversation = Boolean(content.conversation?.lines.length)

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

      const [{ data: progress }, { data: authored }] = await Promise.all([
        supabase.from('user_chapter_progress').select('chapter_id, status').eq('user_id', user.id),
        supabase.from('chapters').select('id, lesson_content, order_index, module:modules(order_index)'),
      ])

      const orderedAuthored = (authored ?? [])
        .filter((item) => isCanonicalChapterId(item.id) && resolveLessonContent(item.id, item.lesson_content))
        .sort((left, right) => {
          const leftModule = Array.isArray(left.module) ? left.module[0] : left.module
          const rightModule = Array.isArray(right.module) ? right.module[0] : right.module
          return (leftModule?.order_index ?? 0) - (rightModule?.order_index ?? 0) || left.order_index - right.order_index
        })

      const completed = new Set((progress ?? []).filter((item) => item.status === 'completed').map((item) => item.chapter_id))
      const firstIncomplete = orderedAuthored.find((item) => !completed.has(item.id))?.id
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

  const vocabularyById = useMemo(() => new Map(vocabulary.map((word) => [word.id, word])), [vocabulary])
  const exercises = content.exercises ?? []
  const answeredAll = exercises.length > 0 && exercises.every((exercise) => answers[exercise.id] !== undefined)
  const progress = stage === 'brief' ? 20 : stage === 'reading' ? 45 : stage === 'conversation' ? 70 : 90

  const syntaxClass = (token: WordToken) => {
    if (!xRayEnabled) return ''
    if (token.syntax === 'noun') return 'bg-syntax-noun/10 border-b-2 border-syntax-noun'
    if (token.syntax === 'verb') return 'bg-syntax-verb/10 border-b-2 border-syntax-verb'
    if (token.syntax === 'adj') return 'bg-syntax-adj/10 border-b-2 border-syntax-adj'
    return ''
  }

  const renderTokens = (tokens: WordToken[]) => (
    <p className="flex flex-wrap gap-x-1.5 gap-y-3 text-body-reading">
      {tokens.map((token) => {
        const word = token.lemmaId ? vocabularyById.get(token.lemmaId) : undefined
        const active = token.id === activeWordId
        return (
          <span key={token.id} className="relative inline-block">
            {word ? (
              <button type="button" onClick={() => setActiveWordId(active ? null : token.id)} className={`rounded px-0.5 text-left transition-colors ${syntaxClass(token)} ${active ? 'bg-surface-container-high' : ''}`}>
                {token.text}
              </button>
            ) : (
              <span className={syntaxClass(token)}>{token.text}</span>
            )}
            {active && word && (
              <div className="absolute bottom-full left-1/2 z-30 mb-3 w-64 -translate-x-1/2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-4 shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{word.word}</p>
                    {word.ipa_pronunciation && <p className="mt-1 text-xs text-ink-medium">/{word.ipa_pronunciation}/</p>}
                  </div>
                  <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-on-primary">{word.register}</span>
                </div>
                <p className="mt-3 text-sm text-on-surface-variant">{word.base_translation}</p>
                {conjugations.some((conjugation) => conjugation.vocab_id === word.id) && (
                  <button type="button" onClick={() => setConjugationWord(word)} className="tactile-button mt-4 w-full rounded-lg border-primary-container bg-primary py-2 text-label-caps text-on-primary">
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

  const completeLesson = async () => {
    if (!answeredAll) return
    setLoading(true)
    setError(null)
    const grammarResults = exercises.map((exercise) => ({
      category: exercise.category,
      correct: answers[exercise.id] === exercise.answer,
    }))
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Please sign in again.')

      const score = calculateLessonScore(answers, Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise.answer])))
      const { error: rpcError } = await supabase.rpc('complete_chapter', {
        p_chapter_id: chapterId,
        p_score: score,
        p_words_read: content.wordCount ?? 0,
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
        if (progressError) throw rpcError
      }

      router.push('/')
      router.refresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'We could not save this lesson. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (gate !== 'ready') {
    return (
      <main className="mx-auto flex min-h-screen max-w-[680px] items-center justify-center p-6">
        <p className="text-on-surface-variant">{gate === 'locked' ? 'This lesson is not unlocked yet.' : 'Loading lesson…'}</p>
      </main>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[680px] flex-col">
      <header className="flex items-center justify-between p-4">
        <Link href="/" aria-label="Leave lesson" className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low"><X className="size-6" /></Link>
        <div className="mx-4 flex-1"><div className="h-3 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${progress}%` }} /></div></div>
        <div className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1"><Flame className="size-4 fill-warning/20 text-warning" /><span className="text-sm font-bold">Lesson</span></div>
      </header>

      <main className="flex-1 p-4 pb-28">
        <p className="text-label-caps text-primary">MODULE LESSON</p>
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
            <button type="button" onClick={() => setStage('reading')} className="tactile-button mt-2 flex items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary">
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
              <div className="mt-10 space-y-6">
                {content.reading?.map((paragraph, index) => (
                  <div key={index}>{renderTokens(paragraph.tokens)}</div>
                ))}
              </div>
              {xRayEnabled && (
                <div className="mt-8 flex flex-wrap gap-4 border-t border-surface-variant pt-4 text-syntax-label text-on-surface-variant">
                  <span><i className="mr-1 inline-block size-3 rounded-full bg-syntax-noun" />Noun / article</span>
                  <span><i className="mr-1 inline-block size-3 rounded-full bg-syntax-verb" />Verb</span>
                  <span><i className="mr-1 inline-block size-3 rounded-full bg-syntax-adj" />Adjective</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStage('brief')} className="tactile-button flex-1 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
                BACK
              </button>
              <button
                type="button"
                onClick={() => setStage(hasConversation ? 'conversation' : 'exercise')}
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
              {content.conversation.lines.map((line, index) => (
                <article key={`${line.speaker}-${index}`} className={`rounded-xl border-2 border-surface-variant p-4 ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-primary-fixed/20'}`}>
                  <p className="text-label-caps text-primary">{line.speaker}</p>
                  {line.tokens?.length ? <div className="mt-2">{renderTokens(line.tokens)}</div> : <p className="mt-2 text-body-reading">{line.text}</p>}
                </article>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStage('reading')} className="tactile-button flex-1 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
                BACK
              </button>
              <button type="button" onClick={() => setStage('exercise')} className="tactile-button flex-[2] flex items-center justify-center gap-2 rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary">
                PRACTICE THE RULES <ChevronRight className="size-5" />
              </button>
            </div>
          </section>
        )}

        {stage === 'exercise' && (
          <section className="mt-8 space-y-5">
            <p className="text-body-reading text-on-surface-variant">Answer each question once. If you miss it, the correct option is shown.</p>
            {exercises.map((exercise, exerciseIndex) => {
              const selected = answers[exercise.id]
              const locked = selected !== undefined
              const correct = selected === exercise.answer
              return (
                <article key={exercise.id} className="tactile-card p-5">
                  <p className="text-label-caps text-primary">QUESTION {exerciseIndex + 1} OF {exercises.length}</p>
                  <h2 className="mt-2 text-body-ui font-bold">{exercise.prompt}</h2>
                  <div className="mt-4 grid gap-2">
                    {exercise.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex
                      const isCorrectOption = optionIndex === exercise.answer
                      let classes = 'border-surface-variant'
                      if (locked && isCorrectOption) classes = 'border-success bg-success/10 text-tertiary'
                      else if (locked && isSelected && !correct) classes = 'border-error bg-error-container/40 text-on-error-container'
                      else if (!locked) classes = 'border-surface-variant hover:bg-surface-container-low'
                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={locked}
                          onClick={() => {
                            if (locked) return
                            setAnswers((current) => ({ ...current, [exercise.id]: optionIndex }))
                          }}
                          className={`rounded-lg border-2 p-3 text-left text-sm font-semibold disabled:cursor-default ${classes}`}
                        >
                          {option}
                          {locked && isCorrectOption ? ' ✓' : ''}
                          {locked && isSelected && !correct ? ' ✗' : ''}
                        </button>
                      )
                    })}
                  </div>
                  {locked && (
                    <p className={`mt-4 text-sm ${correct ? 'text-tertiary' : 'text-secondary'}`}>
                      {correct ? 'Correct. ' : `Not quite — the answer is “${exercise.options[exercise.answer]}”. `}
                      {exercise.explanation}
                    </p>
                  )}
                </article>
              )
            })}
            {error && <p role="alert" className="rounded-lg bg-error-container p-3 text-sm text-on-error-container">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStage(hasConversation ? 'conversation' : 'reading')} className="tactile-button flex-1 rounded-xl border-2 border-surface-variant bg-surface-container-lowest py-4 font-bold text-on-surface">
                BACK
              </button>
              <button
                type="button"
                disabled={!answeredAll || loading}
                onClick={completeLesson}
                className="tactile-button flex-[2] rounded-xl border-[#46a302] bg-success py-4 font-bold text-on-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'SAVING…' : 'COMPLETE LESSON'}
              </button>
            </div>
          </section>
        )}
      </main>

      {conjugationWord && (
        <div role="dialog" aria-modal="true" aria-label={`${conjugationWord.word} conjugations`} className="fixed inset-0 z-50 flex items-end bg-black/30 p-4 sm:items-center sm:justify-center">
          <section className="w-full max-w-md rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-label-caps text-primary">VERB ENGINE</p>
                <h2 className="text-headline-md">{conjugationWord.word}</h2>
              </div>
              <button type="button" onClick={() => setConjugationWord(null)} aria-label="Close conjugations" className="rounded-lg p-1 hover:bg-surface-container-low"><X /></button>
            </div>
            <p className="mt-1 text-on-surface-variant">{conjugationWord.base_translation}</p>
            <div className="mt-5 divide-y divide-surface-variant">
              {conjugations.filter((conjugation) => conjugation.vocab_id === conjugationWord.id).map((conjugation) => (
                <div key={conjugation.id} className="flex justify-between py-2 text-body-ui">
                  <span className="text-on-surface-variant">{conjugation.pronoun}</span>
                  <strong>{conjugation.form}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

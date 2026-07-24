'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { BookOpen, ChevronRight, Eye, Flame, MessagesSquare, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ExerciseAnswer, GrammarRule, LessonContent, VerbConjugation, VocabularyWord, WordToken } from '@/lib/course'
import { ExerciseCard } from '@/components/lesson/ExerciseCard'
import { buildRemediationExercises } from '@/lib/exercises/enrich'
import { isExerciseAnswered, isExerciseCorrect } from '@/lib/exercises/grading'
import { RichText } from '@/components/RichText'
import { enrichTokens, isPunctuationToken, tokenizeFrench } from '@/lib/clickable-text'
import { CONJUGATION_TENSES, conjugationsForWord, isConjugableVerb } from '@/lib/french-conjugations'
import { isCanonicalChapterId } from '@/lib/course-catalog'
import { calculateLessonScore } from '@/lib/lesson-score'
import { resolveLessonContent } from '@/lib/lesson-content'
import { createClient } from '@/utils/supabase/client'
import { enqueueLocalVocabulary, staggerReviewDates } from '@/lib/local-vocab-vault'

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
  const [conjugationTense, setConjugationTense] = useState<string>('Présent')
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({})
  const [remediationCategories, setRemediationCategories] = useState<string[]>([])
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

      const [{ data: progress }, { data: authored }, { data: mistakes }] = await Promise.all([
        supabase.from('user_chapter_progress').select('chapter_id, status').eq('user_id', user.id),
        supabase.from('chapters').select('id, lesson_content, order_index, module:modules(order_index)'),
        supabase.from('user_mistakes').select('grammar_category').eq('user_id', user.id).eq('is_resolved', false),
      ])

      if (!cancelled) {
        setRemediationCategories([
          ...new Set((mistakes ?? []).map((item) => item.grammar_category).filter((category): category is string => Boolean(category))),
        ])
      }

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
  const readingParagraphs = useMemo(
    () =>
      content.reading?.map((paragraph) => ({
        ...paragraph,
        tokens: enrichTokens(paragraph.tokens, vocabulary),
      })) ?? [],
    [content.reading, vocabulary],
  )
  const conversationLines = useMemo(
    () =>
      content.conversation?.lines.map((line, index) => ({
        ...line,
        tokens: line.tokens?.length
          ? enrichTokens(line.tokens, vocabulary)
          : tokenizeFrench(line.text, `conv-${index}`, vocabulary),
      })) ?? [],
    [content.conversation, vocabulary],
  )
  const exercises = useMemo(() => {
    const base = content.exercises ?? []
    const remediation = buildRemediationExercises(remediationCategories)
    const existingIds = new Set(base.map((exercise) => exercise.id))
    return [...base, ...remediation.filter((exercise) => !existingIds.has(exercise.id))]
  }, [content.exercises, remediationCategories])
  const answeredAll = exercises.length > 0 && exercises.every((exercise) => isExerciseAnswered(exercise, answers[exercise.id]))
  const progress = stage === 'brief' ? 20 : stage === 'reading' ? 45 : stage === 'conversation' ? 70 : 90

  const syntaxClass = (token: WordToken) => {
    if (!xRayEnabled) return ''
    if (token.syntax === 'noun') return 'rounded-sm bg-syntax-noun/15 text-syntax-noun'
    if (token.syntax === 'verb') return 'rounded-sm bg-syntax-verb/15 text-syntax-verb'
    if (token.syntax === 'adj') return 'rounded-sm bg-syntax-adj/15 text-syntax-adj'
    return ''
  }

  const recordMistake = async (category: string, context: string) => {
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
    <p className="text-body-reading leading-relaxed">
      {tokens.map((token, index) => {
        const word = token.lemmaId ? vocabularyById.get(token.lemmaId) : undefined
        const active = token.id === activeWordId
        const spaceBefore = needsSpaceBefore(tokens, index)
        const meanings = word?.meanings?.length
          ? word.meanings
          : word?.base_translation
            ? word.base_translation.split(';').map((part) => part.trim()).filter(Boolean)
            : []
        const showConjugate = word ? isConjugableVerb(word) : false
        const clickableClass = showConjugate
          ? 'cursor-pointer rounded px-0.5 text-left hover:bg-syntax-verb/10'
          : 'cursor-pointer rounded px-0.5 text-left hover:bg-surface-container-high'
        return (
          <span key={token.id} className="relative inline">
            {spaceBefore ? ' ' : null}
            {word ? (
              <button type="button" onClick={() => setActiveWordId(active ? null : token.id)} className={`transition-colors ${clickableClass} ${syntaxClass(token)} ${active ? 'bg-surface-container-high' : ''}`}>
                {token.text}
              </button>
            ) : (
              <span className={syntaxClass(token)}>{token.text}</span>
            )}
            {active && word && (
              <div className="absolute bottom-full left-1/2 z-30 mb-3 w-72 -translate-x-1/2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-4 text-left shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{word.word}</p>
                    {word.part_of_speech && <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">{word.part_of_speech}{showConjugate ? ' · conjugable' : ''}</p>}
                    {word.ipa_pronunciation && <p className="mt-1 text-xs text-ink-medium">/{word.ipa_pronunciation}/</p>}
                  </div>
                  <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-on-primary">{word.register}</span>
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
                {word.example && (
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

  const enqueueLessonVocabulary = async (userId: string) => {
    const lemmaIds = [
      ...new Set(
        [...readingParagraphs, ...conversationLines.flatMap((line) => [{ tokens: line.tokens }])]
          .flatMap((paragraph) => paragraph.tokens)
          .map((token) => token.lemmaId)
          .filter((lemmaId): lemmaId is string => Boolean(lemmaId)),
      ),
    ]
    if (!lemmaIds.length) return
    try {
      const supabase = createClient()
      // Ensure dictionary rows exist so Review joins work for bundled Module 1 lemmas.
      const rows = lemmaIds
        .map((id) => vocabularyById.get(id))
        .filter((word): word is VocabularyWord => Boolean(word))
        .map((word) => ({
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
      if (rows.length) await supabase.from('vocabulary').upsert(rows, { onConflict: 'id' })
      const staggered = staggerReviewDates(lemmaIds)
      await supabase.from('user_vocab_progress').upsert(
        lemmaIds.map((vocab_id) => ({
          user_id: userId,
          vocab_id,
          next_review_at: staggered.get(vocab_id) ?? new Date().toISOString(),
          last_reviewed_at: null,
        })),
        { onConflict: 'user_id,vocab_id', ignoreDuplicates: true },
      )
      enqueueLocalVocabulary(lemmaIds)
    } catch {
      // Vocab Vault seeding is best-effort.
    }
  }

  const completeLesson = async () => {
    if (!answeredAll) return
    setLoading(true)
    setError(null)
    const grammarResults = exercises.map((exercise) => ({
      category: exercise.category,
      correct: isExerciseCorrect(exercise, answers[exercise.id]),
      context: `Lesson exercise: ${exercise.prompt}`,
    }))
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Your session expired. Please sign in again.')

      const score = calculateLessonScore(answers, exercises)
      const { error: rpcError } = await supabase.rpc('complete_chapter', {
        p_chapter_id: chapterId,
        p_score: score,
        p_words_read: content.wordCount ?? 0,
        p_grammar_results: grammarResults,
      })

      await enqueueLessonVocabulary(user.id)

      if (rpcError) {
        const { error: progressError } = await supabase.from('user_chapter_progress').upsert({
          user_id: user.id,
          chapter_id: chapterId,
          status: 'completed',
          score,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,chapter_id' })
        if (progressError) throw rpcError

        // Fallback path: still push wrong answers into Review.
        await Promise.all(
          exercises
            .filter((exercise) => !isExerciseCorrect(exercise, answers[exercise.id]))
            .map((exercise) => recordMistake(exercise.category, `Lesson exercise: ${exercise.prompt}`)),
        )
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
              <p className="mb-4 pr-28 text-sm text-on-surface-variant">Tap any word for meaning. Verbs include a <span className="font-semibold text-primary">Conjugate</span> button. Turn on X-Ray to color nouns, verbs, and adjectives.</p>
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
              {conversationLines.map((line, index) => (
                <article key={`${line.speaker}-${index}`} className={`rounded-xl border-2 border-surface-variant p-4 ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-primary-fixed/20'}`}>
                  <p className="text-label-caps text-primary">{line.speaker}</p>
                  <div className="mt-2">{renderTokens(line.tokens)}</div>
                </article>
              ))}
            </div>
            <p className="text-sm text-on-surface-variant">Dialogue words are tappable too — try a verb for Conjugate.</p>
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
            <p className="text-body-reading text-on-surface-variant">
              Mixed drills: multiple choice, fill-in, matching, word order, and more. Answer each once — wrong answers feed Review.
            </p>
            {exercises.map((exercise, exerciseIndex) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={exerciseIndex}
                total={exercises.length}
                answer={answers[exercise.id]}
                onAnswer={(value) => setAnswers((current) => ({ ...current, [exercise.id]: value }))}
                onMistake={() => void recordMistake(exercise.category, `Lesson exercise: ${exercise.prompt}`)}
              />
            ))}
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
          <section className="flex max-h-[85vh] w-full max-w-md flex-col rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-6">
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

'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ExerciseCard } from '@/components/lesson/ExerciseCard'
import { RichText } from '@/components/RichText'
import type { ExerciseAnswer } from '@/lib/exercises/types'
import type { GrammarRuleDocument, RuleTable } from '@/lib/rules/types'
import {
  isRuleUnlocked,
  masteryLabel,
  masteryStage,
  type RuleMasteryStage,
} from '@/lib/rules/unlock'
import { mergeCompletedChapterIds } from '@/lib/local-progress'
import { createClient } from '@/utils/supabase/client'

type TabId = 'quick' | 'deep' | 'examples' | 'try'

async function recordRuleMistake(category: string, context: string) {
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
      error_count: 1,
      is_resolved: false,
      last_error_at: new Date().toISOString(),
    })
  } catch {
    // Best-effort mistake logging.
  }
}

function RuleTableView({ table }: { table: RuleTable }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border-2 border-surface-variant">
      {table.caption && <p className="bg-surface-container-low px-3 py-2 text-xs font-bold uppercase tracking-wide text-on-surface-variant">{table.caption}</p>}
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead>
          <tr className="border-b border-surface-variant bg-surface-container-low">
            {table.headers.map((header) => (
              <th key={header} className="px-3 py-2 font-bold text-on-surface">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => (
            <tr key={index} className="border-b border-surface-container-high last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 text-on-surface-variant">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function RuleDetailClient({ rule }: { rule: GrammarRuleDocument }) {
  const [tab, setTab] = useState<TabId>('quick')
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({})
  const [unlocked, setUnlocked] = useState(false)
  const [stage, setStage] = useState<RuleMasteryStage>('locked')
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          if (!cancelled) {
            setUnlocked(false)
            setStage('locked')
            setBooting(false)
          }
          return
        }
        const [{ data: progress }, { data: masteryRows }] = await Promise.all([
          supabase.from('user_chapter_progress').select('chapter_id').eq('user_id', user.id).eq('status', 'completed'),
          supabase
            .from('user_grammar_mastery')
            .select('grammar_category, total_attempts, correct_attempts')
            .eq('user_id', user.id)
            .in('grammar_category', rule.masteryCategories),
        ])
        if (cancelled) return
        const completed = mergeCompletedChapterIds((progress ?? []).map((row) => row.chapter_id))
        const isOpen = isRuleUnlocked(rule, completed)
        let totalAttempts = 0
        let correctAttempts = 0
        for (const row of masteryRows ?? []) {
          totalAttempts += row.total_attempts ?? 0
          correctAttempts += row.correct_attempts ?? 0
        }
        setUnlocked(isOpen)
        setStage(masteryStage(isOpen, correctAttempts, totalAttempts))
      } catch {
        if (!cancelled) {
          setUnlocked(false)
          setStage('locked')
        }
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [rule])

  const tabs = useMemo(
    () =>
      [
        { id: 'quick' as const, label: 'Quick' },
        { id: 'deep' as const, label: 'Deep dive' },
        { id: 'examples' as const, label: 'Examples' },
        { id: 'try' as const, label: 'Try it' },
      ] as const,
    [],
  )

  if (booting) {
    return (
      <div className="tactile-card mt-6 p-6">
        <p className="text-on-surface-variant">Loading rule…</p>
      </div>
    )
  }

  if (!unlocked) {
    // Locked: generic message only — deepDive/examples/drills never hit the DOM.
    return (
      <div className="tactile-card mt-6 space-y-4 p-6">
        <h1 className="text-headline-lg">Not available yet</h1>
        <p className="text-body-reading text-on-surface-variant">
          This grammar page unlocks after you finish the lesson that teaches it. Keep learning — it will appear in your rulebook when ready.
        </p>
        <Link href="/rules/" className="tactile-button inline-flex rounded-lg border-2 border-surface-variant bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface">
          Back to rulebook
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="tactile-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-label-caps text-primary">{rule.category}</p>
            <h1 className="mt-2 text-headline-lg">{rule.title}</h1>
            <p className="mt-2 text-body-ui text-on-surface-variant">{rule.summary}</p>
          </div>
          <span className="rounded-full bg-surface-container-high px-3 py-1 text-label-caps text-on-surface-variant">
            {masteryLabel(stage)}
          </span>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                tab === item.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'quick' && (
        <section className="tactile-card space-y-4 p-6">
          <h2 className="text-headline-md">Quick reference</h2>
          <ul className="list-disc space-y-2 pl-5 text-body-reading text-on-surface-variant">
            {rule.quickReference.bullets.map((bullet) => (
              <li key={bullet}>
                <RichText text={bullet} />
              </li>
            ))}
          </ul>
          {rule.quickReference.table && <RuleTableView table={rule.quickReference.table} />}
          <div className="rounded-lg bg-surface-container-low p-3 text-sm text-on-surface-variant">
            <RichText text={rule.full_explanation} />
          </div>
        </section>
      )}

      {tab === 'deep' && (
        <section className="space-y-4">
          <article className="tactile-card space-y-3 p-6">
            <h2 className="text-headline-md">Why this matters</h2>
            <RichText text={rule.deepDive.whyItMatters} className="text-body-reading text-on-surface-variant" />
          </article>
          {rule.deepDive.sections.map((section) => (
            <article key={section.heading} className="tactile-card space-y-3 p-6">
              <h3 className="text-lg font-bold">{section.heading}</h3>
              <RichText text={section.body} className="text-body-reading text-on-surface-variant" />
              {section.table && <RuleTableView table={section.table} />}
            </article>
          ))}
          {rule.deepDive.contrastEn && (
            <article className="tactile-card space-y-3 p-6">
              <h3 className="text-lg font-bold">Contrast with English</h3>
              <RuleTableView table={rule.deepDive.contrastEn} />
            </article>
          )}
          <article className="tactile-card space-y-3 p-6">
            <h3 className="text-lg font-bold">Common mistakes</h3>
            <div className="grid gap-3">
              {rule.deepDive.commonMistakes.map((mistake) => (
                <div key={mistake.wrong} className="rounded-lg border-l-4 border-error bg-surface-container-low p-3 text-sm">
                  <p>
                    <span className="font-bold text-error">✕</span> {mistake.wrong}
                  </p>
                  <p className="mt-1">
                    <span className="font-bold text-success">✓</span> {mistake.right}
                  </p>
                  <p className="mt-1 text-on-surface-variant">{mistake.why}</p>
                </div>
              ))}
            </div>
          </article>
          {rule.deepDive.pronunciationNotes?.length ? (
            <article className="tactile-card space-y-2 p-6">
              <h3 className="text-lg font-bold">Pronunciation</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-on-surface-variant">
                {rule.deepDive.pronunciationNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      )}

      {tab === 'examples' && (
        <section className="space-y-4">
          {rule.examplesByGroup.map((group) => (
            <article key={group.heading} className="tactile-card space-y-3 p-6">
              <h2 className="text-headline-md">{group.heading}</h2>
              <div className="grid gap-3">
                {group.items.map((example) => (
                  <blockquote key={example.french} className="rounded-lg border-l-4 border-primary bg-surface-container-low p-4">
                    <p className="font-reading text-lg">{example.french}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{example.english}</p>
                    {example.focus && <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-primary">Focus: {example.focus}</p>}
                  </blockquote>
                ))}
              </div>
            </article>
          ))}
          {rule.dialogueSample && (
            <article className="tactile-card space-y-3 p-6">
              <h2 className="text-headline-md">{rule.dialogueSample.title}</h2>
              <div className="space-y-2 rounded-lg bg-surface-container-low p-4 text-sm">
                {rule.dialogueSample.lines.map((line, index) => (
                  <p key={`${line.speaker}-${index}`}>
                    <span className="font-bold text-primary">{line.speaker}</span>
                    <span className="text-on-surface-variant"> · </span>
                    {line.text}
                  </p>
                ))}
              </div>
              {rule.dialogueSample.note && <p className="text-sm text-on-surface-variant">{rule.dialogueSample.note}</p>}
            </article>
          )}
        </section>
      )}

      {tab === 'try' && (
        <section className="space-y-4">
          {rule.drills.map((drill, index) => (
            <article key={drill.id} className="space-y-2">
              <h2 className="px-1 text-sm font-bold uppercase tracking-wide text-on-surface-variant">{drill.title}</h2>
              <ExerciseCard
                exercise={drill.exercise}
                index={index}
                total={rule.drills.length}
                answer={answers[drill.id]}
                onAnswer={(value) => setAnswers((current) => ({ ...current, [drill.id]: value }))}
                onMistake={() =>
                  void recordRuleMistake(
                    drill.exercise.category || rule.masteryCategories[0] || rule.slug,
                    `Rules Try it: ${drill.title} — ${drill.exercise.prompt}`,
                  )
                }
                onRetry={() =>
                  setAnswers((current) => {
                    const next = { ...current }
                    delete next[drill.id]
                    return next
                  })
                }
              />
            </article>
          ))}
        </section>
      )}

      <section className="tactile-card space-y-3 p-6">
        <h2 className="text-headline-md">Practice in the app</h2>
        <div className="space-y-2">
          {rule.linkedLessons.map((lesson) => (
            <Link
              key={lesson.chapterId}
              href={`/lesson/${lesson.chapterId}/`}
              className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-3 text-sm font-semibold text-primary hover:bg-surface-container-high"
            >
              <span>
                {lesson.lessonLabel} · {lesson.title}
              </span>
              <span className="text-xs text-on-surface-variant">{lesson.note ?? 'Open lesson'}</span>
            </Link>
          ))}
        </div>
        {rule.relatedRules.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {rule.relatedRules.map((related) => (
              <Link
                key={related.slug}
                href={`/rules/${related.slug}/`}
                className="rounded-full border-2 border-primary-fixed-dim bg-primary-fixed/30 px-3 py-1.5 text-sm font-bold text-primary"
              >
                {related.label}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

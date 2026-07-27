'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Clock, Lock, Play, Star } from 'lucide-react'
import { hasLessonContent } from '@/lib/course'
import {
  PATHWAY_BY_CHAPTER_ID,
  PATHWAY_BY_MODULE_ID,
  pathwayLabel,
  unitsForModule,
  type PathwaySubChapter,
} from '@/lib/pathway/catalog'
import { deriveChapterStatus } from '@/lib/progression'
import { BUNDLED_CHAPTER_IDS } from '@/lib/bundled-chapter-ids'
import { mergeCompletedChapterIds, readLocalCompletedChapters, subscribeCompletedChapters } from '@/lib/local-progress'
import { createClient } from '@/utils/supabase/client'

type Module = {
  id: string
  title: string
  description: string
  cefr_level: string
  order_index: number
}

type Chapter = {
  id: string
  module_id: string
  title: string
  description: string
  order_index: number
  lesson_content: unknown
}

type Progress = { chapter_id: string; status: 'locked' | 'active' | 'completed' }

function ChapterCard({
  chapter,
  moduleOrder,
  status,
  pathway,
}: {
  chapter: Chapter
  moduleOrder: number
  status: ReturnType<typeof deriveChapterStatus>
  pathway?: PathwaySubChapter
}) {
  const label = pathway
    ? pathwayLabel(moduleOrder, pathway)
    : `${moduleOrder}.${chapter.order_index} ${chapter.title}`
  const statusContent = {
    completed: { label: 'Completed', icon: <Star className="size-6 fill-success text-success" />, tone: 'text-success' },
    active: { label: 'Up next', icon: <Play className="size-6 fill-primary text-primary" />, tone: 'text-primary' },
    locked: { label: 'Locked', icon: <Lock className="size-6 text-on-surface-variant" />, tone: 'text-on-surface-variant' },
    'coming-soon': { label: 'Coming soon', icon: <Clock className="size-6 text-on-surface-variant" />, tone: 'text-on-surface-variant' },
  }[status]

  const card = (
    <div
      className={`tactile-card flex items-center gap-4 p-4 ${status === 'active' ? 'border-b-primary' : ''} ${
        status === 'locked' || status === 'coming-soon' ? 'bg-surface-container-low opacity-75' : ''
      }`}
    >
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-[5px] border-surface-container-high bg-surface-container-lowest">
        {statusContent.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-label-caps ${statusContent.tone}`}>{statusContent.label}</p>
          {pathway && (
            <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
              {pathway.roleLabel}
            </span>
          )}
        </div>
        <h3 className="mt-1 break-words text-body-ui font-bold">{label}</h3>
        <p className="mt-1 text-sm text-on-surface-variant">{chapter.description}</p>
      </div>
    </div>
  )

  return status === 'active' || status === 'completed' ? (
    <Link href={`/lesson/${chapter.id}/`} className="outline-none transition-opacity hover:opacity-90">
      {card}
    </Link>
  ) : (
    <div>{card}</div>
  )
}

export default function HomeClient({
  modules: courseModules,
  chapters: courseChapters,
}: {
  modules: Module[]
  chapters: Chapter[]
}) {
  const [progressByChapter, setProgressByChapter] = useState<Map<string, Progress['status']>>(new Map())
  const [wordsRead, setWordsRead] = useState(0)
  const [progressReady, setProgressReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          if (!cancelled) setProgressReady(true)
          return
        }

        const now = new Date()
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        const [{ data: progress }, { data: todayStats }] = await Promise.all([
          supabase.from('user_chapter_progress').select('chapter_id, status').eq('user_id', user.id),
          supabase.from('user_daily_reading_stats').select('words_read').eq('user_id', user.id).eq('date', today).maybeSingle(),
        ])
        if (cancelled) return
        const remoteCompleted = (progress as Progress[] | null)?.filter((item) => item.status === 'completed').map((item) => item.chapter_id) ?? []
        const merged = mergeCompletedChapterIds(remoteCompleted)
        const map = new Map<string, Progress['status']>()
        for (const [id, status] of (progress as Progress[] | null)?.map((item) => [item.chapter_id, item.status] as const) ?? []) {
          map.set(id, status)
        }
        for (const id of merged) map.set(id, 'completed')
        setProgressByChapter(map)
        setWordsRead(todayStats?.words_read ?? 0)
      } finally {
        if (!cancelled) setProgressReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return subscribeCompletedChapters(() => {
      setProgressByChapter((current) => {
        const next = new Map(current)
        for (const id of readLocalCompletedChapters()) {
          next.set(id, 'completed')
        }
        return next
      })
    })
  }, [])

  const authoredChapters = useMemo(() => {
    const authored = courseChapters.filter((chapter) => hasLessonContent(chapter.lesson_content))
    return [...authored].sort((left, right) => {
      const leftModule = courseModules.find((module) => module.id === left.module_id)?.order_index ?? 0
      const rightModule = courseModules.find((module) => module.id === right.module_id)?.order_index ?? 0
      return leftModule - rightModule || left.order_index - right.order_index
    })
  }, [courseChapters, courseModules])

  const DAILY_GOAL = 300
  const authoredIds = useMemo(() => {
    // Prefer bundled pathway order so Home matches lesson unlock (incl. Prove D).
    const fromBundle = BUNDLED_CHAPTER_IDS.filter((id) => courseChapters.some((c) => c.id === id && hasLessonContent(c.lesson_content)))
    return fromBundle.length ? fromBundle : authoredChapters.map((item) => item.id)
  }, [authoredChapters, courseChapters])
  const completedIds = useMemo(
    () => new Set([...progressByChapter].filter(([, status]) => status === 'completed').map(([id]) => id)),
    [progressByChapter],
  )
  const completedPlayable = authoredIds.filter((id) => completedIds.has(id)).length
  const mastery = authoredIds.length ? Math.round((completedPlayable / authoredIds.length) * 100) : 0
  const chaptersById = useMemo(() => new Map(courseChapters.map((chapter) => [chapter.id, chapter])), [courseChapters])
  const authoredTotal = authoredIds.length
  const authoredDone = completedPlayable
  const dailyPct = Math.min(100, Math.round((wordsRead / DAILY_GOAL) * 100))
  const dailyLabel =
    wordsRead >= DAILY_GOAL
      ? `${wordsRead} words today · goal ${DAILY_GOAL} met`
      : `${wordsRead} / ${DAILY_GOAL} words read today`

  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="tactile-card p-5">
        <p className="text-label-caps text-on-surface-variant">TODAY&apos;S READING</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-headline-md">Bienvenue</h1>
            <p className="mt-1 text-body-ui text-on-surface-variant">{dailyLabel}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-label-caps text-on-surface-variant">PATHWAY</p>
            <p className="text-headline-lg text-success">{mastery}%</p>
            <p className="text-xs text-on-surface-variant">
              {authoredDone}/{authoredTotal || 0} playable
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Pathway progress</p>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-success transition-all" style={{ width: `${mastery}%` }} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Daily reading goal</p>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${dailyPct}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        {!progressReady ? (
          <p className="py-8 text-center text-on-surface-variant">Loading…</p>
        ) : (
        courseModules.map((module) => {
          const pathwayModule = PATHWAY_BY_MODULE_ID.get(module.id)
          const units = pathwayModule ? unitsForModule(pathwayModule) : []
          const playableCount = pathwayModule
            ? pathwayModule.subchapters.filter((sub) => hasLessonContent(chaptersById.get(sub.id)?.lesson_content)).length
            : courseChapters.filter((c) => c.module_id === module.id && hasLessonContent(c.lesson_content)).length

          return (
            <div key={module.id} className="flex flex-col gap-6">
              <header className="border-b-2 border-surface-container-high pb-3">
                <p className="text-label-caps text-primary">
                  MODULE {module.order_index} · {module.cefr_level}
                  {pathwayModule ? ' · 5 UNITS · 20 SUB-CHAPTERS' : ''}
                  {playableCount ? ` · ${playableCount} PLAYABLE` : ''}
                </p>
                <h2 className="text-headline-md">{module.title}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">{module.description}</p>
              </header>

              {units.length > 0 ? (
                units.map((unit) => (
                  <div key={unit.unitIndex} className="flex flex-col gap-3">
                    <div>
                      <p className="text-label-caps text-on-surface-variant">
                        UNIT {unit.unitIndex} · {unit.unitTitle}
                      </p>
                      <p className="text-sm text-on-surface-variant">{unit.unitGrammar}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {unit.chapters.map((sub) => {
                        const chapter = chaptersById.get(sub.id)
                        if (!chapter) return null
                        return (
                          <ChapterCard
                            key={sub.id}
                            chapter={chapter}
                            moduleOrder={module.order_index}
                            status={deriveChapterStatus(chapter.id, authoredIds, completedIds)}
                            pathway={PATHWAY_BY_CHAPTER_ID.get(chapter.id)?.sub}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                courseChapters
                  .filter((chapter) => chapter.module_id === module.id)
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((chapter) => (
                    <ChapterCard
                      key={chapter.id}
                      chapter={chapter}
                      moduleOrder={module.order_index}
                      status={deriveChapterStatus(chapter.id, authoredIds, completedIds)}
                      pathway={PATHWAY_BY_CHAPTER_ID.get(chapter.id)?.sub}
                    />
                  ))
              )}
            </div>
          )
        })
        )}
      </section>
    </div>
  )
}

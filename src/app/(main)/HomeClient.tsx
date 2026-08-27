'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Clock, Circle, Play, Star } from 'lucide-react'
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
import { mergeCompletedChapterIds, readLocalCompletedChapters, readLocalDailyWords, readInProgressPercents, subscribeCompletedChapters } from '@/lib/local-progress'
import { SaveCourseCard } from '@/components/SaveCourseCard'

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

type Progress = { chapter_id: string; status: 'not-started' | 'in-progress' | 'completed' }

function ChapterCard({
  chapter,
  moduleOrder,
  status,
  percent,
  pathway,
}: {
  chapter: Chapter
  moduleOrder: number
  status: ReturnType<typeof deriveChapterStatus>
  percent?: number
  pathway?: PathwaySubChapter
}) {
  const label = pathway
    ? pathwayLabel(moduleOrder, pathway)
    : `${moduleOrder}.${chapter.order_index} ${chapter.title}`
  const shownPercent = Math.max(0, Math.min(99, percent ?? 0))
  const statusContent = {
    completed: { label: 'Completed', icon: <Star className="size-6 fill-success text-success" />, tone: 'text-success' },
    'in-progress': {
      label: `In progress · ${shownPercent}%`,
      icon: <Play className="size-6 fill-primary text-primary" />,
      tone: 'text-primary',
    },
    'not-started': {
      label: 'Not started',
      icon: <Circle className="size-6 text-on-surface-variant" />,
      tone: 'text-on-surface-variant',
    },
    'coming-soon': { label: 'Coming soon', icon: <Clock className="size-6 text-on-surface-variant" />, tone: 'text-on-surface-variant' },
  }[status]

  const card = (
    <div
      className={`tactile-card flex items-center gap-4 p-4 ${status === 'in-progress' ? 'border-b-primary' : ''}`}
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
        {status === 'in-progress' ? (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${shownPercent}%` }} />
          </div>
        ) : null}
      </div>
    </div>
  )

  return status === 'coming-soon' ? (
    <div>{card}</div>
  ) : (
    <Link href={`/lesson/${chapter.id}/`} className="outline-none transition-opacity hover:opacity-90">
      {card}
    </Link>
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
  const [inProgressPercents, setInProgressPercents] = useState<Record<string, number>>({})
  const [wordsRead, setWordsRead] = useState(0)
  const [progressReady, setProgressReady] = useState(false)

  useEffect(() => {
    void Promise.resolve().then(() => {
      const map = new Map<string, Progress['status']>()
      for (const id of mergeCompletedChapterIds([])) map.set(id, 'completed')
      setProgressByChapter(map)
      setInProgressPercents(readInProgressPercents())
      setWordsRead(readLocalDailyWords())
      setProgressReady(true)
    })
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
      setInProgressPercents(readInProgressPercents())
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
    // Prefer bundled pathway order so Home status matches every playable lesson.
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
      <SaveCourseCard />

      <section className="tactile-card p-5">
        <p className="text-label-caps text-on-surface-variant">TODAY&apos;S READING</p>
        <div className="mt-2">
          <h1 className="text-headline-md">Bienvenue</h1>
          <p className="mt-1 text-body-ui text-on-surface-variant">{dailyLabel}</p>
        </div>
        <div className="mt-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Daily reading goal</p>
          <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${dailyPct}%` }} />
          </div>
        </div>
      </section>

      <section className="tactile-card p-5">
        <p className="text-label-caps text-on-surface-variant">PATHWAY</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <p className="text-headline-lg text-success">{mastery}%</p>
            <p className="text-sm text-on-surface-variant">
              {authoredDone}/{authoredTotal || 0} playable chapters done
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Pathway progress</p>
          <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${mastery}%` }} />
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
                            status={deriveChapterStatus(chapter.id, authoredIds, completedIds, inProgressPercents)}
                            percent={inProgressPercents[chapter.id]}
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
                      status={deriveChapterStatus(chapter.id, authoredIds, completedIds, inProgressPercents)}
                      percent={inProgressPercents[chapter.id]}
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

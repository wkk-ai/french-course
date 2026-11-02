'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { PATHWAY_BY_MODULE_ID } from '@/lib/pathway/catalog'
import { completedUnitIds, unitLessonsForModule, type UnitLesson } from '@/lib/pathway/units'
import { HAND_WRITTEN_UNIT_IDS, REWRITTEN_MODULE_ORDERS } from '@/lib/units/index.generated'
import { mergeCompletedChapterIds, readLocalCompletedChapters, readLocalDailyWords, readLocalStreak, readInProgressPercents, subscribeCompletedChapters } from '@/lib/local-progress'
import { AccountMenu } from '@/components/auth/AccountMenu'
import { getCachedUser } from '@/lib/cloud/auth'
import { TRACKS, trackForModuleOrder, unitsForTrack, type TrackId } from '@/lib/pathway/tracks'

const TRACK_PREF_KEY = 'french-course:home-track'

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

const HAND_WRITTEN = new Set(HAND_WRITTEN_UNIT_IDS)

function isRewritten(moduleOrder: number, units: UnitLesson[]) {
  return REWRITTEN_MODULE_ORDERS.has(moduleOrder) || units.every((unit) => HAND_WRITTEN.has(unit.id))
}

function LessonRow({
  unit,
  done,
  percent,
  isNext,
}: {
  unit: UnitLesson
  done: boolean
  percent?: number
  isNext: boolean
}) {
  const shown = Math.max(0, Math.min(99, percent ?? 0))
  const started = !done && shown > 0
  const meta = done ? 'Done' : started ? `${shown}% done` : unit.focus
  const icon = done ? (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success text-white"><Check className="size-4" strokeWidth={3} /></span>
  ) : started || isNext ? (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white"><Play className="size-3 fill-white" /></span>
  ) : (
    <span className="m-0.5 size-6 shrink-0 rounded-full shadow-[inset_0_0_0_2px_var(--color-outline-variant)]" />
  )
  return (
    <Link href={`/lesson/${unit.id}/`} className="rounded-xl hover:bg-surface-container">
      <div className="flex min-h-14 items-center gap-3 px-4 py-2">
        {icon}
        <div className="min-w-0 flex-1">
          <p className={`truncate text-body-ui ${isNext ? 'font-bold' : 'font-semibold'}`}>{unit.unitIndex}. {unit.title}</p>
          <p className="truncate text-xs text-on-surface-variant">{meta}</p>
        </div>
      </div>
    </Link>
  )
}

export default function HomeClient({
  modules: courseModules,
}: {
  modules: Module[]
  chapters: Chapter[]
}) {
  const [progressByChapter, setProgressByChapter] = useState<Map<string, Progress['status']>>(new Map())
  const [inProgressPercents, setInProgressPercents] = useState<Record<string, number>>({})
  const [wordsRead, setWordsRead] = useState(0)
  const [progressReady, setProgressReady] = useState(false)
  const [trackId, setTrackId] = useState<TrackId>('conversation')
  const [streak, setStreak] = useState(0)
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    void Promise.resolve().then(() => {
      const map = new Map<string, Progress['status']>()
      for (const id of mergeCompletedChapterIds([])) map.set(id, 'completed')
      setProgressByChapter(map)
      setInProgressPercents(readInProgressPercents())
      setWordsRead(readLocalDailyWords())
      setStreak(readLocalStreak())
      setFirstName((getCachedUser()?.name || '').split(' ')[0] || '')
      try {
        const saved = localStorage.getItem(TRACK_PREF_KEY)
        if (saved === 'conversation' || saved === 'business' || saved === 'advanced') setTrackId(saved)
      } catch {
        // storage blocked: default track
      }
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

  const DAILY_GOAL = 300
  const completedIds = useMemo(
    () => completedUnitIds([...progressByChapter].filter(([, status]) => status === 'completed').map(([id]) => id)),
    [progressByChapter],
  )
  const track = TRACKS.find((item) => item.id === trackId) ?? TRACKS[0]
  const trackUnits = useMemo(() => unitsForTrack(trackId), [trackId])
  const completedPlayable = trackUnits.filter((unit) => completedIds.has(unit.id)).length
  const mastery = trackUnits.length ? Math.round((completedPlayable / trackUnits.length) * 100) : 0
  const chooseTrack = (next: TrackId) => {
    setTrackId(next)
    try {
      localStorage.setItem(TRACK_PREF_KEY, next)
    } catch {
      // ignore
    }
  }
  const visibleModules = courseModules.filter((module) => trackForModuleOrder(module.order_index) === trackId)
    .sort((a, b) => track.moduleOrders.indexOf(a.order_index) - track.moduleOrders.indexOf(b.order_index))
  const authoredTotal = trackUnits.length
  const authoredDone = completedPlayable
  const dailyPct = Math.min(100, Math.round((wordsRead / DAILY_GOAL) * 100))
  const nextUnit = trackUnits.find((unit) => !completedIds.has(unit.id)) ?? null
  const nextId = nextUnit?.id ?? null
  const nextModuleId = nextUnit?.moduleId
  const ringLength = 2 * Math.PI * 26
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-on-surface-variant">{today}</p>
          <h1 className="text-headline-lg">Bonjour{firstName ? `, ${firstName}` : ''}</h1>
        </div>
        <AccountMenu />
      </header>

      <section aria-label="Today" className="flex flex-col gap-4 rounded-3xl bg-primary p-5 text-on-primary">
        <div className="flex items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 60 60" role="img" aria-label={`${wordsRead} of ${DAILY_GOAL} words today`}>
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="6" />
            <circle cx="30" cy="30" r="26" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray={ringLength} strokeDashoffset={ringLength * (1 - dailyPct / 100)} transform="rotate(-90 30 30)" />
          </svg>
          <div>
            <p className="text-sm text-white/85">Today{streak > 0 ? ` · ${streak}-day streak` : ''}</p>
            <p className="text-xl font-bold">{wordsRead} / {DAILY_GOAL} words</p>
          </div>
        </div>
        {nextId && nextUnit ? (
          <Link href={`/lesson/${nextId}/`} className="flex min-h-11 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-on-surface">
            <span className="min-w-0">
              <span className="block text-xs text-on-surface-variant">{completedPlayable ? 'Continue' : 'Start'} · Module {nextUnit.moduleOrder}, unit {nextUnit.unitIndex}</span>
              <span className="block truncate text-body-ui font-semibold">{nextUnit.title}</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-primary" />
          </Link>
        ) : (
          <p className="rounded-2xl bg-white/15 px-4 py-3 text-sm">Track complete. Pick another track below.</p>
        )}
      </section>

      <div role="tablist" aria-label="Tracks" className="grid grid-cols-3 gap-1 rounded-xl bg-surface-container-low p-1">
        {TRACKS.map((item) => {
          const active = item.id === trackId
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => chooseTrack(item.id)}
              className={`min-h-9 rounded-[9px] text-sm ${active ? 'bg-white font-semibold text-on-surface shadow-sm' : 'font-medium text-on-surface-variant'}`}
            >
              {item.id === 'advanced' ? 'Advanced' : item.title}
            </button>
          )
        })}
      </div>

      <div className="-mt-2 flex items-center justify-between gap-3 text-sm text-on-surface-variant">
        <p className="min-w-0">{track.optional ? 'Optional · skip freely' : track.short}</p>
        <p className="shrink-0">{authoredDone} of {authoredTotal} · {mastery}%</p>
      </div>

      <section className="flex flex-col gap-3">
        {!progressReady ? (
          <p className="py-8 text-center text-on-surface-variant">Loading…</p>
        ) : (
          visibleModules.map((module) => {
            const pathwayModule = PATHWAY_BY_MODULE_ID.get(module.id)
            const units = pathwayModule ? unitLessonsForModule(pathwayModule) : []
            const done = units.filter((unit) => completedIds.has(unit.id)).length
            const pct = units.length ? Math.round((done / units.length) * 100) : 0
            const open = module.id === nextModuleId
            const draft = !isRewritten(module.order_index, units)
            return (
              <details key={module.id} open={open} className="group rounded-[20px] bg-surface-container-low">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-on-surface-variant">Module {module.order_index} · {module.cefr_level}{draft ? ' · Draft, being rewritten' : ''}</p>
                    <h2 className="truncate text-body-ui font-bold">{module.title}</h2>
                    <div className="mt-2 h-1 rounded-full bg-surface-container-highest">
                      <div className="h-1 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-on-surface-variant">{done}/{units.length}</span>
                  <ChevronDown className="size-5 shrink-0 text-on-surface-variant transition-transform group-open:rotate-180" />
                </summary>
                <div className="flex flex-col pb-2">
                  {units.map((unit) => (
                    <LessonRow
                      key={unit.id}
                      unit={unit}
                      done={completedIds.has(unit.id)}
                      percent={inProgressPercents[unit.id]}
                      isNext={unit.id === nextId}
                    />
                  ))}
                </div>
              </details>
            )
          })
        )}
      </section>
    </div>
  )
}

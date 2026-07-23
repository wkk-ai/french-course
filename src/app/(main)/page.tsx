import Link from 'next/link'
import { Check, Lock, Play, Star } from 'lucide-react'
import { hasLessonContent } from '@/lib/course'
import { deriveChapterStatus } from '@/lib/progression'
import { createClient } from '@/utils/supabase/server'

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

export default async function HomePage() {
  const supabase = await createClient()
  const [{ data: modules }, { data: chapters }, { data: { user } }] = await Promise.all([
    supabase.from('modules').select('*').order('order_index'),
    supabase.from('chapters').select('*').order('order_index'),
    supabase.auth.getUser(),
  ])

  if (!modules?.length || !chapters?.length) {
    return (
      <section className="tactile-card p-6">
        <h1 className="text-headline-md">Course content is not available yet</h1>
        <p className="mt-2 text-on-surface-variant">Run the Supabase migrations and seed file to load the learning pathway.</p>
      </section>
    )
  }

  const [{ data: progress }, { data: todayStats }] = await Promise.all([
    user
      ? supabase.from('user_chapter_progress').select('chapter_id, status').eq('user_id', user.id)
      : Promise.resolve({ data: [] as Progress[] }),
    user
      ? supabase.from('user_daily_reading_stats').select('words_read').eq('user_id', user.id).eq('date', new Date().toISOString().slice(0, 10)).maybeSingle()
      : Promise.resolve({ data: null as { words_read: number } | null }),
  ])

  const courseModules = modules as Module[]
  const courseChapters = chapters as Chapter[]
  const progressByChapter = new Map((progress as Progress[] | null)?.map((item) => [item.chapter_id, item.status]) ?? [])
  const authoredChapters = courseChapters.filter((chapter) => hasLessonContent(chapter.lesson_content))
  const firstModuleChapters = authoredChapters.filter((chapter) => chapter.module_id === courseModules[0].id)
  const completedInFirstModule = firstModuleChapters.filter((chapter) => progressByChapter.get(chapter.id) === 'completed').length
  const mastery = firstModuleChapters.length ? Math.round((completedInFirstModule / firstModuleChapters.length) * 100) : 0
  const wordsRead = todayStats?.words_read ?? 0

  const chapterStatus = (chapter: Chapter) => {
    return deriveChapterStatus(
      chapter.id,
      authoredChapters.map((item) => item.id),
      new Set([...progressByChapter].filter(([, status]) => status === 'completed').map(([id]) => id))
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="tactile-card p-5">
        <p className="text-label-caps text-on-surface-variant">TODAY&apos;S READING</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-headline-md">Bienvenue</h1>
            <p className="mt-1 text-body-ui text-on-surface-variant">{wordsRead} / 300 words read today</p>
          </div>
          <div className="text-right">
            <p className="text-label-caps text-on-surface-variant">MODULE 1</p>
            <p className="text-headline-lg text-success">{mastery}%</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full rounded-full bg-success" style={{ width: `${Math.min(100, Math.round((wordsRead / 300) * 100))}%` }} />
        </div>
      </section>

      <section className="flex flex-col gap-8">
        {courseModules.map((module) => (
          <div key={module.id} className="flex flex-col gap-4">
            <header className="border-b-2 border-surface-container-high pb-3">
              <p className="text-label-caps text-primary">MODULE {module.order_index} · {module.cefr_level}</p>
              <h2 className="text-headline-md">{module.title}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">{module.description}</p>
            </header>

            {courseChapters.filter((chapter) => chapter.module_id === module.id).map((chapter) => {
              const status = chapterStatus(chapter)
              const label = `${module.order_index}.${chapter.order_index} ${chapter.title}`
              const statusContent = {
                completed: { label: 'Completed', icon: <Star className="size-6 fill-success text-success" />, tone: 'text-success' },
                active: { label: 'Up next', icon: <Play className="size-6 fill-primary text-primary" />, tone: 'text-primary' },
                locked: { label: 'Locked', icon: <Lock className="size-6 text-on-surface-variant" />, tone: 'text-on-surface-variant' },
                'coming-soon': { label: 'Coming soon', icon: <Check className="size-6 text-on-surface-variant" />, tone: 'text-on-surface-variant' },
              }[status]
              const card = (
                <div className={`tactile-card flex items-center gap-4 p-4 ${status === 'active' ? 'border-b-primary' : ''} ${status === 'locked' || status === 'coming-soon' ? 'bg-surface-container-low opacity-75' : ''}`}>
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-[5px] border-surface-container-high bg-surface-container-lowest">
                    {statusContent.icon}
                  </div>
                  <div>
                    <p className={`text-label-caps ${statusContent.tone}`}>{statusContent.label}</p>
                    <h3 className="mt-1 text-body-ui font-bold">{label}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{chapter.description}</p>
                  </div>
                </div>
              )
              return status === 'active' || status === 'completed'
                ? <Link key={chapter.id} href={`/lesson/${chapter.id}`} className="outline-none">{card}</Link>
                : <div key={chapter.id}>{card}</div>
            })}
          </div>
        ))}
      </section>
    </div>
  )
}

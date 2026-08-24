'use client'

import { useEffect, useState } from 'react'
import type { LessonContent } from '@/lib/course'
import { BUNDLED_VOCABULARY } from '@/lib/bundled-vocabulary'
import LessonClient from './LessonClient'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function LessonShell({ chapterId, title }: { chapterId: string; title: string }) {
  const [content, setContent] = useState<LessonContent | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`${basePath}/course-data/lessons/${chapterId}.json`)
      .then((response) => {
        if (!response.ok) throw new Error('missing')
        return response.json() as Promise<LessonContent>
      })
      .then((lesson) => {
        if (!cancelled) setContent(lesson)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [chapterId])

  if (failed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[680px] items-center p-6">
        <section className="tactile-card p-6">
          <h1 className="text-headline-md">{title}</h1>
          <p className="mt-2 text-on-surface-variant">
            This lesson is not on the phone yet. Open with wifi and tap Save course on Home.
          </p>
        </section>
      </main>
    )
  }

  if (!content) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[680px] items-center justify-center p-6">
        <p className="text-on-surface-variant">Loading lesson…</p>
      </main>
    )
  }

  return (
    <LessonClient
      chapterId={chapterId}
      title={title}
      content={content}
      vocabulary={BUNDLED_VOCABULARY}
      conjugations={[]}
      rules={[]}
    />
  )
}

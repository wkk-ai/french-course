'use client'

import { useEffect, useState } from 'react'
import { downloadCourseToPhone, readCourseManifest, readSavedCourseVersion } from '@/lib/offline/course-cache'

export function SaveCourseCard() {
  const [savedVersion, setSavedVersion] = useState<string | null>(null)
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null)
  const [bytes, setBytes] = useState(0)
  const [lessonCount, setLessonCount] = useState(0)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.resolve().then(() => setSavedVersion(readSavedCourseVersion()))
    readCourseManifest()
      .then((manifest) => {
        setRemoteVersion(manifest.version)
        setBytes(manifest.bytes)
        setLessonCount(manifest.lessonCount)
      })
      .catch(() => {})
  }, [])

  const saving = progress !== null
  const saved = Boolean(savedVersion && remoteVersion && savedVersion === remoteVersion)
  const sizeLabel = bytes ? `About ${Math.max(1, Math.round(bytes / 1e6))} MB of lessons` : 'Whole course'

  const save = async () => {
    setError(null)
    setProgress({ done: 0, total: 1 })
    try {
      const version = await downloadCourseToPhone((done, total) => setProgress({ done, total }))
      setSavedVersion(version)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the course on this phone.')
    } finally {
      setProgress(null)
    }
  }

  return (
    <section className="tactile-card p-5">
      <p className="text-label-caps text-on-surface-variant">ON THIS PHONE</p>
      <h2 className="mt-2 text-headline-md">{saved ? 'Course saved' : 'Save course for offline'}</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        {saved
          ? `${lessonCount || 'All'} lessons stay on this iPhone. Progress stays here too — no account.`
          : `One wifi save. Then Airplane Mode works. ${sizeLabel}. Progress stays on this phone. No login.`}
      </p>
      {progress && (
        <p className="mt-3 text-sm font-bold text-primary">
          Saving {progress.done}/{progress.total}…
        </p>
      )}
      {error && <p className="mt-3 text-sm font-bold text-error">{error}</p>}
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="tactile-button mt-4 w-full rounded-xl border-primary-container bg-primary py-3 font-bold text-on-primary disabled:opacity-50"
      >
        {saving ? 'SAVING…' : saved ? 'SAVE AGAIN' : 'SAVE COURSE ON THIS PHONE'}
      </button>
    </section>
  )
}

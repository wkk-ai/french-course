'use client'

import { useEffect, useState } from 'react'
import { CloudDownload } from 'lucide-react'
import { downloadCourseToPhone, readCourseManifest, readSavedCourseVersion } from '@/lib/offline/course-cache'

/** One compact row: save the whole course on this phone for offline use. */
export function SaveCourseCard() {
  const [savedVersion, setSavedVersion] = useState<string | null>(null)
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null)
  const [bytes, setBytes] = useState(0)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void Promise.resolve().then(() => setSavedVersion(readSavedCourseVersion()))
    readCourseManifest()
      .then((manifest) => {
        setRemoteVersion(manifest.version)
        setBytes(manifest.bytes)
      })
      .catch(() => {})
  }, [])

  const saving = progress !== null
  const saved = Boolean(savedVersion && remoteVersion && savedVersion === remoteVersion)
  const size = bytes ? `${Math.max(1, Math.round(bytes / 1e6))} MB` : ''

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

  const subtitle = progress
    ? `Saving ${progress.done} of ${progress.total}…`
    : saved
      ? 'Saved · works without internet'
      : `Use once on wifi${size ? ` · ${size}` : ''}`

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
        <CloudDownload className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-ui font-semibold">Offline course</p>
        <p className={`text-sm ${error ? 'text-error' : 'text-on-surface-variant'}`}>{error ?? subtitle}</p>
      </div>
      <button
        type="button"
        onClick={() => void save()}
        disabled={saving}
        className="min-h-11 shrink-0 rounded-full bg-surface-container-high px-4 text-sm font-semibold text-on-surface disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Update' : 'Save'}
      </button>
    </div>
  )
}

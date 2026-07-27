'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function normalizePath(pathname: string | null) {
  if (!pathname) return '/'
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '')
  let path = pathname
  if (base && (path === base || path.startsWith(`${base}/`))) {
    path = path.slice(base.length) || '/'
  }
  const trimmed = path.replace(/\/+$/, '') || '/'
  return trimmed
}

function isLessonPath(path: string) {
  return path.startsWith('/lesson/')
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [sessionLost, setSessionLost] = useState(false)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    const path = normalizePath(pathname)

    const ensureSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return

      if (!user) {
        if (path !== '/login') {
          router.replace('/login/')
        } else {
          setReady(true)
        }
        return
      }

      if (path === '/login') {
        router.replace('/')
        return
      }

      setSessionLost(false)
      setReady(true)
    }

    ensureSession().catch(() => {
      if (!cancelled) router.replace('/login/')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      if (!session) {
        const current = normalizePath(pathname)
        // Soft-fail mid-lesson: keep UI mounted so draft answers stay visible.
        if (isLessonPath(current)) {
          setSessionLost(true)
          return
        }
        setReady(false)
        router.replace('/login/')
      } else {
        setSessionLost(false)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [pathname, router])

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-on-surface-variant">Checking session…</p>
      </main>
    )
  }

  return (
    <>
      {sessionLost && (
        <div className="sticky top-0 z-50 border-b border-error/30 bg-error-container px-4 py-3 text-center text-sm text-on-error-container">
          Your session ended. Your answers are still on this page —{' '}
          <a className="font-bold underline" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/login/`}>
            sign in again
          </a>{' '}
          to save.
        </div>
      )}
      {children}
    </>
  )
}

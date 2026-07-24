'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function normalizePath(pathname: string | null) {
  if (!pathname) return '/'
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  return trimmed
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    const path = normalizePath(pathname)

    const ensureSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return

      if (!session) {
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

      setReady(true)
    }

    ensureSession().catch(() => {
      if (!cancelled) router.replace('/login/')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      if (!session) {
        setReady(false)
        router.replace('/login/')
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

  return <>{children}</>
}

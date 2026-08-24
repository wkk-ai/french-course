'use client'

import { useEffect } from 'react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Accounts removed — course and progress live on this phone. */
export default function LoginPage() {
  useEffect(() => {
    window.location.replace(`${basePath}/`)
  }, [])
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <p className="text-on-surface-variant">Opening the course…</p>
    </main>
  )
}

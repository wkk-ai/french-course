'use client'

import { useEffect } from 'react'

export function PwaRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
    navigator.serviceWorker
      .register(`${base}/sw.js`)
      .then((registration) => registration.update())
      .catch(() => {
        // Offline support is progressive; the app remains fully usable online.
      })
  }, [])

  return null
}

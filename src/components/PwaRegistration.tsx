'use client'

import { useEffect } from 'react'

export function PwaRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Offline support is progressive; the app remains fully usable online.
      })
    }
  }, [])

  return null
}

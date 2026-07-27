'use client'

import { useEffect } from 'react'

/** Clears stale caches. Offline PWA deferred — do not re-register sw.js. */
export function PwaRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {})
    if ('caches' in window) {
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).catch(() => {})
    }
    // Offline support deferred: unregister only, no new SW registration.
  }, [])

  return null
}

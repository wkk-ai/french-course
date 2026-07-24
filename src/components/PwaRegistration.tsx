'use client'

import { useEffect } from 'react'

/** Clears stale caches; offline PWA caching is disabled until content shipping is stable. */
export function PwaRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {})
    if ('caches' in window) {
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).catch(() => {})
    }
    // One-shot cleanup worker for clients that still have the old cache-first SW.
    navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {})
  }, [])

  return null
}

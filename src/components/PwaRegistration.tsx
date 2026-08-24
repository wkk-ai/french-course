'use client'

import { useEffect } from 'react'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Register the offline worker. Old cleanup workers unregister themselves on activate. */
export function PwaRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {})
  }, [])

  return null
}

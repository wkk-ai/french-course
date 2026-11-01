'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { CloudOff, Cloud, LogOut, RefreshCw, RotateCcw, UserRound, X } from 'lucide-react'
import { getCachedUser, signOut, subscribeAuth } from '@/lib/cloud/auth'
import { getLastSyncAt, getSyncStatus, subscribeSync, syncNow, type SyncStatus } from '@/lib/cloud/sync'
import { clearLocalLearnerData } from '@/lib/local-progress'

function statusText(status: SyncStatus, lastSync: string | null): string {
  const when = lastSync ? new Date(lastSync).toLocaleString() : 'never'
  switch (status.state) {
    case 'syncing': return 'Syncing…'
    case 'done': return `Synced · ${new Date(status.at).toLocaleTimeString()}`
    case 'offline': return `Offline · saved on this phone · last sync ${when}`
    case 'needs-login': return 'Sync paused · sign out and sign in again'
    case 'error': return `Sync problem: ${status.message}`
    default: return `Last sync ${when}`
  }
}

export function AccountMenu() {
  const [open, setOpen] = useState(false)
  const user = useSyncExternalStore(subscribeAuth, getCachedUser, () => null)
  const status = useSyncExternalStore(subscribeSync, getSyncStatus, () => ({ state: 'idle' }) as SyncStatus)
  const dialogRef = useRef<HTMLDivElement>(null)
  const ok = status.state === 'done' || status.state === 'syncing' || status.state === 'idle'

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.querySelector('button')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const doSignOut = async () => {
    if (!window.confirm('Sign out? Your progress is saved online first, then removed from this phone.')) return
    const result = await syncNow()
    if (result.state !== 'done' && !window.confirm('Progress could not be saved online right now. Sign out anyway and lose unsynced progress on this phone?')) return
    clearLocalLearnerData()
    await signOut()
    setOpen(false)
  }

  const resetPhone = () => {
    if (!window.confirm('Erase progress on this phone? It comes back from your account on the next sync.')) return
    clearLocalLearnerData()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Account and sync"
        className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-3 text-on-surface-variant hover:bg-surface-container-low"
      >
        <UserRound className="size-5" />
        <span aria-hidden className={`absolute right-2 top-2 size-2.5 rounded-full ${ok ? 'bg-success' : 'bg-warning'}`} />
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setOpen(false)}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-t-2xl bg-surface-container-lowest p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="account-title" className="text-headline-md">Account</h2>
                <p className="text-sm text-on-surface-variant">{user?.email}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex size-11 items-center justify-center rounded-lg hover:bg-surface-container-low">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-container-low px-3 py-3 text-sm" aria-live="polite">
              {ok ? <Cloud className="mt-0.5 size-4 shrink-0 text-success" /> : <CloudOff className="mt-0.5 size-4 shrink-0 text-warning" />}
              {statusText(status, getLastSyncAt())}
            </p>
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => void syncNow()} disabled={status.state === 'syncing'} className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-surface-variant px-4 font-bold disabled:opacity-60">
                <RefreshCw className="size-4" /> Sync now
              </button>
              <button type="button" onClick={resetPhone} className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-surface-variant px-4 font-bold">
                <RotateCcw className="size-4" /> Reset this phone
              </button>
              <button type="button" onClick={() => void doSignOut()} className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-error/40 px-4 font-bold text-error">
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

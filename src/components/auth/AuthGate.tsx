'use client'

import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { getCachedUser, signIn, signUp, subscribeAuth, type CloudUser } from '@/lib/cloud/auth'
import { startAutoSync, syncNow } from '@/lib/cloud/sync'

/**
 * Asks for email + password once per phone. After that the app opens offline too
 * (the signed-in person is remembered on the phone) and progress syncs when online.
 */

const subscribe = (listener: () => void) => subscribeAuth(listener)
const serverUser = (): CloudUser | null | undefined => undefined

export function AuthGate({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore<CloudUser | null | undefined>(subscribe, getCachedUser, serverUser)

  useEffect(() => {
    if (!user) return
    return startAutoSync()
  }, [user])

  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center text-on-surface-variant">Opening…</div>
  }
  if (!user) return <LoginScreen />
  return <>{children}</>
}

function LoginScreen() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (busy) return
    setError(null)
    if (mode === 'up' && password.length < 8) {
      setError('Password is too short. Use at least 8 characters.')
      return
    }
    setBusy(true)
    const result = mode === 'in' ? await signIn(email, password) : await signUp(name, email, password)
    setBusy(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    void syncNow()
  }

  const inputClass = 'mt-1 block w-full rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3 text-body-ui focus:border-primary focus:outline-none'

  return (
    <main className="flex min-h-screen items-center justify-center p-4 pt-safe">
      <form onSubmit={submit} className="tactile-card w-full max-w-sm p-6" aria-labelledby="login-title">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-on-primary">
          <Lock className="size-6" />
        </div>
        <h1 id="login-title" className="mt-4 text-headline-md">{mode === 'in' ? 'Sign in' : 'Create your account'}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          {mode === 'in' ? 'Once per phone. After that the course opens offline too.' : 'Your progress will follow you to every device.'}
        </p>

        {mode === 'up' && (
          <label className="mt-5 block text-sm font-bold">
            Name
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        )}
        <label className="mt-5 block text-sm font-bold">
          Email
          <input className={inputClass} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" autoCapitalize="none" />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Password
          <input className={inputClass} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={mode === 'up' ? 8 : undefined} />
        </label>

        {error && <p role="alert" className="mt-4 rounded-xl bg-error-container/60 px-3 py-2 text-sm text-on-error-container">{error}</p>}

        <button type="submit" disabled={busy} className="tactile-button mt-6 w-full rounded-xl border-primary-container bg-primary py-4 font-bold text-on-primary disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'in' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
        <button
          type="button"
          onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError(null) }}
          className="mt-3 min-h-11 w-full text-sm font-bold text-primary"
        >
          {mode === 'in' ? 'First time? Create an account' : 'I already have an account'}
        </button>
      </form>
    </main>
  )
}

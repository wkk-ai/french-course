import { NEON_AUTH_URL } from '@/lib/cloud/config'

/**
 * Email + password login against Neon Auth (Better Auth), with plain fetch.
 *
 * Why not cookies only: the site lives on github.io and Neon on neon.tech. iPhone Safari blocks
 * cross-site cookies, so we keep the session token from the sign-in response in this phone's
 * storage and send it as a Bearer header. Cookies are still sent (credentials: 'include') as a fallback.
 */

const SESSION_KEY = 'french-course:auth-session'
const AUTH_EVENT = 'french-course-auth'

export type CloudUser = { id: string; email: string; name: string }
type StoredSession = { token: string | null; user: CloudUser; savedAt: string }
type Result<T> = { ok: true; data: T } | { ok: false; error: string }

let jwtCache: { token: string; exp: number } | null = null

function readStored(): StoredSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredSession
    return parsed?.user?.id ? parsed : null
  } catch {
    return null
  }
}

function writeStored(session: StoredSession | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // storage blocked: login lasts for this visit only
  }
  jwtCache = null
  window.dispatchEvent(new Event(AUTH_EVENT))
}

let userMemo: { raw: string | null; user: CloudUser | null } = { raw: null, user: null }

/** The person signed in on this phone, even when offline. Same object until it changes (safe for React stores). */
export function getCachedUser(): CloudUser | null {
  if (typeof window === 'undefined') return null
  let raw: string | null = null
  try {
    raw = localStorage.getItem(SESSION_KEY)
  } catch {
    raw = null
  }
  if (raw !== userMemo.raw) userMemo = { raw, user: readStored()?.user ?? null }
  return userMemo.user
}

export function subscribeAuth(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) listener()
  }
  window.addEventListener(AUTH_EVENT, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(AUTH_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}

function authHeaders(extra?: Record<string, string>): Headers {
  const headers = new Headers(extra)
  const token = readStored()?.token
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return headers
}

/** Turn server and network errors into short, plain messages. */
export function friendlyAuthError(status: number | null, message: string | undefined): string {
  if (status === null) return 'No connection. Connect to the internet to sign in the first time.'
  const text = (message ?? '').toLowerCase()
  if (status === 401 || text.includes('invalid email or password') || text.includes('invalid password')) {
    return 'Wrong email or password.'
  }
  if (text.includes('already exists') || text.includes('already registered')) return 'This email already has an account. Sign in instead.'
  if (text.includes('password') && text.includes('short')) return 'Password is too short. Use at least 8 characters.'
  if (text.includes('sign up') && (text.includes('disabled') || text.includes('not allowed'))) return 'New accounts are closed.'
  if (status === 429) return 'Too many tries. Wait a minute and try again.'
  if (status >= 500) return 'The login server had a problem. Try again in a minute.'
  return message?.trim() || 'Sign in failed.'
}

async function postAuth(path: string, body: unknown): Promise<Result<{ token: string | null; user: CloudUser }>> {
  let response: Response
  try {
    response = await fetch(`${NEON_AUTH_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return { ok: false, error: friendlyAuthError(null, undefined) }
  }
  const payload = (await response.json().catch(() => ({}))) as {
    token?: string | null
    user?: { id?: string; email?: string; name?: string }
    message?: string
    code?: string
  }
  if (!response.ok || !payload.user?.id) {
    return { ok: false, error: friendlyAuthError(response.ok ? 500 : response.status, payload.message ?? payload.code) }
  }
  const token = response.headers.get('set-auth-token') ?? payload.token ?? null
  return {
    ok: true,
    data: { token, user: { id: payload.user.id, email: payload.user.email ?? '', name: payload.user.name ?? '' } },
  }
}

export async function signIn(email: string, password: string): Promise<Result<CloudUser>> {
  const result = await postAuth('/sign-in/email', { email: email.trim(), password, rememberMe: true })
  if (!result.ok) return result
  writeStored({ token: result.data.token, user: result.data.user, savedAt: new Date().toISOString() })
  return { ok: true, data: result.data.user }
}

export async function signUp(name: string, email: string, password: string): Promise<Result<CloudUser>> {
  const result = await postAuth('/sign-up/email', { name: name.trim() || email.trim(), email: email.trim(), password })
  if (!result.ok) return result
  writeStored({ token: result.data.token, user: result.data.user, savedAt: new Date().toISOString() })
  return { ok: true, data: result.data.user }
}

export async function signOut(): Promise<void> {
  try {
    await fetch(`${NEON_AUTH_URL}/sign-out`, { method: 'POST', credentials: 'include', headers: authHeaders({ 'Content-Type': 'application/json' }), body: '{}' })
  } catch {
    // offline: still sign out on this phone
  }
  writeStored(null)
}

function decodeExp(jwt: string): number {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number }
    return (payload.exp ?? 0) * 1000
  } catch {
    return 0
  }
}

export type JwtResult = { ok: true; jwt: string } | { ok: false; reason: 'offline' | 'signed-out' | 'server'; detail?: string }

/** Short-lived token (15 min) the database accepts. Refreshed from the session when needed. */
export async function getDatabaseToken(): Promise<JwtResult> {
  if (!readStored()) return { ok: false, reason: 'signed-out' }
  if (jwtCache && jwtCache.exp - Date.now() > 60_000) return { ok: true, jwt: jwtCache.token }
  let response: Response
  try {
    response = await fetch(`${NEON_AUTH_URL}/token`, { credentials: 'include', headers: authHeaders() })
  } catch {
    return { ok: false, reason: 'offline' }
  }
  if (response.status === 401) {
    // Session expired, or this browser blocks the login. Keep the phone usable; sync asks to sign in again.
    return { ok: false, reason: 'signed-out', detail: 'token 401' }
  }
  const payload = (await response.json().catch(() => ({}))) as { token?: string }
  const jwt = payload.token ?? response.headers.get('set-auth-jwt') ?? undefined
  if (!response.ok || !jwt) return { ok: false, reason: 'server', detail: `token ${response.status}` }
  jwtCache = { token: jwt, exp: decodeExp(jwt) || Date.now() + 10 * 60_000 }
  return { ok: true, jwt }
}

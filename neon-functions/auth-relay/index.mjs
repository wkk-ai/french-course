/**
 * Login relay for the French course (Neon Function).
 *
 * Why: the site is on github.io and Neon Auth on neon.tech. iPhone Safari blocks cookies between
 * different sites, so the browser can never keep the Neon Auth session cookie. This relay keeps the
 * cookie for the app: it signs in on the app's behalf and hands back the session cookie as an opaque
 * "session" string. The app sends that string back to get a short-lived database token.
 *
 * It stores nothing. It only talks to one fixed Neon Auth address and only answers the allowed sites.
 */

const AUTH_BASE = 'https://ep-shiny-frog-b6jsw3dy.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth'
const APP_ORIGIN = 'https://wkk-ai.github.io'
const ALLOWED_ORIGINS = new Set([APP_ORIGIN, 'http://localhost:3000'])
const MAX_BODY = 4096

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : APP_ORIGIN
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'content-type, x-session',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(origin) } })
}

/** Keep only name=value of each session cookie the auth server set. */
function cookieJar(response) {
  const list = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : []
  return list
    .map((line) => line.split(';')[0].trim())
    .filter((pair) => /session/i.test(pair.split('=')[0]) && pair.includes('='))
    .join('; ')
}

async function forward(path, { method = 'POST', body, session } = {}) {
  const headers = { Origin: APP_ORIGIN }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (session) headers.Cookie = session
  return fetch(`${AUTH_BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' })
}

async function readBody(request) {
  const text = await request.text()
  if (text.length > MAX_BODY) throw new Error('too large')
  return text ? JSON.parse(text) : {}
}

export default {
  async fetch(request) {
    const origin = request.headers.get('origin') ?? ''
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) })
    if (!ALLOWED_ORIGINS.has(origin)) return json(403, { message: 'Origin not allowed' }, origin)
    if (request.method !== 'POST') return json(405, { message: 'Use POST' }, origin)

    const path = new URL(request.url).pathname.replace(/\/+$/, '')
    let input
    try {
      input = await readBody(request)
    } catch {
      return json(400, { message: 'Bad request' }, origin)
    }

    try {
      if (path === '/sign-in' || path === '/sign-up') {
        const body =
          path === '/sign-in'
            ? { email: String(input.email ?? ''), password: String(input.password ?? ''), rememberMe: true }
            : { email: String(input.email ?? ''), password: String(input.password ?? ''), name: String(input.name ?? input.email ?? '') }
        const response = await forward(path === '/sign-in' ? '/sign-in/email' : '/sign-up/email', { body })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) return json(response.status, { message: payload.message ?? 'Sign in failed', code: payload.code }, origin)
        const session = cookieJar(response)
        if (!session) return json(502, { message: 'Login server did not return a session' }, origin)
        const user = payload.user ?? {}
        return json(200, { session, user: { id: user.id, email: user.email, name: user.name } }, origin)
      }

      const session = request.headers.get('x-session') ?? ''
      if (!session || session.length > MAX_BODY) return json(401, { message: 'Signed out' }, origin)

      if (path === '/token') {
        const response = await forward('/token', { method: 'GET', session })
        const payload = await response.json().catch(() => ({}))
        if (!response.ok || !payload.token) return json(response.status === 200 ? 502 : response.status, { message: 'No token' }, origin)
        return json(200, { token: payload.token }, origin)
      }

      if (path === '/sign-out') {
        await forward('/sign-out', { body: {}, session }).catch(() => undefined)
        return json(200, { ok: true }, origin)
      }

      return json(404, { message: 'Not found' }, origin)
    } catch {
      return json(502, { message: 'Login server unreachable' }, origin)
    }
  },
}

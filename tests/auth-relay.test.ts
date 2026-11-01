import assert from 'node:assert/strict'
import test from 'node:test'

type Handler = { fetch: (request: Request) => Promise<Response> }

test('auth relay: refuses unknown sites and keeps only the session cookie', async () => {
  const relay = (await import('../neon-functions/auth-relay/index.mjs')).default as Handler
  const realFetch = globalThis.fetch
  const seen: Array<{ url: string; cookie: string | null; origin: string | null }> = []
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    const headers = new Headers(init?.headers)
    seen.push({ url, cookie: headers.get('cookie'), origin: headers.get('origin') })
    if (url.endsWith('/sign-in/email')) {
      const response = new Response(JSON.stringify({ user: { id: 'u1', email: 'a@b.c', name: 'A' } }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      response.headers.append('Set-Cookie', '__Secure-neon-auth.session_token=abc.sig; Path=/; HttpOnly; Secure; SameSite=Strict')
      response.headers.append('Set-Cookie', 'tracking=nope; Path=/')
      return response
    }
    if (url.endsWith('/token')) return new Response(JSON.stringify({ token: 'jwt-123' }), { status: 200 })
    return new Response('{}', { status: 404 })
  }) as typeof fetch
  try {
    const evil = await relay.fetch(new Request('https://relay/sign-in', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{}' }))
    assert.equal(evil.status, 403)

    const ok = await relay.fetch(new Request('https://relay/sign-in', { method: 'POST', headers: { Origin: 'https://wkk-ai.github.io', 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'a@b.c', password: 'x' }) }))
    assert.equal(ok.status, 200)
    const body = (await ok.json()) as { session: string; user: { id: string } }
    assert.equal(body.session, '__Secure-neon-auth.session_token=abc.sig')
    assert.equal(body.user.id, 'u1')
    assert.equal(ok.headers.get('access-control-allow-origin'), 'https://wkk-ai.github.io')
    assert.equal(seen[0].origin, 'https://wkk-ai.github.io')

    const token = await relay.fetch(new Request('https://relay/token', { method: 'POST', headers: { Origin: 'https://wkk-ai.github.io', 'x-session': body.session }, body: '{}' }))
    assert.equal(token.status, 200)
    assert.equal(((await token.json()) as { token: string }).token, 'jwt-123')
    assert.equal(seen.at(-1)?.cookie, body.session, 'relay sends the session cookie to Neon Auth')

    const noSession = await relay.fetch(new Request('https://relay/token', { method: 'POST', headers: { Origin: 'https://wkk-ai.github.io' }, body: '{}' }))
    assert.equal(noSession.status, 401)
  } finally {
    globalThis.fetch = realFetch
  }
})

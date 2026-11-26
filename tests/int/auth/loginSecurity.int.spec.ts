import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { apiErrors } = vi.hoisted(() => ({
  apiErrors: [] as { message: string; status: number }[],
}))

vi.mock('payload', () => ({
  APIError: class APIError extends Error {
    status: number

    constructor(message: string, status: number) {
      super(message)
      this.status = status
      apiErrors.push({ message, status })
    }
  },
}))

import {
  clearChallengeCookies,
  clearLoginRateLimit,
  createChallenge,
  enforceLoginProtection,
  getClientIP,
  isLoginRequest,
  parseCookies,
  serializeCookie,
} from '@/features/auth/lib/loginSecurity'
import { ANSWER_COOKIE, CHALLENGE_COOKIE } from '@/features/auth/lib/loginCookies'

const NOW = new Date('2026-06-01T12:00:00.000Z')

const createReq = (options: { ip?: string; url?: string; language?: string } = {}) => {
  const headers = new Headers()
  headers.set('x-forwarded-for', options.ip ?? '203.0.113.10')
  const kv = {
    delete: vi.fn().mockResolvedValue(undefined),
    get: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue(undefined),
  }

  return {
    headers,
    i18n: { language: options.language ?? 'fr' },
    payload: { kv },
    responseHeaders: new Headers(),
    url: options.url ?? 'http://localhost/admin/login',
  } as never
}

type MockKV = {
  delete: ReturnType<typeof vi.fn>
  get: ReturnType<typeof vi.fn>
  set: ReturnType<typeof vi.fn>
}

const kvOf = (req: never): MockKV =>
  (req as unknown as { payload: { kv: MockKV } }).payload.kv

const solveChallenge = (req: never, challenge: ReturnType<typeof createChallenge>) => {
  const [a, b] = challenge.question.match(/\d+/g)?.map(Number) ?? []
  ;(req as unknown as { headers: Headers }).headers.set(
    'cookie',
    `${CHALLENGE_COOKIE}=${challenge.token}; ${ANSWER_COOKIE}=${String(Number(a) + Number(b))}`,
  )
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
  vi.stubEnv('PAYLOAD_SECRET', 'a-test-secret')
  vi.stubEnv('NODE_ENV', 'test')
  apiErrors.length = 0
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('getClientIP', () => {
  it('uses the first forwarded address', () => {
    const req = createReq({ ip: ' 203.0.113.1 , 10.0.0.1' })
    expect(getClientIP(req)).toBe('203.0.113.1')
  })

  it('falls back to x-real-ip and then to unknown', () => {
    const req = createReq()
    ;(req as unknown as { headers: Headers }).headers.delete('x-forwarded-for')
    ;(req as unknown as { headers: Headers }).headers.set('x-real-ip', '  198.51.100.2  ')
    expect(getClientIP(req)).toBe('198.51.100.2')

    ;(req as unknown as { headers: Headers }).headers.delete('x-real-ip')
    expect(getClientIP(req)).toBe('unknown')
  })

  it('treats an empty forwarded header as unknown', () => {
    const req = createReq({ ip: ', 10.0.0.1' })
    expect(getClientIP(req)).toBe('unknown')
  })
})

describe('parseCookies', () => {
  it('parses and decodes cookies', () => {
    const req = createReq()
    ;(req as unknown as { headers: Headers }).headers.set(
      'cookie',
      'a=1; b=two%20words; flag; c = 3',
    )

    expect(parseCookies(req)).toEqual({ a: '1', b: 'two words', c: '3' })
  })

  it('keeps malformed values raw', () => {
    const req = createReq()
    ;(req as unknown as { headers: Headers }).headers.set('cookie', 'bad=%E0%A4%A')

    expect(parseCookies(req).bad).toBe('%E0%A4%A')
  })

  it('returns an empty object when there is no cookie header', () => {
    expect(parseCookies(createReq())).toEqual({})
  })
})

describe('createChallenge', () => {
  it('creates a five-minute signed addition question', () => {
    const challenge = createChallenge(createReq())

    expect(challenge.maxAge).toBe(300)
    expect(challenge.question).toMatch(/^([2-9]|10) \+ ([2-9]|10) = \?$/)
    expect(challenge.token.split('.')).toHaveLength(2)

    const body = challenge.token.split('.')[0] ?? ''
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      a: number
      b: number
      exp: number
      ip: string
    }

    expect(payload.exp).toBe(NOW.getTime() + 300_000)
    expect(payload.ip).toMatch(/^[0-9a-f]{16}$/)
  })
})

describe('serializeCookie / clearChallengeCookies', () => {
  it('adds HttpOnly and Secure only when appropriate', () => {
    expect(serializeCookie('name', 'value', 10, true)).toBe('name=value; Path=/; SameSite=Lax; Max-Age=10; HttpOnly')
    expect(serializeCookie('name', 'value', 10, false)).toBe('name=value; Path=/; SameSite=Lax; Max-Age=10')

    vi.stubEnv('NODE_ENV', 'production')
    expect(serializeCookie('name', 'value', 10, false)).toContain('Secure')
  })

  it('clears both challenge cookies with Max-Age=0', () => {
    const req = createReq()
    clearChallengeCookies(req)

    const cookies = (req as unknown as { responseHeaders: Headers }).responseHeaders.getSetCookie()
    expect(cookies).toHaveLength(2)
    expect(cookies[0]).toContain(`${CHALLENGE_COOKIE}=; Path=/`)
    expect(cookies[0]).toContain('Max-Age=0')
    expect(cookies[1]).toContain(`${ANSWER_COOKIE}=; Path=/`)
    expect(cookies[1]).not.toContain('HttpOnly')
  })

  it('does nothing without response headers', () => {
    const req = createReq() as unknown as Record<string, unknown>
    delete req.responseHeaders
    expect(() => clearChallengeCookies(req as never)).not.toThrow()
  })
})

describe('isLoginRequest', () => {
  it('matches only paths ending in /login', () => {
    expect(isLoginRequest(createReq({ url: 'http://localhost/admin/login' }))).toBe(true)
    expect(isLoginRequest(createReq({ url: 'http://localhost/admin/login?next=/' }))).toBe(true)
    expect(isLoginRequest(createReq({ url: 'http://localhost/admin' }))).toBe(false)
    expect(isLoginRequest(createReq({ url: 'http://localhost/admin/login/' }))).toBe(false)
    expect(isLoginRequest(createReq({ url: '' }))).toBe(false)
    expect(isLoginRequest(createReq({ url: 'http://[' }))).toBe(false)
  })
})

describe('enforceLoginProtection', () => {
  it('allows a correctly solved challenge and increments the counter', async () => {
    const req = createReq()
    solveChallenge(req, createChallenge(req))

    await expect(enforceLoginProtection(req)).resolves.toBeUndefined()
    expect(kvOf(req).set).toHaveBeenCalledWith('login-rate:203.0.113.10', {
      count: 1,
      windowStart: NOW.getTime(),
    })
    expect(apiErrors).toHaveLength(0)
  })

  it('rejects a missing or wrong answer', async () => {
    const req = createReq()
    await expect(enforceLoginProtection(req)).rejects.toMatchObject({ status: 403 })
    expect(apiErrors[0]?.message).toContain('vérification')

    const arReq = createReq({ language: 'ar' })
    await expect(enforceLoginProtection(arReq)).rejects.toMatchObject({ status: 403 })
    expect(apiErrors[1]?.message).toContain('التحقق')
  })

  it('rejects a tampered, expired or IP-bound challenge', async () => {
    const tampered = createReq()
    const token = createChallenge(tampered).token
    const last = token.slice(-1)
    ;(tampered as unknown as { headers: Headers }).headers.set(
      'cookie',
      `${CHALLENGE_COOKIE}=${token.slice(0, -1)}${last === 'A' ? 'B' : 'A'}; ${ANSWER_COOKIE}=10`,
    )
    await expect(enforceLoginProtection(tampered)).rejects.toMatchObject({ status: 403 })

    const expired = createReq()
    solveChallenge(expired, createChallenge(expired))
    vi.setSystemTime(new Date(NOW.getTime() + 6 * 60_000))
    await expect(enforceLoginProtection(expired)).rejects.toMatchObject({ status: 403 })

    const otherIP = createReq({ ip: '203.0.113.11' })
    solveChallenge(otherIP, createChallenge(createReq()))
    await expect(enforceLoginProtection(otherIP)).rejects.toMatchObject({ status: 403 })
  })

  it('blocks after eight attempts in a five-minute window', async () => {
    const req = createReq()
    solveChallenge(req, createChallenge(req))

    for (let attempt = 1; attempt <= 8; attempt += 1) {
      kvOf(req).get.mockResolvedValue({ count: attempt - 1, windowStart: NOW.getTime() })
      await expect(enforceLoginProtection(req)).resolves.toBeUndefined()
    }

    kvOf(req).get.mockResolvedValue({ count: 8, windowStart: NOW.getTime() })
    await expect(enforceLoginProtection(req)).rejects.toMatchObject({ status: 429 })
    expect(kvOf(req).set).toHaveBeenLastCalledWith('login-rate:203.0.113.10', {
      count: 9,
      windowStart: NOW.getTime(),
      blockedUntil: NOW.getTime() + 15 * 60_000,
    })
  })

  it('rejects an active block without counting another attempt', async () => {
    const req = createReq()
    solveChallenge(req, createChallenge(req))
    kvOf(req).get.mockResolvedValue({
      count: 9,
      windowStart: NOW.getTime() - 60_000,
      blockedUntil: NOW.getTime() + 60_000,
    })

    await expect(enforceLoginProtection(req)).rejects.toMatchObject({ status: 429 })
    expect(kvOf(req).set).not.toHaveBeenCalled()
  })

  it('starts a new window once the old one has expired', async () => {
    const req = createReq()
    solveChallenge(req, createChallenge(req))
    kvOf(req).get.mockResolvedValue({
      count: 8,
      windowStart: NOW.getTime() - 5 * 60_000,
    })

    await expect(enforceLoginProtection(req)).resolves.toBeUndefined()
    expect(kvOf(req).set).toHaveBeenCalledWith('login-rate:203.0.113.10', {
      count: 1,
      windowStart: NOW.getTime(),
    })
  })

  it('clears the rate-limit key for the client IP', async () => {
    const req = createReq()
    await clearLoginRateLimit(req)

    expect(kvOf(req).delete).toHaveBeenCalledWith('login-rate:203.0.113.10')
  })
})

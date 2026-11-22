import { createHash, createHmac, randomInt } from 'node:crypto'

import { APIError, type PayloadRequest } from 'payload'

import { ANSWER_COOKIE, CHALLENGE_COOKIE } from './loginCookies'

/**
 * Login protection for the admin panel.
 *
 * - Rate limiting uses Payload's built-in KV store, which is backed by the
 *   existing `payload_kv` table. No new collection or migration is needed and
 *   the counter survives serverless cold starts.
 * - The anti-bot check is a small addition question. The expected answer is
 *   held in an HMAC-signed, HTTP-only cookie so the browser never has to send
 *   an extra field through Payload's fixed login form.
 */

const CHALLENGE_TTL_SECONDS = 5 * 60
const MAX_ATTEMPTS = 8
const WINDOW_MS = 5 * 60 * 1000
const BLOCK_MS = 15 * 60 * 1000

type ChallengePayload = {
  a: number
  b: number
  exp: number
  ip: string
}

type RateEntry = {
  count: number
  windowStart: number
  blockedUntil?: number
}

const secret = () => process.env.PAYLOAD_SECRET || ''

export function getClientIP(req: PayloadRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')

  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'

  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function ipFingerprint(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}

function sign(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

function encodeChallenge(payload: ChallengePayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')

  return `${body}.${sign(body)}`
}

function decodeChallenge(token: string): ChallengePayload | null {
  const [body, signature] = token.split('.')

  if (!body || !signature || signature !== sign(body)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as ChallengePayload

    if (
      !Number.isInteger(payload.a) ||
      !Number.isInteger(payload.b) ||
      !Number.isFinite(payload.exp) ||
      typeof payload.ip !== 'string'
    ) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function parseCookies(req: PayloadRequest): Record<string, string> {
  const cookies: Record<string, string> = {}

  for (const part of (req.headers.get('cookie') ?? '').split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue

    const key = part.slice(0, separator).trim()
    const value = part.slice(separator + 1).trim()

    try {
      cookies[key] = decodeURIComponent(value)
    } catch {
      cookies[key] = value
    }
  }

  return cookies
}

export function createChallenge(req: PayloadRequest) {
  const a = randomInt(2, 10)
  const b = randomInt(2, 10)

  const payload: ChallengePayload = {
    a,
    b,
    exp: Date.now() + CHALLENGE_TTL_SECONDS * 1000,
    ip: ipFingerprint(getClientIP(req)),
  }

  return {
    maxAge: CHALLENGE_TTL_SECONDS,
    question: `${a} + ${b} = ?`,
    token: encodeChallenge(payload),
  }
}

function isChallengeSolved(req: PayloadRequest): boolean {
  const cookies = parseCookies(req)
  const token = cookies[CHALLENGE_COOKIE]
  const answer = cookies[ANSWER_COOKIE]

  if (!token || !answer) return false

  const payload = decodeChallenge(token)

  if (!payload || payload.exp < Date.now()) return false
  if (payload.ip !== ipFingerprint(getClientIP(req))) return false

  return answer.trim() === String(payload.a + payload.b)
}

export function serializeCookie(
  name: string,
  value: string,
  maxAge: number,
  httpOnly: boolean,
): string {
  const parts = [`${name}=${value}`, 'Path=/', 'SameSite=Lax', `Max-Age=${maxAge}`]

  if (httpOnly) parts.push('HttpOnly')
  if (process.env.NODE_ENV === 'production') parts.push('Secure')

  return parts.join('; ')
}

export function clearChallengeCookies(req: PayloadRequest): void {
  if (!req.responseHeaders) return

  req.responseHeaders.append('Set-Cookie', serializeCookie(CHALLENGE_COOKIE, '', 0, true))
  req.responseHeaders.append('Set-Cookie', serializeCookie(ANSWER_COOKIE, '', 0, false))
}

/** Only the real login endpoint is challenged; first-register logs in internally. */
export function isLoginRequest(req: PayloadRequest): boolean {
  try {
    const pathname = new URL(req.url || '', 'http://localhost').pathname

    return pathname.endsWith('/login')
  } catch {
    return false
  }
}

const localized = (req: PayloadRequest, ar: string, fr: string) =>
  req.i18n?.language === 'ar' ? ar : fr

export async function enforceLoginProtection(req: PayloadRequest): Promise<void> {
  const key = `login-rate:${getClientIP(req)}`
  const entry = await req.payload.kv.get<RateEntry>(key)
  const now = Date.now()

  if (entry?.blockedUntil && entry.blockedUntil > now) {
    throw new APIError(
      localized(
        req,
        'محاولات تسجيل دخول كثيرة. حاول مرة أخرى بعد قليل.',
        'Trop de tentatives de connexion. Réessayez dans quelques minutes.',
      ),
      429,
      {},
      true,
    )
  }

  const windowExpired = !entry || now - entry.windowStart >= WINDOW_MS

  const next: RateEntry = {
    count: windowExpired ? 1 : entry.count + 1,
    windowStart: windowExpired ? now : entry.windowStart,
  }

  if (next.count > MAX_ATTEMPTS) next.blockedUntil = now + BLOCK_MS

  await req.payload.kv.set(key, next)

  if (next.blockedUntil) {
    throw new APIError(
      localized(
        req,
        'محاولات تسجيل دخول كثيرة. حاول مرة أخرى بعد قليل.',
        'Trop de tentatives de connexion. Réessayez dans quelques minutes.',
      ),
      429,
      {},
      true,
    )
  }

  if (!isChallengeSolved(req)) {
    throw new APIError(
      localized(
        req,
        'يرجى حل مسألة التحقق البسيطة قبل تسجيل الدخول.',
        'Veuillez résoudre la vérification avant de vous connecter.',
      ),
      403,
      {},
      true,
    )
  }
}

export async function clearLoginRateLimit(req: PayloadRequest): Promise<void> {
  await req.payload.kv.delete(`login-rate:${getClientIP(req)}`)
}

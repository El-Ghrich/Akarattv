import { routing, type Locale } from '@/i18n/routing'

/**
 * Redirects managed in the Payload admin (the `redirects` collection created by
 * `@payloadcms/plugin-redirects`) and applied by `src/proxy.ts`.
 *
 * The proxy runs before routing, so this is the only place that can answer an
 * old URL with a real `301` instead of rendering the 404 page. Proxy fetches
 * may not use Next's data cache, so the collection is copied into a tiny
 * in-memory table with a short TTL. Editors see a change within a minute; the
 * hook on the collection still clears Next's own caches immediately.
 */

export type RedirectStatus = 301 | 302 | 303 | 307 | 308

export type RedirectMatch = {
  destination: string
  status: RedirectStatus
}

type ReferenceTarget = {
  collection: string
  /** One slug per locale, as returned by `?locale=all`. */
  slugs: Partial<Record<Locale, string>>
}

type RedirectTarget =
  | { kind: 'custom'; url: string }
  | { kind: 'reference'; reference: ReferenceTarget }

type RedirectRule = {
  from: string
  status: RedirectStatus
  target: RedirectTarget
}

type RawReference = {
  relationTo?: unknown
  value?: unknown
}

type RawRedirect = {
  from?: unknown
  to?: {
    reference?: unknown
    type?: unknown
    url?: unknown
  } | null
  type?: unknown
}

/** Collections an editor can point a redirect at, and their public path. */
const COLLECTION_PATHS: Record<string, string> = {
  articles: '/articles',
  categories: '/categories',
  regions: '/regions',
}

const ALLOWED_STATUS: readonly number[] = [301, 302, 303, 307, 308]

const CACHE_TTL_MS = 60_000
const FETCH_TIMEOUT_MS = 3_000
const MAX_REDIRECTS = 500

const asStatus = (value: unknown): RedirectStatus => {
  const status = Number(value)

  return ALLOWED_STATUS.includes(status) ? (status as RedirectStatus) : 301
}

const isLocale = (value: string | undefined): value is Locale =>
  Boolean(value) && routing.locales.includes(value as Locale)

const pathOnly = (value: string): string => {
  if (!/^https?:\/\//i.test(value)) return value

  try {
    return new URL(value).pathname
  } catch {
    return value
  }
}

/**
 * Matching is done on a decoded path without a trailing slash, so an editor
 * can paste either the URL from the browser bar or the value from the CMS.
 */
export const normalizePath = (value: string): string => {
  const raw = pathOnly(value.trim()).split(/[?#]/, 1)[0] || '/'
  let decoded = raw

  try {
    decoded = decodeURI(raw)
  } catch {
    // A malformed escape sequence should still match the raw value.
  }

  const withLeadingSlash = decoded.startsWith('/') ? decoded : `/${decoded}`

  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : '/'
}

const localizedSlug = (value: unknown, locale: Locale): string | null => {
  if (typeof value === 'string') {
    const slug = value.trim()

    return slug && locale === routing.defaultLocale ? slug : null
  }

  if (!value || typeof value !== 'object') return null

  const slug = (value as Record<string, unknown>)[locale]

  return typeof slug === 'string' && slug.trim() ? slug.trim() : null
}

const referenceSlugs = (value: unknown): Partial<Record<Locale, string>> => {
  if (typeof value === 'string') {
    const slug = value.trim()

    return slug ? { [routing.defaultLocale]: slug } : {}
  }

  if (!value || typeof value !== 'object') return {}

  const slugs: Partial<Record<Locale, string>> = {}

  for (const locale of routing.locales) {
    const slug = localizedSlug(value, locale)
    if (slug) slugs[locale] = slug
  }

  return slugs
}

const referenceTarget = (value: unknown): ReferenceTarget | null => {
  if (!value || typeof value !== 'object') return null

  const polymorphic = value as RawReference
  const collection =
    typeof polymorphic.relationTo === 'string' ? polymorphic.relationTo : null

  if (!collection || !COLLECTION_PATHS[collection]) return null
  if (!polymorphic.value || typeof polymorphic.value !== 'object') return null

  const slugs = referenceSlugs((polymorphic.value as { slug?: unknown }).slug)

  return Object.keys(slugs).length > 0 ? { collection, slugs } : null
}

const toRule = (doc: RawRedirect): RedirectRule | null => {
  if (typeof doc.from !== 'string' || !doc.from.trim()) return null
  if (!doc.to) return null

  const from = normalizePath(doc.from)
  const status = asStatus(doc.type)

  if (doc.to.type === 'custom') {
    const url = typeof doc.to.url === 'string' ? doc.to.url.trim() : ''
    if (!url) return null

    return { from, status, target: { kind: 'custom', url } }
  }

  const reference = referenceTarget(doc.to.reference)
  if (!reference) return null

  return { from, status, target: { kind: 'reference', reference } }
}

let cache: { expiresAt: number; lookup: Map<string, RedirectRule> } | null = null
let pending: Promise<Map<string, RedirectRule>> | null = null

const fetchLookup = async (origin: string): Promise<Map<string, RedirectRule>> => {
  const url = new URL('/api/redirects', origin)
  url.searchParams.set('depth', '2')
  url.searchParams.set('limit', String(MAX_REDIRECTS))
  url.searchParams.set('pagination', 'false')
  // `all` keeps every translated slug on the referenced document, so the
  // destination can use the same language as the incoming URL.
  url.searchParams.set('locale', 'all')

  const response = await fetch(url, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })

  if (!response.ok) throw new Error(`redirect lookup returned ${response.status}`)

  const body = (await response.json()) as { docs?: unknown }
  const docs = Array.isArray(body.docs) ? body.docs : []
  const lookup = new Map<string, RedirectRule>()

  for (const doc of docs) {
    const rule = toRule(doc as RawRedirect)
    if (rule) lookup.set(rule.from, rule)
  }

  return lookup
}

const getLookup = async (origin: string): Promise<Map<string, RedirectRule>> => {
  if (cache && cache.expiresAt > Date.now()) return cache.lookup
  if (pending) return pending

  pending = fetchLookup(origin)
    .then((lookup) => {
      cache = { expiresAt: Date.now() + CACHE_TTL_MS, lookup }

      return lookup
    })
    .catch((error: unknown) => {
      // A failed refresh must never break the site. Keep the last good table
      // when there is one; otherwise behave as "no redirects configured".
      console.warn('[redirects] lookup failed:', error)
      const lookup = cache?.lookup ?? new Map<string, RedirectRule>()
      cache = { expiresAt: Date.now() + CACHE_TTL_MS, lookup }

      return lookup
    })
    .finally(() => {
      pending = null
    })

  return pending
}

/**
 * A `from` value may carry the locale prefix (`/ar/articles/old`). An
 * unprefixed value applies to every locale, so the same rule is checked
 * against the path with the prefix stripped.
 */
const candidates = (normalized: string): { locale: Locale | null; path: string }[] => {
  const segments = normalized.split('/').filter(Boolean)
  const maybeLocale = segments[0]

  if (!isLocale(maybeLocale)) return [{ locale: null, path: normalized }]

  const withoutLocale = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '/'

  return [
    { locale: maybeLocale, path: normalized },
    { locale: maybeLocale, path: withoutLocale },
  ]
}

const destinationFor = (rule: RedirectRule, locale: Locale | null): string | null => {
  if (rule.target.kind === 'custom') {
    const { url } = rule.target

    return /^https?:\/\//i.test(url) || url.startsWith('/') ? url : `/${url}`
  }

  const { collection, slugs } = rule.target.reference
  const base = COLLECTION_PATHS[collection]
  if (!base) return null

  const requested = locale ?? routing.defaultLocale
  // Fall back to the default locale when the target has no translation for
  // the requested language; the article/category/region lookup is
  // locale-strict, so cross-linking an Arabic slug under /fr would 404.
  const targetLocale = slugs[requested] ? requested : routing.defaultLocale
  const slug = slugs[targetLocale]

  if (!slug) return null

  return `/${targetLocale}${base}/${encodeURIComponent(slug)}`
}

export const findRedirect = async (
  pathname: string,
  origin: string,
): Promise<RedirectMatch | null> => {
  const normalized = normalizePath(pathname)
  const lookup = await getLookup(origin)

  if (lookup.size === 0) return null

  for (const candidate of candidates(normalized)) {
    const rule = lookup.get(candidate.path)
    if (!rule) continue

    const destination = destinationFor(rule, candidate.locale)
    if (destination) return { destination, status: rule.status }
  }

  return null
}

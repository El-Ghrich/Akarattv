import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const loadRedirects = async () => import('@/shared/lib/redirects')

const ORIGIN = 'https://akarattv.example'

const response = (docs: unknown[], ok = true) => ({
  ok,
  json: async () => ({ docs }),
})

const customRule = (from: string, url: string, type: number = 301) => ({
  from,
  to: { type: 'custom', url },
  type,
})

const referenceRule = (from: string, slugs: Record<string, string>, type: number = 301) => ({
  from,
  to: {
    type: 'reference',
    reference: { relationTo: 'articles', value: { slug: slugs } },
  },
  type,
})

beforeEach(() => {
  vi.resetModules()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-01T12:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('normalizePath', () => {
  it('strips origins, queries and hashes', async () => {
    const { normalizePath } = await loadRedirects()

    expect(normalizePath('https://Example.com/fr/articles/old?x=1#section')).toBe('/fr/articles/old')
    expect(normalizePath('/fr/articles/old///')).toBe('/fr/articles/old')
    expect(normalizePath('  /fr/articles/old  ')).toBe('/fr/articles/old')
    expect(normalizePath('articles/old')).toBe('/articles/old')
    expect(normalizePath('')).toBe('/')
    expect(normalizePath('/')).toBe('/')
  })

  it('decodes escapes but keeps malformed ones raw', async () => {
    const { normalizePath } = await loadRedirects()

    expect(normalizePath('/ar/categories/%D8%B3%D9%83%D9%86')).toBe('/ar/categories/سكن')
    expect(normalizePath('/ar/categories/%E0%A4%A')).toBe('/ar/categories/%E0%A4%A')
  })
})

describe('findRedirect', () => {
  it('matches a normalized custom rule and prepends a slash to relative destinations', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response([customRule(' /ar/articles/old/ ', 'new/path')])),
    )
    const { findRedirect } = await loadRedirects()

    expect(await findRedirect('/ar/articles/old?utm=1', ORIGIN)).toEqual({
      destination: '/new/path',
      status: 301,
    })
  })

  it('keeps absolute destinations and custom statuses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response([customRule('/old-article', 'https://elsewhere.example/new', 308)])),
    )
    const { findRedirect } = await loadRedirects()

    expect(await findRedirect('/old-article', ORIGIN)).toEqual({
      destination: 'https://elsewhere.example/new',
      status: 308,
    })
  })

  it('uses the same-language slug for a localized reference', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        response([referenceRule('/articles/ancien', { ar: 'قديم', fr: 'ancien' }, 302)]),
      ),
    )
    const { findRedirect } = await loadRedirects()

    expect(await findRedirect('/fr/articles/ancien', ORIGIN)).toEqual({
      destination: '/fr/articles/ancien',
      status: 302,
    })
    expect(await findRedirect('/ar/articles/ancien', ORIGIN)).toEqual({
      destination: '/ar/articles/%D9%82%D8%AF%D9%8A%D9%85',
      status: 302,
    })
  })

  it('falls back to the default locale when the requested slug is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response([referenceRule('/articles/old', { ar: 'قديم' })])),
    )
    const { findRedirect } = await loadRedirects()

    expect(await findRedirect('/fr/articles/old', ORIGIN)).toEqual({
      destination: '/ar/articles/%D9%82%D8%AF%D9%8A%D9%85',
      status: 301,
    })
  })

  it('applies unprefixed rules to any locale but not to unknown prefixes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(response([customRule('/articles/old', '/articles/new')])),
    )
    const { findRedirect } = await loadRedirects()

    expect((await findRedirect('/fr/articles/old', ORIGIN))?.destination).toBe('/articles/new')
    expect(await findRedirect('/es/articles/old', ORIGIN)).toBe(null)
  })

  it('ignores malformed rules and normalizes invalid statuses to 301', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      response([
        { from: '   ', to: { type: 'custom', url: '/x' } },
        { from: '/no-target', to: null },
        { from: '/empty', to: { type: 'custom', url: '  ' } },
        { from: '/bad-reference', to: { type: 'reference', reference: { relationTo: 'users', value: { slug: 'x' } } } },
        { from: '/no-slug', to: { type: 'reference', reference: { relationTo: 'articles', value: {} } } },
        customRule('/bad-status', '/new', 999),
      ]),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { findRedirect } = await loadRedirects()

    expect(await findRedirect('/bad-status', ORIGIN)).toEqual({ destination: '/new', status: 301 })
    for (const path of ['/no-target', '/empty', '/bad-reference', '/no-slug']) {
      expect(await findRedirect(path, ORIGIN)).toBe(null)
    }
  })

  it('returns null and keeps an empty table when the lookup fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fetchMock = vi.fn().mockResolvedValue(response([], false))
    vi.stubGlobal('fetch', fetchMock)
    const { findRedirect } = await loadRedirects()

    expect(await findRedirect('/whatever', ORIGIN)).toBe(null)
    expect(warn).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('serves stale rules immediately and refreshes in the background', async () => {
    let calls = 0
    const fetchMock = vi.fn().mockImplementation(() => {
      calls += 1
      return Promise.resolve(response(calls === 1 ? [customRule('/old', '/first')] : [customRule('/old', '/second')]))
    })
    vi.stubGlobal('fetch', fetchMock)
    const { findRedirect } = await loadRedirects()

    expect((await findRedirect('/old', ORIGIN))?.destination).toBe('/first')

    vi.setSystemTime(new Date('2026-06-01T12:01:01.000Z'))
    const waitUntil = vi.fn()
    expect((await findRedirect('/old', ORIGIN, waitUntil))?.destination).toBe('/first')
    expect(waitUntil).toHaveBeenCalledOnce()
    await Promise.all(waitUntil.mock.calls.map(([promise]) => promise as Promise<unknown>))
    expect((await findRedirect('/old', ORIGIN))?.destination).toBe('/second')
  })
})

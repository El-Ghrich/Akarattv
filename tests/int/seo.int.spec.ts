import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/i18n/navigation', () => ({
  getPathname: vi.fn(({ href, locale }: { href: string; locale: string }) => `/${locale}${href}`),
}))

import { getPathname } from '@/i18n/navigation'
import {
  absoluteURL,
  alternateLanguages,
  breadcrumbJsonLd,
  homeLanguages,
  infoPageJsonLd,
  mediaURL,
  newsArticleJsonLd,
  openGraphLocale,
  organizationJsonLd,
  siteDescription,
  siteName,
  siteURL,
  websiteJsonLd,
} from '@/features/seo/lib/seo'

const SITE = 'https://akarattv.example'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SERVER_URL', `${SITE}/`)
  vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '')
  vi.stubEnv('VERCEL_URL', '')
  vi.mocked(getPathname).mockClear()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

const media = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 1,
    alt: '',
    url: '/media/original.jpg',
    sizes: {
      medium: { url: '/media/medium.jpg' },
      large: { url: '/media/large.jpg' },
    },
    ...overrides,
  }) as never

describe('siteURL / absoluteURL', () => {
  it('strips a trailing slash from the configured origin', () => {
    expect(siteURL()).toBe(SITE)
  })

  it('falls back to localhost when no origin is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')

    expect(siteURL()).toBe('http://localhost:3000')
  })

  it('leaves absolute URLs untouched and qualifies relative ones', () => {
    expect(absoluteURL('https://external.example/x')).toBe('https://external.example/x')
    expect(absoluteURL('/ar/articles/x')).toBe(`${SITE}/ar/articles/x`)
    expect(absoluteURL('ar/articles/x')).toBe(`${SITE}/ar/articles/x`)
  })

  it('reads localized site copy', () => {
    expect(siteName('ar').length).toBeGreaterThan(0)
    expect(siteName('fr').length).toBeGreaterThan(0)
    expect(siteDescription('ar').length).toBeGreaterThan(0)
    expect(siteDescription('fr').length).toBeGreaterThan(0)
  })
})

describe('mediaURL', () => {
  it('prefers the largest generated variant and qualifies its URL', () => {
    expect(mediaURL(media())).toBe(`${SITE}/media/large.jpg`)
    expect(mediaURL(media({ sizes: { medium: { url: '/media/medium.jpg' } } }))).toBe(
      `${SITE}/media/medium.jpg`,
    )
    expect(mediaURL(media({ sizes: {} }))).toBe(`${SITE}/media/original.jpg`)
  })

  it('returns undefined for unpopulated or empty media', () => {
    expect(mediaURL(null)).toBe(undefined)
    expect(mediaURL(12)).toBe(undefined)
    expect(mediaURL(media({ url: null, sizes: {} }))).toBe(undefined)
  })
})

describe('alternateLanguages', () => {
  it('returns nothing when fewer than two translations exist', () => {
    expect(alternateLanguages([])).toBe(undefined)
    expect(alternateLanguages([{ locale: 'ar', href: '/articles/x' }, { locale: 'fr', href: null }])).toBe(
      undefined,
    )
  })

  it('maps every translated locale and adds an x-default for the default locale', () => {
    expect(
      alternateLanguages([
        { locale: 'fr', href: '/articles/x' },
        { locale: 'ar', href: '/articles/x' },
      ]),
    ).toEqual({
      ar: '/ar/articles/x',
      fr: '/fr/articles/x',
      'x-default': '/ar/articles/x',
    })
    expect(getPathname).toHaveBeenCalledTimes(3)
  })

  it('omits x-default when only non-default locales are translated', () => {
    const result = alternateLanguages([
      { locale: 'fr', href: '/articles/x' },
      { locale: 'fr', href: '/articles/y' },
    ])

    expect(result).not.toHaveProperty('x-default')
  })

  it('provides both locale homepages', () => {
    expect(homeLanguages()).toEqual({ 'x-default': '/ar', ar: '/ar', fr: '/fr' })
    expect(openGraphLocale('ar')).toBe('ar_MA')
    expect(openGraphLocale('fr')).toBe('fr_MA')
  })
})

describe('JSON-LD builders', () => {
  it('builds an organization with an absolute logo', () => {
    expect(organizationJsonLd()).toMatchObject({
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/akarattv-white.png` },
    })
  })

  it('builds a locale-specific website with a publisher reference', () => {
    expect(websiteJsonLd('fr')).toMatchObject({
      '@type': 'WebSite',
      '@id': `${SITE}/#website-fr`,
      inLanguage: 'fr',
      url: `${SITE}/fr`,
      publisher: { '@id': `${SITE}/#organization` },
    })
  })

  it('numbers breadcrumb items and qualifies their URLs', () => {
    expect(
      breadcrumbJsonLd([
        { name: 'Accueil', path: '/fr' },
        { name: 'Immobilier', path: '/fr/categories/immobilier' },
      ]),
    ).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, name: 'Accueil', item: `${SITE}/fr` },
        { position: 2, name: 'Immobilier', item: `${SITE}/fr/categories/immobilier` },
      ],
    })
  })

  it('uses schema.org language codes on info pages', () => {
    const input = {
      dateModified: '2026-01-01T00:00:00Z',
      description: 'Description',
      locale: 'ar' as const,
      path: '/ar/about',
      title: 'من نحن',
      type: 'AboutPage' as const,
    }

    expect(infoPageJsonLd(input)).toMatchObject({
      '@type': 'AboutPage',
      '@id': `${SITE}/ar/about#webpage`,
      inLanguage: 'ar-MA',
      isPartOf: { '@id': `${SITE}/#website-ar` },
      publisher: { '@id': `${SITE}/#organization` },
    })
  })

  it('includes populated article relationships only', () => {
    const article = {
      title: 'Titre',
      excerpt: '',
      publishedAt: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z',
      author: 3,
      category: { id: 4, title: 'Immobilier' },
      heroImage: media(),
    } as never

    const jsonLd = newsArticleJsonLd(article, 'fr', '/articles/test')
    expect(jsonLd).toMatchObject({
      '@type': 'NewsArticle',
      '@id': `${SITE}/fr/articles/test#article`,
      inLanguage: 'fr-MA',
      articleSection: 'Immobilier',
      datePublished: '2026-01-01T00:00:00Z',
      image: [`${SITE}/media/large.jpg`],
      author: undefined,
    })
    expect(jsonLd.description).toBe(undefined)

    const populated = newsArticleJsonLd(
      {
        ...(article as object),
        author: { id: 3, name: 'Jean', jobTitle: '' },
        heroImage: 9,
      } as never,
      'ar',
      '/articles/test',
    )
    expect(populated.author).toEqual([{ '@type': 'Person', name: 'Jean' }])
    expect(populated.image).toBe(undefined)
  })
})

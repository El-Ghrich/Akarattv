import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { payloadMock } = vi.hoisted(() => ({ payloadMock: { getPayload: vi.fn() } }))

vi.mock('payload', () => payloadMock)
vi.mock('@/payload.config', () => ({ default: {} }))
vi.mock('@/features/seo/lib/seo', () => ({
  absoluteURL: (path: string) =>
    `https://akarattv.example${path.startsWith('/') ? path : `/${path}`}`,
  siteDescription: (locale: string) => (locale === 'ar' ? 'وصف الموقع' : 'Site description'),
  siteName: (locale: string) => (locale === 'ar' ? 'عقارات تيفي' : 'Akarat TV'),
}))

import {
  buildNewsSitemap,
  buildRssFeed,
  findCategory,
  getFeedArticles,
  getNewsArticles,
  xmlEscape,
} from '@/features/seo/lib/feeds'

const SITE = 'https://akarattv.example'

const article = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 1,
    slug: 'un-article',
    title: 'Un <titre> & "titre"',
    excerpt: 'Extrait, avec & et <',
    publishedAt: '2026-05-01T10:00:00.000Z',
    createdAt: '2026-05-01T09:00:00.000Z',
    category: null,
    heroImage: null,
    ...overrides,
  }) as never

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-01T12:00:00.000Z'))
  payloadMock.getPayload.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('xmlEscape', () => {
  it('escapes the five XML special characters', () => {
    expect(xmlEscape(`<>&'" &amp;`)).toBe('&lt;&gt;&amp;&apos;&quot; &amp;amp;')
  })

  it('leaves ordinary text unchanged', () => {
    expect(xmlEscape('عقارات Immobilier 123')).toBe('عقارات Immobilier 123')
  })
})

describe('buildRssFeed', () => {
  it('builds a localized channel with escaped items and absolute links', () => {
    const feed = buildRssFeed([article()], { locale: 'fr' })

    expect(feed).toContain('<language>fr-MA</language>')
    expect(feed).toContain(`<link>${SITE}/fr</link>`)
    expect(feed).toContain(`rel="self" type="application/rss+xml"`)
    expect(feed).toContain(`<title>Un &lt;titre&gt; &amp; &quot;titre&quot;</title>`)
    expect(feed).toContain(`<link>${SITE}/fr/articles/un-article</link>`)
    expect(feed).toContain('<description>Extrait, avec &amp; et &lt;</description>')
    expect(feed).toContain('Fri, 01 May 2026 10:00:00 GMT')
    expect(feed).toContain('Mon, 01 Jun 2026 12:00:00 GMT')
  })

  it('skips articles without a slug', () => {
    const feed = buildRssFeed([article({ slug: null }), article({ id: 2, slug: 'second' })], {
      locale: 'fr',
    })

    expect(feed.match(/<item>/g)).toHaveLength(1)
    expect(feed).toContain('/fr/articles/second')
  })

  it('uses category title, description and section when present', () => {
    const category = {
      id: 7,
      slug: 'immobilier',
      title: 'Immobilier & <maisons>',
      description: 'Catégorie dédiée',
    } as never
    const feed = buildRssFeed(
      [article({ category })],
      { locale: 'fr', category },
    )

    expect(feed).toContain('<title>Immobilier &amp; &lt;maisons&gt; — Akarat TV</title>')
    expect(feed).toContain('<description>Catégorie dédiée</description>')
    expect(feed).toContain(`<link>${SITE}/fr/categories/immobilier</link>`)
    expect(feed).toContain('<category>Immobilier &amp; &lt;maisons&gt;</category>')
    expect(feed).toContain(`${SITE}/fr/categories/immobilier/rss.xml`)
  })

  it('adds an enclosure with the largest available image', () => {
    const feed = buildRssFeed(
      [
        article({
          heroImage: {
            id: 5,
            url: '/original.jpg',
            sizes: { medium: { url: '/medium.jpg' }, large: { url: '/large.jpg' } },
          },
        }),
      ],
      { locale: 'ar' },
    )

    expect(feed).toContain(`<enclosure url="${SITE}/large.jpg" type="image/jpeg" length="0" />`)
    expect(feed).toContain('<language>ar-MA</language>')
  })

  it('omits a section tag when the category relationship is not populated', () => {
    const feed = buildRssFeed([article({ category: 7 })], { locale: 'fr' })

    expect(feed).not.toContain('<category>')
  })
})

describe('buildNewsSitemap', () => {
  it('includes only stories with slugs and escapes their titles', () => {
    const sitemap = buildNewsSitemap([
      {
        locale: 'fr',
        articles: [
          { title: 'Titre & <important>', slug: 'bon', publishedAt: '2026-06-01T10:00:00.000Z' },
          { title: 'Sans slug', slug: null, publishedAt: '2026-06-01T10:00:00.000Z' },
          { title: 'Sans date', slug: 'sans-date', publishedAt: null },
        ],
      },
      { locale: 'ar', articles: [{ title: 'عنوان', slug: 'slug', publishedAt: null }] },
    ])

    expect(sitemap.match(/<url>/g)).toHaveLength(3)
    expect(sitemap).toContain(`<loc>${SITE}/fr/articles/bon</loc>`)
    expect(sitemap).toContain('<news:title>Titre &amp; &lt;important&gt;</news:title>')
    expect(sitemap).toContain('<news:language>fr</news:language>')
    expect(sitemap).toContain('<news:publication_date>2026-06-01T10:00:00.000Z</news:publication_date>')
    expect(sitemap).toContain('2026-06-01T12:00:00.000Z')
    expect(sitemap).not.toContain('Sans slug')
  })

  it('renders an empty urlset when there are no groups', () => {
    expect(buildNewsSitemap([])).not.toContain('<url>')
  })
})

describe('feed queries', () => {
  it('finds a category strictly in the requested locale', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [{ id: 1 }] })
    payloadMock.getPayload.mockResolvedValue({ find })

    expect(await findCategory('immobilier', 'fr')).toEqual({ id: 1 })
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'categories',
        fallbackLocale: false,
        locale: 'fr',
        where: { slug: { equals: 'immobilier' } },
      }),
    )
  })

  it('queries published articles, optionally filtered by category', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [article()] })
    payloadMock.getPayload.mockResolvedValue({ find })

    await getFeedArticles('ar', 7)
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'articles',
        locale: 'ar',
        limit: 40,
        sort: '-publishedAt',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { category: { equals: 7 } },
          ],
        },
      }),
    )

    await getFeedArticles('fr')
    expect(find.mock.calls[1]?.[0].where.and).toHaveLength(1)
  })

  it('limits the news sitemap to articles from the last 48 hours', async () => {
    const find = vi.fn().mockResolvedValue({ docs: [] })
    payloadMock.getPayload.mockResolvedValue({ find })

    await getNewsArticles('fr')

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 1000,
        select: { publishedAt: true, slug: true, title: true },
        where: {
          and: [
            { _status: { equals: 'published' } },
            {
              publishedAt: {
                greater_than_equal: new Date(NOW_MINUS_48H).toISOString(),
              },
            },
          ],
        },
      }),
    )
  })
})

const NOW_MINUS_48H = new Date('2026-05-30T12:00:00.000Z').getTime()

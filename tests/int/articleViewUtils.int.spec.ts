import { describe, expect, it } from 'vitest'

import {
  articleColumnClass,
  articleHref,
  getArticleLayout,
  isDoc,
} from '@/features/articles/components/ArticleView/utils'

const teaser = (id: number, slug?: string | null) => ({ id, slug: slug ?? null }) as never

const article = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 10,
    category: 1,
    heroImage: 2,
    relatedArticles: [],
    ...overrides,
  }) as never

describe('isDoc', () => {
  it('accepts objects and rejects primitives and null', () => {
    expect(isDoc({ id: 1 })).toBe(true)
    expect(isDoc(null)).toBe(false)
    expect(isDoc(undefined)).toBe(false)
    expect(isDoc(1)).toBe(false)
    expect(isDoc('doc')).toBe(false)
  })
})

describe('articleHref', () => {
  it('encodes a slug when one is available', () => {
    expect(articleHref('ar', teaser(1, 'سكن/اقتصادي'))).toBe(
      '/ar/articles/%D8%B3%D9%83%D9%86%2F%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%D9%8A',
    )
  })

  it('falls back to the id when the slug is missing', () => {
    expect(articleHref('fr', teaser(42, null))).toBe('/fr/articles/42')
    expect(articleHref('fr', teaser(0))).toBe('/fr/articles/0')
  })
})

describe('getArticleLayout', () => {
  it('keeps only populated category and hero image relationships', () => {
    const layout = getArticleLayout(article(), [], [], false)
    expect(layout.category).toBe(null)
    expect(layout.heroImage).toBe(null)

    const category = { id: 1, title: 'Immobilier' }
    const heroImage = { id: 2, url: '/hero.jpg' }
    const populated = getArticleLayout(article({ category, heroImage }), [], [], false)
    expect(populated.category).toBe(category)
    expect(populated.heroImage).toBe(heroImage)
  })

  it('excludes the current article from latest and caps it at five items', () => {
    const latest = Array.from({ length: 7 }, (_, index) => teaser(index + 10))
    const layout = getArticleLayout(article(), latest, [], false)

    expect(layout.latestItems.map((item) => item.id)).toEqual([11, 12, 13, 14, 15])
    expect(layout.hasLatest).toBe(true)
    expect(layout.hasRightRail).toBe(true)
  })

  it('deduplicates related articles by id and prefers explicit relations', () => {
    const layout = getArticleLayout(
      article({
        relatedArticles: [teaser(11), teaser(10), 'invalid', teaser(11), teaser(12)],
      }),
      [teaser(12), teaser(13), teaser(14), teaser(15)],
      [],
      true,
    )

    expect(layout.relatedItems.map((item) => item.id)).toEqual([11, 12, 13])
  })

  it('caps related articles at three', () => {
    const layout = getArticleLayout(
      article({ relatedArticles: [1, 2, 3, 4, 5].map((id) => teaser(id)) }),
      [],
      [],
      false,
    )
    expect(layout.relatedItems).toHaveLength(3)
  })

  it('keeps the right rail for ad slots even without latest articles', () => {
    expect(getArticleLayout(article(), [], [], false).hasRightRail).toBe(false)
    expect(getArticleLayout(article(), [], [], true).hasRightRail).toBe(true)
  })

  it('derives the table-of-contents flag from headings', () => {
    expect(getArticleLayout(article(), [], [], false).hasToc).toBe(false)
    expect(getArticleLayout(article(), [], [{ id: 'section-1' }], false).hasToc).toBe(true)
  })
})

describe('articleColumnClass', () => {
  it('prioritizes the toc, then the rail, then full width', () => {
    expect(articleColumnClass({ hasToc: true, hasRightRail: true })).toBe('lg:col-span-6')
    expect(articleColumnClass({ hasToc: false, hasRightRail: true })).toBe('lg:col-span-9')
    expect(articleColumnClass({ hasToc: false, hasRightRail: false })).toBe('lg:col-span-12')
  })
})

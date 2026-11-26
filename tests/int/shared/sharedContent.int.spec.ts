import { describe, expect, it } from 'vitest'

import {
  articleImage,
  categoryID,
  categoryLinks,
  groupedCategoryLinks,
  orderedCategories,
  prioritizeRegions,
  regionLinks,
  toHomeCard,
} from '@/shared/lib/content/shared'
import { HOUSING_LABEL, PRIORITY_REGION_SLUGS } from '@/shared/lib/content/constants'
import type { Category, Region } from '@/payload-types'

const category = (id: number, slug: string, homepageOrder?: number) =>
  ({
    id,
    slug,
    title: `Catégorie ${id}`,
    ...(homepageOrder === undefined ? {} : { homepageOrder }),
  }) as unknown as Category

const region = (id: number, slug: string) =>
  ({ id, slug, name: `Région ${id}` }) as unknown as Region

const article = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 1,
    slug: 'un-article',
    title: 'Un titre',
    excerpt: '',
    category: null,
    heroImage: null,
    publishedAt: null,
    createdAt: null,
    content: null,
    ...overrides,
  }) as never

describe('categoryID', () => {
  it('reads a populated relationship, a raw id or nothing', () => {
    expect(categoryID(article({ category: { id: 7, slug: 'x' } }))).toBe(7)
    expect(categoryID(article({ category: 3 }))).toBe(3)
    expect(categoryID(article({ category: null }))).toBe(null)
    expect(categoryID(article())).toBe(null)
  })
})

describe('articleImage', () => {
  it('prefers the medium variant over the original URL', () => {
    expect(
      articleImage(
        article({
          heroImage: {
            alt: 'Photo',
            url: '/original.jpg',
            sizes: { medium: { url: '/medium.jpg' } },
          },
        }),
      ),
    ).toEqual({ alt: 'Photo', src: '/medium.jpg' })
  })

  it('falls back to the original URL and the article title as alt', () => {
    expect(articleImage(article({ heroImage: { alt: '', url: '/original.jpg' } }))).toEqual({
      alt: 'Un titre',
      src: '/original.jpg',
    })
  })

  it('returns no source for a missing or unpopulated image', () => {
    expect(articleImage(article())).toEqual({ alt: 'Un titre', src: undefined })
    expect(articleImage(article({ heroImage: 12 }))).toEqual({ alt: 'Un titre', src: undefined })
  })
})

describe('toHomeCard', () => {
  it('uses a populated category over the lookup map', () => {
    const card = toHomeCard(
      article({ category: { id: 1, title: 'Populated', slug: 'populated' } }),
      'fr',
      new Map([[1, category(1, 'fallback')]]),
    )

    expect(card.category).toBe('Populated')
    expect(card.href).toBe('/articles/un-article')
    expect(card.title).toBe('Un titre')
    expect(card.cta).toBe("Lire l'article")
    expect(card.excerpt).toBe(undefined)
  })

  it('resolves a numeric category through the map', () => {
    expect(toHomeCard(article({ category: 5 }), 'fr', new Map([[5, category(5, 'x')]])).category).toBe(
      'Catégorie 5',
    )
    expect(toHomeCard(article({ category: 5 }), 'fr').category).toBe('')
  })

  it('localizes the call to action and reading label', () => {
    const card = toHomeCard(article(), 'ar')
    expect(card.cta).toBe('اقرأ المقال')
    expect(card.meta).toContain('قراءة: 1 د')
    expect(toHomeCard(article(), 'fr').meta).toContain('Lecture : 1 min')
  })

  it('encodes an Arabic slug in the href', () => {
    expect(toHomeCard(article({ slug: 'سكن/اقتصادي' }), 'ar').href).toBe(
      '/articles/%D8%B3%D9%83%D9%86%2F%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%D9%8A',
    )
  })
})

describe('orderedCategories / categoryLinks', () => {
  it('sorts by explicit order then id without mutating the input', () => {
    const categories = [category(3, 'c'), category(1, 'a', 2), category(2, 'b', 0)]

    expect(orderedCategories(categories).map((item) => item.id)).toEqual([2, 1, 3])
    expect(categories.map((item) => item.id)).toEqual([3, 1, 2])
  })

  it('breaks ties by id', () => {
    const categories = [category(9, 'nine', 1), category(2, 'two', 1), category(4, 'four', 1)]
    expect(orderedCategories(categories).map((item) => item.id)).toEqual([2, 4, 9])
  })

  it('encodes slugs in links', () => {
    expect(categoryLinks([category(1, 'logement haut standing')])).toEqual([
      { href: '/categories/logement%20haut%20standing', label: 'Catégorie 1' },
    ])
  })
})

describe('groupedCategoryLinks', () => {
  it('groups housing links under one localized dropdown at the first housing position', () => {
    const categories = [
      category(1, 'immobilier'),
      category(2, 'logement-economique'),
      category(3, 'logement-haut-standing'),
      category(4, 'autre'),
    ]

    expect(groupedCategoryLinks(categories, 'fr')).toEqual([
      { href: '/categories/immobilier', label: 'Catégorie 1' },
      {
        children: [
          { href: '/categories/logement-economique', label: 'Catégorie 2' },
          { href: '/categories/logement-haut-standing', label: 'Catégorie 3' },
        ],
        href: '/categories/logement-economique',
        label: HOUSING_LABEL.fr,
      },
      { href: '/categories/autre', label: 'Catégorie 4' },
    ])
  })

  it('groups Arabic housing slugs too', () => {
    const links = groupedCategoryLinks(
      [category(1, 'سكن-اقتصادي'), category(2, 'سكن-عالي')],
      'ar',
    )

    expect(links).toHaveLength(1)
    expect(links[0]?.label).toBe(HOUSING_LABEL.ar)
    expect(links[0]?.children).toHaveLength(2)
  })

  it('leaves the list untouched when there are no housing links', () => {
    const categories = [category(2, 'z'), category(1, 'a')]
    expect(groupedCategoryLinks(categories, 'fr')).toEqual(categoryLinks(categories))
  })
})

describe('prioritizeRegions / regionLinks', () => {
  it('leads with priority regions in priority order, then remaining regions by id', () => {
    const regions = [
      region(20, 'fes-meknes'),
      region(10, 'casablanca-settat'),
      region(30, 'tanger-tetouan-al-hoceima'),
      region(5, 'other-region'),
      region(6, 'another-region'),
    ]

    expect(prioritizeRegions(regions).map((item) => item.id)).toEqual([10, 30, 20, 5, 6])
    expect(PRIORITY_REGION_SLUGS).toContain('casablanca-settat')
  })

  it('skips missing priority regions', () => {
    expect(prioritizeRegions([region(1, 'unknown')]).map((item) => item.id)).toEqual([1])
  })

  it('encodes region slugs in links', () => {
    expect(regionLinks([region(1, 'rabat sale')])).toEqual([
      { href: '/regions/rabat%20sale', label: 'Région 1' },
    ])
  })
})

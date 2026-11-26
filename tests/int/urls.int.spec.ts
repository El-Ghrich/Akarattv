import { describe, expect, it } from 'vitest'

import {
  articleHref,
  articlePath,
  categoryHref,
  categoryPath,
  decodeSlug,
  regionHref,
  regionPath,
} from '@/shared/lib/urls'

describe('url helpers', () => {
  it('encodes localized slugs in every path builder', () => {
    expect(articlePath('سكن-اقتصادي')).toBe('/articles/%D8%B3%D9%83%D9%86-%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%D9%8A')
    expect(categoryPath('logement haut standing')).toBe('/categories/logement%20haut%20standing')
    expect(regionPath('casablanca/settat')).toBe('/regions/casablanca%2Fsettat')
  })

  it('prefixes locale in href builders', () => {
    expect(articleHref('ar', 'عقارات')).toBe(`/ar${articlePath('عقارات')}`)
    expect(categoryHref('fr', 'immobilier')).toBe('/fr/categories/immobilier')
    expect(regionHref('fr', 'rabat')).toBe('/fr/regions/rabat')
  })

  it('round-trips a slug through encode/decode', () => {
    const slug = 'سكن/متوسط & حديث'
    expect(decodeSlug(articlePath(slug).slice('/articles/'.length))).toBe(slug)
  })

  it('returns the raw value for malformed percent escapes', () => {
    expect(decodeSlug('%E0%A4%A')).toBe('%E0%A4%A')
    expect(decodeSlug('%')).toBe('%')
    expect(decodeSlug('%%20')).toBe('%%20')
  })

  it('decodes an already plain slug unchanged', () => {
    expect(decodeSlug(' Plain-slug_1 ')).toBe(' Plain-slug_1 ')
    expect(decodeSlug('')).toBe('')
  })
})

import { describe, expect, it } from 'vitest'

import { localeFromPathname, notFoundContent } from '@/features/not-found/content/notFound'

describe('localeFromPathname', () => {
  it('detects French only for a locale-prefixed path', () => {
    expect(localeFromPathname('/fr')).toBe('fr')
    expect(localeFromPathname('/fr/')).toBe('fr')
    expect(localeFromPathname('/fr/articles/old')).toBe('fr')
  })

  it('falls back to Arabic for null, Arabic and unknown paths', () => {
    for (const value of [null, '', '/', '/ar', '/ar/articles/test', '/france', '/en/about', '/fr?x=1']) {
      expect(localeFromPathname(value)).toBe('ar')
    }
  })
})

describe('notFoundContent', () => {
  it('defines the same fields in both locales', () => {
    expect(Object.keys(notFoundContent.ar).sort()).toEqual(Object.keys(notFoundContent.fr).sort())
    expect(Object.keys(notFoundContent.ar).length).toBeGreaterThan(10)
  })

  it('offers four localized suggestions with valid internal hrefs', () => {
    for (const locale of ['ar', 'fr'] as const) {
      const { suggestions } = notFoundContent[locale]
      expect(suggestions).toHaveLength(4)
      expect(new Set(suggestions.map((item) => item.icon)).size).toBe(4)

      for (const suggestion of suggestions) {
        expect(suggestion.href.startsWith('/')).toBe(true)
        expect(suggestion.label.length).toBeGreaterThan(0)
        expect(suggestion.description.length).toBeGreaterThan(0)
      }
    }
  })

  it('has distinct copy in Arabic and French', () => {
    expect(notFoundContent.ar.title).not.toBe(notFoundContent.fr.title)
    expect(notFoundContent.ar.helpTitle).not.toBe(notFoundContent.fr.helpTitle)
    expect(notFoundContent.ar.readInOther).not.toBe(notFoundContent.fr.readInOther)
  })
})

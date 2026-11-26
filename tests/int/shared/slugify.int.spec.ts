import { describe, expect, it } from 'vitest'

import { slugify } from '@/shared/lib/slugify'

describe('slugify', () => {
  it('returns an empty string for non-string input', () => {
    for (const value of [null, undefined, 42, {}, ['slug'], true]) {
      expect(slugify(value)).toBe('')
    }
  })

  it('lowercases and strips Latin diacritics', () => {
    expect(slugify('Économie Immobilière')).toBe('economie-immobiliere')
    expect(slugify('Crédit À La Consommation')).toBe('credit-a-la-consommation')
  })

  it('preserves Arabic letters and numbers', () => {
    expect(slugify('السكن الاقتصادي 2')).toBe('السكن-الاقتصادي-2')
    expect(slugify('عقارات-تيفي')).toBe('عقارات-تيفي')
  })

  it('collapses mixed whitespace and punctuation into one hyphen', () => {
    expect(slugify('  Hello,   world!!  ')).toBe('hello-world')
    expect(slugify('a---b / c__d')).toBe('a-b-c-d')
    expect(slugify('a\t\nb')).toBe('a-b')
  })

  it('trims leading and trailing separators', () => {
    expect(slugify('!!! slug ???')).toBe('slug')
    expect(slugify('---')).toBe('')
    expect(slugify('   ')).toBe('')
  })

  it('drops emoji and symbol-only values', () => {
    expect(slugify('🏠💥')).toBe('')
    expect(slugify('prix €/m²')).toBe('prix-m2')
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  formatArticleDate,
  formatRelativeArticleDate,
  getArticleHeadings,
  getReadingTime,
} from '@/features/articles/lib/article'

const doc = (children: unknown[]) => ({ root: { children, type: 'root' } }) as never
const heading = (tag: string, text: string) => ({
  type: 'heading',
  tag,
  children: [{ text }],
})
const paragraph = (text: string) => ({ type: 'paragraph', children: [{ text }] })
const words = (count: number) => Array.from({ length: count }, (_, i) => `mot${i}`).join(' ')

const NOW = new Date('2026-06-01T12:00:00.000Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getArticleHeadings', () => {
  it('returns an empty list for missing or malformed content', () => {
    expect(getArticleHeadings(null)).toEqual([])
    expect(getArticleHeadings(undefined)).toEqual([])
    expect(getArticleHeadings({} as never)).toEqual([])
    expect(getArticleHeadings(doc([paragraph('texte')]))).toEqual([])
  })

  it('keeps h2/h3 with sequential ids based on every heading', () => {
    const content = doc([
      heading('h2', 'Premier'),
      paragraph('texte'),
      heading('h4', 'Sous-titre ignoré'),
      heading('h3', 'Deuxième'),
      heading('h5', 'Autre sous-titre ignoré'),
      heading('h2', 'Troisième'),
    ])

    expect(getArticleHeadings(content)).toEqual([
      { id: 'section-1', level: 2, text: 'Premier' },
      { id: 'section-3', level: 3, text: 'Deuxième' },
      { id: 'section-5', level: 2, text: 'Troisième' },
    ])
  })

  it('skips headings with no text but still advances the anchor counter', () => {
    const content = doc([
      heading('h2', '   '),
      { type: 'heading', tag: 'h3', children: [{ text: '' }] },
      heading('h2', 'Visible'),
    ])

    expect(getArticleHeadings(content)).toEqual([
      { id: 'section-3', level: 2, text: 'Visible' },
    ])
  })

  it('joins nested text children and trims the label', () => {
    const content = doc([
      {
        type: 'heading',
        tag: 'h2',
        children: [{ text: '  Sous ' }, { text: 'section' }, { children: [{ text: ' éditée' }] }],
      },
    ])

    expect(getArticleHeadings(content)[0]?.text).toBe('Sous section éditée')
  })
})

describe('getReadingTime', () => {
  it('never returns less than one minute', () => {
    expect(getReadingTime(null, 'fr')).toBe(1)
    expect(getReadingTime(doc([]), 'ar')).toBe(1)
    expect(getReadingTime(doc([paragraph('   ')]), 'fr')).toBe(1)
  })

  it('uses 210 words per minute in French and 190 in Arabic', () => {
    expect(getReadingTime(doc([paragraph(words(210))]), 'fr')).toBe(1)
    expect(getReadingTime(doc([paragraph(words(211))]), 'fr')).toBe(2)
    expect(getReadingTime(doc([paragraph(words(190))]), 'ar')).toBe(1)
    expect(getReadingTime(doc([paragraph(words(191))]), 'ar')).toBe(2)
  })

  it('counts words spread across multiple paragraphs', () => {
    expect(getReadingTime(doc([paragraph(words(105)), paragraph(words(106))]), 'fr')).toBe(2)
  })
})

describe('formatArticleDate', () => {
  it('returns null for absent or invalid dates', () => {
    expect(formatArticleDate(null, 'fr')).toBe(null)
    expect(formatArticleDate(undefined, 'ar')).toBe(null)
    expect(formatArticleDate('', 'fr')).toBe(null)
    expect(formatArticleDate('not-a-date', 'fr')).toBe(null)
  })

  it('formats a date with day, month and year for both locales', () => {
    for (const locale of ['ar', 'fr'] as const) {
      const formatted = formatArticleDate('2024-01-15T12:00:00.000Z', locale)
      expect(formatted).toContain('2024')
      expect(formatted?.length).toBeGreaterThan(5)
    }
  })

  it('appends the Casablanca time when requested', () => {
    const value = '2024-01-15T12:00:00.000Z'
    const plain = formatArticleDate(value, 'fr')
    const withTime = formatArticleDate(value, 'fr', true)

    expect(withTime).not.toBe(plain)
    expect(withTime).toMatch(/ \([^)]*\d{2}:\d{2}[^)]*\)$/)
    expect(withTime?.startsWith(plain ?? '')).toBe(true)
  })
})

describe('formatRelativeArticleDate', () => {
  const at = (minutesAgo: number) => new Date(NOW.getTime() - minutesAgo * 60_000).toISOString()

  it('returns null for absent or invalid dates', () => {
    expect(formatRelativeArticleDate(null, 'fr')).toBe(null)
    expect(formatRelativeArticleDate('invalid', 'ar')).toBe(null)
  })

  it('uses relative labels below seven days', () => {
    for (const minutesAgo of [0, 30, 59, 60, 300, 1440, 10_000]) {
      const value = at(minutesAgo)
      expect(formatRelativeArticleDate(value, 'fr', NOW.getTime())).not.toBe(
        formatArticleDate(value, 'fr'),
      )
    }
  })

  it('switches to the absolute date at exactly seven days', () => {
    const value = at(7 * 24 * 60)
    expect(formatRelativeArticleDate(value, 'fr', NOW.getTime())).toBe(
      formatArticleDate(value, 'fr'),
    )
  })

  it('handles future dates with relative labels and then absolute dates', () => {
    const soon = new Date(NOW.getTime() + 30 * 60_000).toISOString()
    expect(formatRelativeArticleDate(soon, 'ar', NOW.getTime())).not.toBe(
      formatArticleDate(soon, 'ar'),
    )

    const later = new Date(NOW.getTime() + 8 * 24 * 60 * 60_000).toISOString()
    expect(formatRelativeArticleDate(later, 'ar', NOW.getTime())).toBe(
      formatArticleDate(later, 'ar'),
    )
  })

  it('uses the injected now instead of the real clock', () => {
    const value = '2026-06-01T11:30:00.000Z'
    expect(formatRelativeArticleDate(value, 'fr', NOW.getTime())).not.toBe(
      formatArticleDate(value, 'fr'),
    )
    expect(formatRelativeArticleDate(value, 'fr', NOW.getTime() + 8 * 86_400_000)).toBe(
      formatArticleDate(value, 'fr'),
    )
  })
})

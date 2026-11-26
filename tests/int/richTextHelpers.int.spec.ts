import { defaultColors } from '@payloadcms/richtext-lexical'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import {
  articleHref,
  asMedia,
  dir,
  image,
  infoBoxLabel,
  relatedLabel,
  textColor,
  youtubeId,
} from '@/features/articles/components/RichText/helpers'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('articleHref', () => {
  it('prefers a populated slug and encodes it', () => {
    expect(articleHref({ id: 1, slug: 'سكن/اقتصادي' }, 'ar')).toBe(
      '/ar/articles/%D8%B3%D9%83%D9%86%2F%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF%D9%8A',
    )
  })

  it('uses a raw id when a populated document has no slug', () => {
    expect(articleHref({ id: 42, slug: null }, 'fr')).toBe('/fr/articles/42')
    expect(articleHref({ id: 0 }, 'fr')).toBe('/fr/articles/0')
  })

  it('encodes primitive references', () => {
    expect(articleHref(7, 'fr')).toBe('/fr/articles/7')
    expect(articleHref('old slug', 'ar')).toBe('/ar/articles/old%20slug')
  })

  it('falls back to a hash for unusable references', () => {
    expect(articleHref(null, 'fr')).toBe('#')
    expect(articleHref(undefined, 'fr')).toBe('#')
    expect(articleHref({}, 'fr')).toBe('#')
    expect(articleHref(false, 'fr')).toBe('#')
  })
})

describe('asMedia / image', () => {
  it('accepts objects only', () => {
    expect(asMedia({ url: '/x' })).toEqual({ url: '/x' })
    expect(asMedia(null)).toBe(null)
    expect(asMedia(3)).toBe(null)
    expect(asMedia('media')).toBe(null)
  })

  it('renders nothing without a URL', () => {
    expect(image({ alt: 'x' } as never, 'alt')).toBe(null)
    expect(image({ url: '' } as never, 'alt')).toBe(null)
  })

  it('renders a figure with fallback 4:3 dimensions and an optional caption', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

    await act(async () => {
      root.render(image({ url: '/media/x.jpg' } as never, 'Alt text', 'Légende'))
    })

    expect(container.querySelector('figure')?.getAttribute('dir')).toBe('auto')
    expect(container.querySelector('figcaption')?.textContent).toBe('Légende')
    const img = container.querySelector('img')
    expect(img?.getAttribute('alt')).toBe('Alt text')
    expect(img?.getAttribute('width')).toBe('1200')
    expect(img?.getAttribute('height')).toBe('900')

    await act(async () => {
      root.unmount()
    })
  })
})

describe('youtubeId', () => {
  it('extracts ids from supported URLs', () => {
    expect(youtubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('returns null for missing or invalid values', () => {
    for (const value of [undefined, null, '', 'not a url', 'https://example.com/video']) {
      expect(youtubeId(value)).toBe(null)
    }
  })
})

describe('labels and direction', () => {
  it('defers direction to the browser', () => {
    expect(dir({ direction: 'rtl' })).toBe('auto')
    expect(dir({ direction: 'ltr' })).toBe('auto')
    expect(dir({})).toBe('auto')
  })

  it('has localized info-box and related-article labels', () => {
    for (const variant of ['info', 'tip', 'warning'] as const) {
      expect(infoBoxLabel[variant].ar.length).toBeGreaterThan(0)
      expect(infoBoxLabel[variant].fr.length).toBeGreaterThan(0)
    }
    expect(relatedLabel.ar).not.toBe(relatedLabel.fr)
  })
})

describe('textColor', () => {
  it('resolves a known palette entry to its CSS color', () => {
    const palette = defaultColors.text as Record<string, { css?: { color?: string } }>
    const [name, entry] = Object.entries(palette).find(([, value]) => value?.css?.color) ?? []

    expect(name).toBeDefined()
    expect(textColor({ color: name })).toBe(entry?.css?.color)
  })

  it('returns undefined for missing or unknown colors', () => {
    expect(textColor({})).toBe(undefined)
    expect(textColor({ color: 12 })).toBe(undefined)
    expect(textColor({ color: 'not-a-palette-entry' })).toBe(undefined)
  })
})

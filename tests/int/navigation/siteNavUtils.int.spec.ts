import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  closeOnNavigate,
  isCurrent,
  isRtl,
  normalize,
  positionDropdown,
} from '@/features/navigation/components/SiteHeader/siteNavUtils'

const link = (href: string, children?: { href: string }[]) => ({ href, children }) as never

const setupDropdown = (rect: Partial<DOMRect>, width: number, height: number) => {
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  summary.textContent = 'Logement'
  summary.getBoundingClientRect = () => ({ ...rect }) as DOMRect
  const panel = document.createElement('div')
  panel.className = 'site-nav-dropdown'
  Object.defineProperties(panel, {
    offsetWidth: { configurable: true, value: width },
    offsetHeight: { configurable: true, value: height },
  })
  details.append(summary, panel)
  document.body.append(details)

  return { details, panel, summary }
}

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
  vi.restoreAllMocks()
})

describe('normalize', () => {
  it('decodes percent-encoded hrefs', () => {
    expect(normalize('/ar/categories/%D8%B3%D9%83%D9%86')).toBe('/ar/categories/سكن')
    expect(normalize('/fr/categories/logement%20economique')).toBe('/fr/categories/logement economique')
  })

  it('returns malformed and plain values unchanged', () => {
    expect(normalize('/ar/categories/%E0%A4%A')).toBe('/ar/categories/%E0%A4%A')
    expect(normalize('/fr/about')).toBe('/fr/about')
  })
})

describe('isCurrent', () => {
  it('matches the item itself, decoded', () => {
    expect(isCurrent(link('/ar/categories/%D8%B3%D9%83%D9%86'), '/ar/categories/سكن')).toBe(true)
    expect(isCurrent(link('/fr/about'), '/fr/about')).toBe(true)
    expect(isCurrent(link('/fr/about'), '/fr/contact')).toBe(false)
  })

  it('matches a child href for grouped links', () => {
    const item = link('/fr/categories/logement', [
      { href: '/fr/categories/logement-economique' },
      { href: '/fr/categories/logement-haut-standing' },
    ])

    expect(isCurrent(item, '/fr/categories/logement-haut-standing')).toBe(true)
    expect(isCurrent(item, '/fr/categories/immobilier')).toBe(false)
  })
})

describe('isRtl', () => {
  it('reads the document direction', () => {
    expect(isRtl()).toBe(false)
    document.documentElement.dir = 'rtl'
    expect(isRtl()).toBe(true)
    document.documentElement.dir = 'ltr'
    expect(isRtl()).toBe(false)
  })
})

describe('positionDropdown', () => {
  it('positions an LTR panel below the trigger, clamped to the viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1000 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 800 })
    const { details, panel } = setupDropdown(
      { bottom: 100, left: 900, right: 950, top: 60 },
      200,
      100,
    )

    positionDropdown(details)

    expect(panel.style.top).toBe('112px')
    expect(panel.style.bottom).toBe('auto')
    expect(panel.style.left).toBe('784px')
    expect(panel.style.right).toBe('auto')
  })

  it('keeps a minimum gutter for a wide panel', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 500 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 800 })
    const { details, panel } = setupDropdown(
      { bottom: 100, left: 3, right: 50, top: 60 },
      600,
      100,
    )

    positionDropdown(details)

    expect(panel.style.left).toBe('16px')
  })

  it('anchors an RTL panel to the right of the trigger', () => {
    document.documentElement.dir = 'rtl'
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1000 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 800 })
    const { details, panel } = setupDropdown(
      { bottom: 100, left: 100, right: 200, top: 60 },
      200,
      100,
    )

    positionDropdown(details)

    expect(panel.style.right).toBe('784px')
    expect(panel.style.left).toBe('auto')
  })

  it('flips the panel above the trigger near the viewport bottom', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1000 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 400 })
    const { details, panel } = setupDropdown(
      { bottom: 350, left: 100, right: 200, top: 300 },
      200,
      100,
    )

    positionDropdown(details)

    expect(panel.style.top).toBe('auto')
    expect(panel.style.bottom).toBe('112px')
  })

  it('does nothing when the panel or summary is missing', () => {
    const empty = document.createElement('details')
    expect(() => positionDropdown(empty)).not.toThrow()

    const noPanel = document.createElement('details')
    noPanel.append(document.createElement('summary'))
    expect(() => positionDropdown(noPanel)).not.toThrow()
  })
})

describe('closeOnNavigate', () => {
  it('closes every open details ancestor of the clicked link', () => {
    const outer = document.createElement('details')
    outer.open = true
    const inner = document.createElement('details')
    inner.open = true
    const anchor = document.createElement('a')
    inner.append(anchor)
    outer.append(inner)
    document.body.append(outer)

    closeOnNavigate({ currentTarget: anchor } as never)

    expect(outer.open).toBe(false)
    expect(inner.open).toBe(false)
  })
})

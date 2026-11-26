import { describe, expect, it } from 'vitest'

import { adSlotKeys, adSlots, getAdSlot } from '@/features/ads/content/adsRegistry'

describe('ad slot registry', () => {
  it('exposes stable, unique keys', () => {
    expect(adSlotKeys).toEqual([
      'top-banner',
      'in-article-1',
      'article-end',
      'sidebar',
      'home-between-sections',
      'mobile-bottom-bar',
      'popup',
    ])
    expect(new Set(adSlotKeys).size).toBe(adSlotKeys.length)
    for (const key of adSlotKeys) expect(adSlots[key].key).toBe(key)
  })

  it('gets a slot by key', () => {
    expect(getAdSlot('popup')).toBe(adSlots.popup)
    expect(getAdSlot('sidebar')).toBe(adSlots.sidebar)
  })

  it('uploads creatives at twice the largest display width', () => {
    for (const key of adSlotKeys) {
      const slot = adSlots[key]
      const widths = [slot.display.desktop, slot.display.mobile]
        .filter((config) => config !== 'hidden')
        .map((config) => ('width' in config ? config.width : 0))

      expect(slot.minUploadWidth).toBe(2 * Math.max(...widths))
    }
  })

  it('hides the sidebar on mobile and the bottom bar on desktop', () => {
    expect(adSlots.sidebar.display.mobile).toBe('hidden')
    expect(adSlots['mobile-bottom-bar'].display.desktop).toBe('hidden')
  })

  it('keeps popup rules consistent with the eligibility planner', () => {
    const { placement } = adSlots.popup

    expect(placement.minPageviewsInSession).toBe(2)
    expect(placement.alternativeTrigger).toEqual({ seconds: 20, scrollPercent: 50 })
    expect(placement.frequency).toBe('once-per-session')
    expect(placement.dismissalCooldownHours).toBe(24)
    expect(placement.waitForConsentDecision).toBe(true)
    expect(placement.previewQueryKeys).toEqual(['preview', 'draft', 'vercel-preview'])
    for (const route of ['/admin', '/preview', '/privacy', '/terms', '/editorial-policy']) {
      expect(placement.excludedRoutes).toContain(route)
    }
  })

  it('provides all three locale labels for every slot', () => {
    for (const key of adSlotKeys) {
      expect(Object.keys(adSlots[key].label).sort()).toEqual(['ar', 'en', 'fr'])
      for (const label of Object.values(adSlots[key].label)) expect(label.length).toBeGreaterThan(0)
    }
  })
})

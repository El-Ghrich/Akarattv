import { describe, expect, it } from 'vitest'

import { getAdSlot } from '@/content/adsRegistry'
import { getPopupEligibility, type AdEligibilityInput } from '@/utilities/adEligibility'

const rules = getAdSlot('popup').placement

const base: AdEligibilityInput = {
  consent: 'granted',
  consentReady: true,
  dismissedAt: null,
  now: 1_000_000,
  pageviewsInSession: 2,
  pathname: '/ar/articles/test',
  queryKeys: [],
  rules,
  shownThisSession: false,
  trigger: { elapsedMs: 21_000, scrollPercent: 0 },
}

const check = (overrides: Partial<AdEligibilityInput> = {}) =>
  getPopupEligibility({ ...base, ...overrides })

describe('getPopupEligibility', () => {
  it('allows display after the time trigger', () => {
    expect(check()).toEqual({ eligible: true, reason: 'eligible' })
  })

  it('allows display after the scroll trigger', () => {
    expect(check({ trigger: { elapsedMs: 0, scrollPercent: 55 } }).eligible).toBe(true)
  })

  it('waits for either trigger', () => {
    expect(check({ trigger: { elapsedMs: 5_000, scrollPercent: 10 } })).toEqual({
      eligible: false,
      reason: 'waiting-for-trigger',
    })
  })

  it('never fires on the first page view of a session', () => {
    expect(check({ pageviewsInSession: 1 }).reason).toBe('first-pageview')
  })

  it('waits for a consent decision but accepts either answer', () => {
    expect(check({ consent: null, consentReady: false }).reason).toBe('awaiting-consent')
    expect(check({ consent: 'denied', consentReady: true }).eligible).toBe(true)
  })

  it('honours preview and draft query keys', () => {
    expect(check({ queryKeys: ['preview'] }).reason).toBe('preview-mode')
    expect(check({ queryKeys: ['draft'] }).reason).toBe('preview-mode')
  })

  it('excludes admin and legal routes in both locales', () => {
    expect(check({ pathname: '/admin/users' }).reason).toBe('excluded-route')
    expect(check({ pathname: '/fr/privacy' }).reason).toBe('excluded-route')
    expect(check({ pathname: '/ar/editorial-policy' }).reason).toBe('excluded-route')
  })

  it('does not repeat within a session', () => {
    expect(check({ shownThisSession: true }).reason).toBe('already-shown')
  })

  it('applies the 24 hour dismissal cooldown', () => {
    expect(check({ dismissedAt: base.now - 23 * 60 * 60 * 1000 }).reason).toBe(
      'dismissal-cooldown',
    )
    expect(check({ dismissedAt: base.now - 25 * 60 * 60 * 1000 }).eligible).toBe(true)
  })
})

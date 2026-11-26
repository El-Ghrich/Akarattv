import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  DISMISSED_KEY,
  PAGEVIEWS_KEY,
  SHOWN_KEY,
  parseStoredNumber,
  safeRead,
  safeWrite,
} from '@/features/ads/components/AdPopup/storage'

afterEach(() => {
  vi.restoreAllMocks()
  window.localStorage.clear()
  window.sessionStorage.clear()
})

describe('storage keys', () => {
  it('uses distinct, namespaced keys', () => {
    expect(new Set([PAGEVIEWS_KEY, SHOWN_KEY, DISMISSED_KEY]).size).toBe(3)
    for (const key of [PAGEVIEWS_KEY, SHOWN_KEY, DISMISSED_KEY]) {
      expect(key.startsWith('akarat-ad-popup-')).toBe(true)
    }
  })
})

describe('safeRead / safeWrite', () => {
  it('reads and writes both storage areas', () => {
    safeWrite('localStorage', PAGEVIEWS_KEY, '3')
    safeWrite('sessionStorage', SHOWN_KEY, '1')

    expect(safeRead('localStorage', PAGEVIEWS_KEY)).toBe('3')
    expect(safeRead('sessionStorage', SHOWN_KEY)).toBe('1')
  })

  it('returns null for missing values', () => {
    expect(safeRead('localStorage', 'missing')).toBe(null)
  })

  it('swallows storage access errors', () => {
    const thrower = {
      getItem: () => {
        throw new DOMException('blocked', 'SecurityError')
      },
      setItem: () => {
        throw new DOMException('blocked', 'SecurityError')
      },
    }
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(thrower as unknown as Storage)

    expect(safeRead('localStorage', PAGEVIEWS_KEY)).toBe(null)
    expect(() => safeWrite('localStorage', PAGEVIEWS_KEY, '3')).not.toThrow()
  })
})

describe('parseStoredNumber', () => {
  it('parses numeric strings including zero and negatives', () => {
    expect(parseStoredNumber('0')).toBe(0)
    expect(parseStoredNumber('12.5')).toBe(12.5)
    expect(parseStoredNumber('-3')).toBe(-3)
    expect(parseStoredNumber(' 42 ')).toBe(42)
  })

  it('maps missing and non-finite values to null', () => {
    expect(parseStoredNumber(null)).toBe(null)
    expect(parseStoredNumber('')).toBe(0)
    expect(parseStoredNumber('abc')).toBe(null)
    expect(parseStoredNumber('Infinity')).toBe(null)
    expect(parseStoredNumber('NaN')).toBe(null)
  })
})

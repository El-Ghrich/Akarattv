import { describe, expect, it } from 'vitest'

import { describeDisplay, displayValues, maxWidthValue, normalizeDisplay, ratioOf } from '@/features/ads/lib/adDisplay'

describe('normalizeDisplay', () => {
  it('normalizes the hidden sentinel to an empty config', () => {
    expect(normalizeDisplay('hidden')).toEqual({})
  })

  it('passes a normal config through unchanged', () => {
    const config = { width: 300, height: 250, maxWidth: 300 } as const
    expect(normalizeDisplay(config)).toBe(config)
  })
})

describe('maxWidthValue', () => {
  it('turns numbers into pixels and keeps strings', () => {
    expect(maxWidthValue(320)).toBe('320px')
    expect(maxWidthValue(0)).toBe('0px')
    expect(maxWidthValue('calc(100vw - 32px)')).toBe('calc(100vw - 32px)')
  })

  it('defaults to full width', () => {
    expect(maxWidthValue(undefined)).toBe('100%')
  })
})

describe('ratioOf', () => {
  it('prefers an explicit aspect ratio', () => {
    expect(ratioOf({ aspectRatio: '4 / 5', width: 400, height: 500 })).toBe('4 / 5')
  })

  it('derives a ratio from both dimensions', () => {
    expect(ratioOf({ width: 970, height: 90 })).toBe('970 / 90')
  })

  it('falls back to auto when a dimension is missing or zero', () => {
    expect(ratioOf({ width: 300 })).toBe('auto')
    expect(ratioOf({ height: 250 })).toBe('auto')
    expect(ratioOf({ width: 0, height: 250 })).toBe('auto')
    expect(ratioOf({})).toBe('auto')
  })
})

describe('describeDisplay', () => {
  it('describes hidden, sized and capped breakpoints', () => {
    expect(describeDisplay('hidden')).toBe('hidden')
    expect(describeDisplay({ width: 300, height: 250 })).toBe('300×250')
    expect(describeDisplay({ width: 300, height: 250, maxWidth: 300 })).toBe('300×250 max 300px')
    expect(describeDisplay({ aspectRatio: '4 / 5', maxWidth: 'calc(100vw - 32px)' })).toBe(
      '4 / 5 max calc(100vw - 32px)',
    )
  })
})

describe('displayValues', () => {
  it('returns CSS custom properties for a normal slot', () => {
    expect(displayValues({ width: 400, height: 500, aspectRatio: '4 / 5', maxWidth: 400 })).toEqual({
      max: '400px',
      ratio: '4 / 5',
    })
  })

  it('uses safe values for a hidden slot', () => {
    expect(displayValues('hidden')).toEqual({ max: '100%', ratio: 'auto' })
  })

  it('keeps a responsive max width', () => {
    expect(displayValues({ aspectRatio: '4 / 5', maxWidth: 'calc(100vw - 32px)' })).toEqual({
      max: 'calc(100vw - 32px)',
      ratio: '4 / 5',
    })
  })
})

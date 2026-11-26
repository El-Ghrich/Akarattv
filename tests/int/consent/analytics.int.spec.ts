import { afterEach, describe, expect, it, vi } from 'vitest'

const loadAnalytics = async () => {
  vi.resetModules()

  return import('@/features/consent/lib/analytics')
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('analytics configuration', () => {
  it('enables analytics for a canonical GTM id', async () => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', 'GTM-5XDQXCPG')

    const { analyticsEnabled, gtmContainerId } = await loadAnalytics()
    expect(gtmContainerId).toBe('GTM-5XDQXCPG')
    expect(analyticsEnabled).toBe(true)
  })

  it('trims whitespace around a valid id', async () => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', '  GTM-ABC123  ')

    expect((await loadAnalytics()).gtmContainerId).toBe('GTM-ABC123')
  })

  it('disables analytics for empty, malformed or lowercase ids', async () => {
    for (const value of ['', 'gtm-abc123', 'GTM-', 'GTM-ABC_123', 'GTM-ABC 123', 'UA-123']) {
      vi.stubEnv('NEXT_PUBLIC_GTM_ID', value)
      const { analyticsEnabled, gtmContainerId } = await loadAnalytics()

      expect(gtmContainerId).toBe(null)
      expect(analyticsEnabled).toBe(false)
    }
  })

  it('disables analytics when the variable is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', undefined)

    expect((await loadAnalytics()).analyticsEnabled).toBe(false)
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

const loadFlag = async (): Promise<boolean> => {
  vi.resetModules()
  const module = await import('@/features/ads/lib/adsDebug')

  return module.adsDebugEnabled
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('adsDebugEnabled', () => {
  it('is off when the flag is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_ADS_DEBUG', '')

    expect(await loadFlag()).toBe(false)
  })

  it('turns on for an explicit local opt-in', async () => {
    vi.stubEnv('NEXT_PUBLIC_ADS_DEBUG', '1')

    expect(await loadFlag()).toBe(true)
  })

  it('is hard-disabled on Vercel production even when opted in', async () => {
    vi.stubEnv('NEXT_PUBLIC_ADS_DEBUG', 'true')
    vi.stubEnv('VERCEL', '1')
    vi.stubEnv('VERCEL_ENV', 'production')

    expect(await loadFlag()).toBe(false)
  })
})

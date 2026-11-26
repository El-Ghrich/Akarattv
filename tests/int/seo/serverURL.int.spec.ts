import { afterEach, describe, expect, it, vi } from 'vitest'

import { getServerURL } from '@/features/seo/lib/serverURL'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getServerURL', () => {
  it('prefers the explicit server URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://akarattv.example')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'project.vercel.app')
    vi.stubEnv('VERCEL_URL', 'preview.vercel.app')

    expect(getServerURL()).toBe('https://akarattv.example')
  })

  it('uses the Vercel production URL before the deployment URL', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'project.vercel.app')
    vi.stubEnv('VERCEL_URL', 'preview.vercel.app')

    expect(getServerURL()).toBe('https://project.vercel.app')
  })

  it('falls back to the per-deployment URL with an https scheme', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', undefined)
    vi.stubEnv('VERCEL_URL', 'preview.vercel.app')

    expect(getServerURL()).toBe('https://preview.vercel.app')
  })

  it('falls back when the production URL is set to an empty string', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '')
    vi.stubEnv('VERCEL_URL', 'preview.vercel.app')

    expect(getServerURL()).toBe('https://preview.vercel.app')
  })

  it('returns undefined when nothing is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '')
    vi.stubEnv('VERCEL_URL', '')

    expect(getServerURL()).toBe(undefined)
  })
})

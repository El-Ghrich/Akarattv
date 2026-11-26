import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ConsentContext,
  readConsentCookie,
  useConsent,
  writeConsentCookie,
  type ConsentContextValue,
} from '@/features/consent/components/ConsentProvider/context'

const clearCookies = () => {
  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0]?.trim()
    if (name) document.cookie = `${name}=; Path=/; Max-Age=0`
  }
}

beforeEach(() => {
  clearCookies()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  clearCookies()
})

describe('readConsentCookie', () => {
  it('reads a recorded decision', () => {
    document.cookie = 'akarat-consent=granted; Path=/'
    expect(readConsentCookie()).toBe('granted')

    document.cookie = 'akarat-consent=denied; Path=/'
    expect(readConsentCookie()).toBe('denied')
  })

  it('ignores unrelated, malformed and invalid cookies', () => {
    expect(readConsentCookie()).toBe(null)

    document.cookie = 'other=1; Path=/'
    expect(readConsentCookie()).toBe(null)

    document.cookie = 'akarat-consent=maybe; Path=/'
    expect(readConsentCookie()).toBe(null)
  })

  it('reads the decision when it is not the first cookie', () => {
    document.cookie = 'theme=dark; Path=/'
    document.cookie = 'akarat-consent=granted; Path=/'
    expect(readConsentCookie()).toBe('granted')
  })
})

describe('writeConsentCookie', () => {
  it('writes a six-month, same-site cookie', () => {
    writeConsentCookie('granted')

    expect(readConsentCookie()).toBe('granted')
    expect(document.cookie).toContain('akarat-consent=granted')
  })

  it('adds the Secure flag on https pages', () => {
    vi.stubGlobal('window', { location: { protocol: 'https:' } })

    expect(() => writeConsentCookie('denied')).not.toThrow()
    expect(readConsentCookie()).toBe('denied')
  })

  it('does not add the Secure flag on http pages', () => {
    vi.stubGlobal('window', { location: { protocol: 'http:' } })

    expect(() => writeConsentCookie('denied')).not.toThrow()
  })
})

const renderConsentProbe = async (value?: ConsentContextValue) => {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  let captured: ConsentContextValue | undefined
  let thrown: unknown

  function Probe() {
    captured = useConsent()

    return null
  }

  const element = value
    ? createElement(ConsentContext.Provider, { value }, createElement(Probe))
    : createElement(Probe)

  try {
    await act(async () => {
      root.render(element)
    })
  } catch (error) {
    thrown = error
  }

  return {
    captured,
    thrown,
    unmount: () => act(() => root.unmount()),
  }
}

describe('useConsent', () => {
  it('throws outside a provider', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { thrown, unmount } = await renderConsentProbe()

    expect(thrown).toBeInstanceOf(Error)
    expect((thrown as Error).message).toMatch(/ConsentProvider/)
    unmount()
  })

  it('returns the provided value', async () => {
    const value: ConsentContextValue = {
      consent: 'granted',
      isReady: true,
      analyticsEnabled: true,
      settingsOpen: false,
      acceptAnalytics: () => {},
      rejectAnalytics: () => {},
      openSettings: () => {},
      closeSettings: () => {},
    }

    const { captured, thrown, unmount } = await renderConsentProbe(value)

    expect(thrown).toBe(undefined)
    expect(captured).toBe(value)
    expect(captured?.consent).toBe('granted')
    unmount()
  })
})

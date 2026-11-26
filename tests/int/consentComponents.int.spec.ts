import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/i18n/navigation', async () => {
  const { createElement } = await import('react')

  return {
    Link: ({ children, href, ...rest }: { children?: unknown; href: string }) =>
      createElement('a', { href, ...rest }, children as never),
  }
})

import { consentContent } from '@/features/consent/content/consent'
import { ConsentBanner } from '@/features/consent/components/ConsentProvider/ConsentBanner'
import { ConsentPreferences } from '@/features/consent/components/ConsentProvider/ConsentPreferences'

let container: HTMLDivElement
let root: Root

const render = async (element: Parameters<Root['render']>[0]) => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)

  await act(async () => {
    root.render(element)
  })
}

const buttonWithText = (text: string) =>
  Array.from(container.querySelectorAll('button')).find((button) => button.textContent?.includes(text))

const click = (element: Element) => {
  act(() => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
}

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(async () => {
  await act(async () => {
    root.unmount()
  })
  container.remove()
})

describe('ConsentBanner', () => {
  it('saves an explicit accept or reject decision', async () => {
    const save = vi.fn()
    const copy = consentContent.fr.banner
    await render(createElement(ConsentBanner, { locale: 'fr', openSettings: vi.fn(), save }))

    const accept = buttonWithText(copy.accept)
    const reject = buttonWithText(copy.reject)
    expect(accept).toBeDefined()
    expect(reject).toBeDefined()

    click(accept as Element)
    expect(save).toHaveBeenCalledWith('granted')

    click(reject as Element)
    expect(save).toHaveBeenCalledWith('denied')
  })

  it('opens settings and links to the privacy page', async () => {
    const openSettings = vi.fn()
    const copy = consentContent.fr.banner
    await render(
      createElement(ConsentBanner, { locale: 'fr', openSettings, save: vi.fn() }),
    )

    click(buttonWithText(copy.settings) as Element)
    expect(openSettings).toHaveBeenCalledOnce()

    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/privacy')
    expect(link?.textContent).toBe(copy.privacyLabel)
  })

  it('renders Arabic copy without changing the button behaviour', async () => {
    const save = vi.fn()
    const copy = consentContent.ar.banner
    await render(createElement(ConsentBanner, { locale: 'ar', openSettings: vi.fn(), save }))

    expect(container.textContent).toContain(copy.title)
    click(buttonWithText(copy.accept) as Element)
    expect(save).toHaveBeenCalledWith('granted')
  })
})

describe('ConsentPreferences', () => {
  it('defaults to denied and saves the selected draft', async () => {
    const save = vi.fn()
    const copy = consentContent.fr.preferences
    await render(
      createElement(ConsentPreferences, {
        locale: 'fr',
        consent: null,
        closeSettings: vi.fn(),
        save,
      }),
    )

    expect(buttonWithText(copy.reject)?.getAttribute('aria-pressed')).toBe('true')
    expect(buttonWithText(copy.accept)?.getAttribute('aria-pressed')).toBe('false')

    click(buttonWithText(copy.accept) as Element)
    expect(buttonWithText(copy.accept)?.getAttribute('aria-pressed')).toBe('true')
    expect(buttonWithText(copy.reject)?.getAttribute('aria-pressed')).toBe('false')

    click(buttonWithText(copy.save) as Element)
    expect(save).toHaveBeenCalledWith('granted')
  })

  it('seeds the draft from an existing decision', async () => {
    await render(
      createElement(ConsentPreferences, {
        locale: 'fr',
        consent: 'granted',
        closeSettings: vi.fn(),
        save: vi.fn(),
      }),
    )

    expect(buttonWithText(consentContent.fr.preferences.accept)?.getAttribute('aria-pressed')).toBe('true')
  })

  it('closes from both close buttons and focuses the panel on mount', async () => {
    const closeSettings = vi.fn()
    await render(
      createElement(ConsentPreferences, {
        locale: 'fr',
        consent: null,
        closeSettings,
        save: vi.fn(),
      }),
    )

    const panel = container.querySelector('[role="dialog"]') as HTMLDivElement
    expect(document.activeElement).toBe(panel)

    const closes = Array.from(container.querySelectorAll('button')).filter(
      (button) =>
        button.getAttribute('aria-label') === consentContent.fr.preferences.close ||
        button.textContent?.includes(consentContent.fr.preferences.close),
    )
    expect(closes.length).toBeGreaterThanOrEqual(2)
    for (const button of closes) click(button)
    expect(closeSettings).toHaveBeenCalledTimes(closes.length)
  })
})

import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PopupDialog } from '@/features/ads/components/AdPopup/PopupDialog'

let container: HTMLDivElement
let root: Root
let unmounted = false

const render = async (locale: 'ar' | 'fr', onClose: () => void) => {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)

  await act(async () => {
    root.render(createElement(PopupDialog, { locale, onClose }))
  })
}

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  document.body.style.overflow = ''
  unmounted = false
})

afterEach(async () => {
  if (root && !unmounted) {
    await act(async () => {
      root.unmount()
    })
  }
  container?.remove()
})

describe('PopupDialog', () => {
  it('renders an accessible localized dialog and locks body scroll', async () => {
    await render('ar', vi.fn())

    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('dir')).toBe('rtl')
    expect(dialog?.getAttribute('lang')).toBe('ar')
    expect(dialog?.getAttribute('aria-labelledby')).toBe('ad-popup-title')
    expect(dialog?.getAttribute('aria-describedby')).toBe('ad-popup-description')
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).toBe(container.querySelector('.ad-popup__close'))
    expect((dialog as HTMLElement).style.getPropertyValue('--ad-mobile-ratio')).toBe('4 / 5')
    expect((dialog as HTMLElement).style.getPropertyValue('--ad-desktop-max')).toBe('400px')
  })

  it('closes on Escape and on a backdrop click, but not inside the dialog', async () => {
    const onClose = vi.fn()
    await render('fr', onClose)

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(onClose).toHaveBeenCalledTimes(1)

    act(() => {
      container.querySelector('.ad-popup')?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })
    expect(onClose).toHaveBeenCalledTimes(2)

    act(() => {
      container.querySelector('.ad-popup__dialog')?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('wraps Tab focus between the first and last focusable elements', async () => {
    await render('fr', vi.fn())
    const dialog = container.querySelector('.ad-popup__dialog') as HTMLElement
    const close = dialog.querySelector('.ad-popup__close') as HTMLButtonElement
    const link = document.createElement('a')
    link.href = '/fr/privacy'
    link.textContent = 'Privacy'
    dialog.append(link)

    act(() => {
      link.focus()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    })
    expect(document.activeElement).toBe(close)

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
    })
    expect(document.activeElement).toBe(link)
  })

  it('restores scroll and focus on unmount', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.append(trigger)
    trigger.focus()

    await render('fr', vi.fn())
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.activeElement).not.toBe(trigger)

    await act(async () => {
      root.unmount()
    })
    unmounted = true
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })
})

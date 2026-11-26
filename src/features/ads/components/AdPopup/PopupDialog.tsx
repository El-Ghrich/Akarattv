'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

import { adsCopy } from '@/features/ads/content/adsCopy'
import { getAdSlot } from '@/features/ads/content/adsRegistry'
import type { Locale } from '@/i18n/routing'
import { displayValues } from '@/features/ads/lib/adDisplay'

export type PopupDialogProps = {
  locale: Locale
  onClose: () => void
}

/**
 * Presentational shell for the debug popup: accessible dialog behaviour only.
 * It is mounted exclusively from `AdPopup` in debug mode, so production never
 * installs its listeners or scroll lock.
 */
export function PopupDialog({ locale, onClose }: PopupDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()

        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previousFocus.current?.focus()
    }
  }, [onClose])

  const definition = getAdSlot('popup')
  const mobile = displayValues(definition.display.mobile)
  const desktop = displayValues(definition.display.desktop)
  const style = {
    '--ad-mobile-max': mobile.max,
    '--ad-mobile-ratio': mobile.ratio,
    '--ad-desktop-max': desktop.max,
    '--ad-desktop-ratio': desktop.ratio,
  } as CSSProperties

  return (
    <div
      className="ad-popup"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        aria-describedby="ad-popup-description"
        aria-labelledby="ad-popup-title"
        aria-modal="true"
        className="ad-popup__dialog"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        lang={locale}
        ref={dialogRef}
        role="dialog"
        style={style}
      >
        <button
          aria-label={adsCopy[locale].close}
          className="ad-popup__close"
          onClick={onClose}
          ref={closeRef}
          type="button"
        >
          ×
        </button>
        <span className="ad-popup__label">{adsCopy[locale].marker}</span>
        <h2 className="ad-popup__title" id="ad-popup-title">
          {definition.label[locale]}
        </h2>
        <p className="ad-popup__description" id="ad-popup-description">
          {adsCopy[locale].debugTitle}
        </p>
        <div className="ad-popup__creative" />
      </div>
    </div>
  )
}

export default PopupDialog

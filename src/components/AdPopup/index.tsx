'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

import { useConsent } from '@/components/ConsentProvider'
import { adsCopy } from '@/content/adsCopy'
import { getAdSlot, type AdDisplayConfig } from '@/content/adsRegistry'
import type { Locale } from '@/i18n/routing'
import { usePathname } from '@/i18n/navigation'
import { getPopupEligibility } from '@/utilities/adEligibility'

const PAGEVIEWS_KEY = 'akarat-ad-popup-pageviews'
const SHOWN_KEY = 'akarat-ad-popup-shown'
const DISMISSED_KEY = 'akarat-ad-popup-dismissed-at'

type StorageArea = 'localStorage' | 'sessionStorage'

/** Storage can throw in private browsing, sandboxed iframes or preview builds. */
const safeRead = (area: StorageArea, key: string): string | null => {
  try {
    return window[area].getItem(key)
  } catch {
    return null
  }
}

const safeWrite = (area: StorageArea, key: string, value: string): void => {
  try {
    window[area].setItem(key, value)
  } catch {
    // Eligibility still works for this page view; the choice just will not
    // survive a reload.
  }
}

const parseStoredNumber = (value: string | null): number | null => {
  if (value === null) return null
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Debug-only popup shell. It contains no ad, no network request and no event
 * tracking. The layout mounts it only when `adsDebugEnabled` is true, so a
 * production render has neither DOM nor listeners from this component.
 */
export function AdPopup({ locale }: { locale: Locale }) {
  const { consent, isReady } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [now, setNow] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [pageviews, setPageviews] = useState(0)
  const [dismissedAt, setDismissedAt] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)

  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const lastPath = useRef<string | null>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setDismissedAt(parseStoredNumber(safeRead('localStorage', DISMISSED_KEY)))
    setShown(safeRead('sessionStorage', SHOWN_KEY) === '1')
  }, [])

  // Live Preview persists across client navigations, so count pathname changes
  // rather than component mounts. The first view is never eligible.
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    const timestamp = Date.now()
    setNow(timestamp)

    const stored = parseStoredNumber(safeRead('sessionStorage', PAGEVIEWS_KEY)) ?? 0
    const next = stored + 1
    safeWrite('sessionStorage', PAGEVIEWS_KEY, String(next))
    setPageviews(next)
  }, [pathname])

  useEffect(() => {
    if (open || shown) return

    const startedAt = Date.now()
    const tick = () => {
      const timestamp = Date.now()
      setNow(timestamp)
      setElapsedMs(timestamp - startedAt)
    }
    const onScroll = () => {
      const documentElement = document.documentElement
      const scrollable = Math.max(0, documentElement.scrollHeight - window.innerHeight)
      setScrollPercent(scrollable === 0 ? 100 : Math.min(100, (window.scrollY / scrollable) * 100))
    }

    tick()
    onScroll()

    const interval = window.setInterval(tick, 1000)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open, shown])

  const close = useCallback(() => {
    setOpen(false)

    const timestamp = Date.now()
    safeWrite('localStorage', DISMISSED_KEY, String(timestamp))
    setDismissedAt(timestamp)
  }, [])

  const queryKeys = useMemo(() => Array.from(searchParams.keys()), [searchParams])

  const decision = useMemo(
    () =>
      getPopupEligibility({
        consent,
        consentReady: isReady,
        dismissedAt,
        now,
        pageviewsInSession: pageviews,
        pathname,
        queryKeys,
        rules: getAdSlot('popup').placement,
        shownThisSession: shown,
        trigger: { elapsedMs, scrollPercent },
      }),
    [
      consent,
      dismissedAt,
      elapsedMs,
      isReady,
      now,
      pageviews,
      pathname,
      queryKeys,
      scrollPercent,
      shown,
    ],
  )

  useEffect(() => {
    if (!decision.eligible || open || shown) return

    setOpen(true)
    setShown(true)
    safeWrite('sessionStorage', SHOWN_KEY, '1')
  }, [decision.eligible, open, shown])

  useEffect(() => {
    if (!open) return

    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()

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
  }, [close, open])

  if (!open) return null

  const definition = getAdSlot('popup')
  const displayValues = (config: AdDisplayConfig) => {
    if (config === 'hidden') return { max: '100%', ratio: 'auto' }

    return {
      max:
        config.maxWidth === undefined
          ? '100%'
          : typeof config.maxWidth === 'number'
            ? `${config.maxWidth}px`
            : config.maxWidth,
      ratio: config.aspectRatio ?? '4 / 5',
    }
  }
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
        if (event.target === event.currentTarget) close()
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
          onClick={close}
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

export default AdPopup

'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useConsent } from '@/features/consent/components/ConsentProvider'
import { getAdSlot } from '@/features/ads/content/adsRegistry'
import { usePathname } from '@/i18n/navigation'
import { getPopupEligibility } from '@/features/ads/lib/adEligibility'

import {
  DISMISSED_KEY,
  PAGEVIEWS_KEY,
  SHOWN_KEY,
  parseStoredNumber,
  safeRead,
  safeWrite,
} from './storage'

/**
 * Eligibility, persistence and triggers for the debug-only popup placeholder.
 * Pure decisions live in `getPopupEligibility`; this hook only supplies the
 * values and the browser side effects. It runs unconditionally so hook order
 * stays stable, even though its consumer renders nothing until `open` is true.
 */
export function usePopupState() {
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

  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    setDismissedAt(parseStoredNumber(safeRead('localStorage', DISMISSED_KEY)))
    setShown(safeRead('sessionStorage', SHOWN_KEY) === '1')
  }, [])

  // Count pathname changes rather than mounts: client navigation keeps the
  // layout alive. The first view of a session is never eligible.
  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    setNow(Date.now())

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

  return { close, open }
}

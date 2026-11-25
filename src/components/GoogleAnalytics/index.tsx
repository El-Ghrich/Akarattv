'use client'

import { GoogleTagManager as NextGoogleTagManager } from '@next/third-parties/google'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

import { useConsent } from '@/components/ConsentProvider'
import { usePathname } from '@/i18n/navigation'
import { gtmContainerId } from '@/utilities/analytics'

/** Paths that must never be measured, even if a container ID is configured. */
const EXCLUDED_PATH_PREFIXES = ['/admin', '/api', '/my-route', '/preview']

/** Payload live preview and draft URLs carry one of these query keys. */
const PREVIEW_QUERY_KEYS = ['preview', 'draft', 'vercel-preview']

const isTrackedRoute = (pathname: string, searchParams: URLSearchParams): boolean => {
  if (PREVIEW_QUERY_KEYS.some((key) => searchParams.has(key))) return false

  return !EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

type AnalyticsStorage = 'granted' | 'denied'

/**
 * Consent Mode v2 has no persistence of its own: the default command is sent
 * from `ConsentModeScript` before GTM loads, and every consent change has to be
 * pushed again on the page where it happens.
 *
 * Ads stay permanently denied — only analytics storage follows the visitor's
 * choice. With `analytics_storage: denied` the GA4 tag inside the container
 * still sends cookieless pings, which Google uses for aggregated measurement
 * and modelling. No analytics cookies are written in that state.
 */
const pushConsentUpdate = (analyticsStorage: AnalyticsStorage): void => {
  const dataLayer = (window.dataLayer ??= [])
  dataLayer.push([
    'consent',
    'update',
    {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: analyticsStorage,
    },
  ])
}

/**
 * Advanced Consent Mode v2 container.
 *
 * GTM is loaded on every public route, not only after consent. That is what
 * allows cookieless visits to be measured: the early `consent default` script
 * keeps all storage denied until a choice is made, then this component pushes
 * `update` on accept/reject/withdrawal. Admin, API and live-preview URLs never
 * mount the tag at all.
 *
 * Page views come from GA4 Enhanced Measurement inside the container, so no
 * manual `page_view` or history tracking is needed here.
 */
export function GoogleAnalytics() {
  const { consent } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPushed = useRef<AnalyticsStorage | null>(null)

  const trackedRoute = useMemo(
    () => isTrackedRoute(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams],
  )

  useEffect(() => {
    if (!trackedRoute || consent === null) return

    const next: AnalyticsStorage = consent === 'granted' ? 'granted' : 'denied'
    if (lastPushed.current === next) return

    pushConsentUpdate(next)
    lastPushed.current = next
  }, [consent, trackedRoute])

  if (!trackedRoute || !gtmContainerId) return null

  return <NextGoogleTagManager gtmId={gtmContainerId} />
}

export default GoogleAnalytics

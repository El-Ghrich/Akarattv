'use client'

import { GoogleTagManager as NextGoogleTagManager } from '@next/third-parties/google'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

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

type ConsentMode = 'default' | 'update'
type AnalyticsStorage = 'granted' | 'denied'

/**
 * Push a Consent Mode v2 command onto the same dataLayer the GTM tag uses. Ads
 * stay permanently denied — only analytics is toggled.
 */
const pushConsent = (mode: ConsentMode, analyticsStorage: AnalyticsStorage): void => {
  const dataLayer = (window.dataLayer ??= [])
  dataLayer.push([
    'consent',
    mode,
    {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: analyticsStorage,
    },
  ])
}

/**
 * Consent-gated Google Tag Manager container, loaded via Next's third-party
 * component. That component has no consent props, so the gating lives here:
 *
 * - The container is only mounted after explicit consent and never on admin,
 *   API or live-preview URLs, so no Google script is requested pre-decision.
 * - Consent Mode starts fully denied; `update` follows every consent change.
 *   Withdrawal stops hits without reloading the already-loaded container.
 * - `update` is queued one commit *before* the tag mounts. React runs child
 *   (Script) effects before parent effects, so doing both in one commit could
 *   let GTM fire its tags while storage was still denied and drop the first
 *   page view.
 *
 * The GA4 tag lives inside the container; page views are handled by GA4
 * Enhanced Measurement, so no manual `page_view` or history tracking is needed.
 */
export function GoogleAnalytics() {
  const { consent } = useConsent()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const trackedRoute = useMemo(
    () => isTrackedRoute(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams],
  )

  const active = consent === 'granted' && trackedRoute
  const [tagReady, setTagReady] = useState(false)

  // First command GTM will ever see: everything denied.
  useEffect(() => {
    pushConsent('default', 'denied')
  }, [])

  useEffect(() => {
    if (!active) setTagReady(false)

    pushConsent('update', active ? 'granted' : 'denied')
    if (active) setTagReady(true)
  }, [active])

  if (!tagReady || !gtmContainerId) return null

  return <NextGoogleTagManager gtmId={gtmContainerId} />
}

export default GoogleAnalytics

import type { AdSlotDefinition } from '@/features/ads/content/adsRegistry'

export type PopupRules = AdSlotDefinition['placement']

export type AdEligibilityInput = {
  now: number
  consent: 'denied' | 'granted' | null
  consentReady: boolean
  pageviewsInSession: number
  pathname: string
  queryKeys: readonly string[]
  dismissedAt: number | null
  shownThisSession: boolean
  trigger: {
    elapsedMs: number
    scrollPercent: number
  }
  rules: PopupRules
}

export type AdEligibilityReason =
  | 'awaiting-consent'
  | 'dismissal-cooldown'
  | 'eligible'
  | 'excluded-route'
  | 'first-pageview'
  | 'preview-mode'
  | 'waiting-for-trigger'
  | 'already-shown'

export type AdEligibilityResult = {
  eligible: boolean
  reason: AdEligibilityReason
}

const HOUR_MS = 60 * 60 * 1000

const ineligible = (reason: AdEligibilityReason): AdEligibilityResult => ({
  eligible: false,
  reason,
})

/** Locale-prefixed routes must match the same registry rules in AR and FR. */
const stripLocalePrefix = (pathname: string): string => {
  const match = /^\/(?:ar|fr)(?=\/|$)/.exec(pathname)

  return match ? pathname.slice(match[0].length) || '/' : pathname
}

const isExcludedRoute = (pathname: string, excludedRoutes: readonly string[]): boolean =>
  excludedRoutes.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`)),
  )

/**
 * Pure eligibility planner for the debug-only popup shell. Storage reads,
 * timers and scroll listeners live in the component; this function only
 * decides from values handed to it.
 */
export const getPopupEligibility = (input: AdEligibilityInput): AdEligibilityResult => {
  const { rules } = input

  if (
    rules.waitForConsentDecision !== false &&
    (!input.consentReady || input.consent === null)
  ) {
    return ineligible('awaiting-consent')
  }

  const pathname = stripLocalePrefix(input.pathname)
  const previewKeys = rules.previewQueryKeys ?? []
  if (input.queryKeys.some((key) => previewKeys.includes(key))) {
    return ineligible('preview-mode')
  }

  if (isExcludedRoute(pathname, rules.excludedRoutes ?? [])) {
    return ineligible('excluded-route')
  }

  const minPageviews = rules.minPageviewsInSession ?? 2
  if (input.pageviewsInSession < minPageviews) {
    return ineligible('first-pageview')
  }

  if (rules.frequency === 'once-per-session' && input.shownThisSession) {
    return ineligible('already-shown')
  }

  const cooldownMs = (rules.dismissalCooldownHours ?? 0) * HOUR_MS
  if (
    cooldownMs > 0 &&
    input.dismissedAt !== null &&
    input.now - input.dismissedAt < cooldownMs
  ) {
    return ineligible('dismissal-cooldown')
  }

  const seconds = rules.alternativeTrigger?.seconds ?? 20
  const scrollPercent = rules.alternativeTrigger?.scrollPercent ?? 50
  const reachedTime = input.trigger.elapsedMs >= seconds * 1000
  const reachedScroll = input.trigger.scrollPercent >= scrollPercent

  if (!reachedTime && !reachedScroll) return ineligible('waiting-for-trigger')

  return { eligible: true, reason: 'eligible' }
}

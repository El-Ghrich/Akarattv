/**
 * Types for the ad-prep registry. Plain TypeScript only: no React, no browser
 * APIs, no Next.js runtime imports. Safe to use from Payload config and tests.
 */

export type AdLocale = 'ar' | 'fr' | 'en'

export type AdSlotKind = 'in-flow' | 'overlay-bar' | 'overlay-modal'

export type AdCollapseStrategy = 'collapse-after-load' | 'render-only-if-known' | 'overlay'

export type AdDisplayConfig =
  | {
      width: number
      height: number
      aspectRatio?: string
      maxWidth?: number | string
    }
  | {
      aspectRatio: string
      maxWidth?: number | string
    }
  | 'hidden'

export type AdBreakpointDisplay = {
  desktop: AdDisplayConfig
  mobile: AdDisplayConfig
}

export type AdPlacementRules = {
  region?: string
  position?: string
  note?: string
  breakpoint?: string
  afterCountedParagraph?: number
  minParagraphsFromEnd?: number
  minPageviewsInSession?: number
  alternativeTrigger?: {
    seconds?: number
    scrollPercent?: number
  }
  frequency?: 'once-per-session'
  dismissalCooldownHours?: number
  excludedRoutes?: readonly string[]
  previewQueryKeys?: readonly string[]
  waitForConsentDecision?: boolean
}

export type AdSlotDefinition = {
  key: string
  label: Record<AdLocale, string>
  kind: AdSlotKind
  display: AdBreakpointDisplay
  /** Creatives are uploaded at 2x their largest display width. */
  minUploadWidth: number
  allowedFormats: readonly ['image']
  placement: AdPlacementRules
  collapseStrategy: AdCollapseStrategy
}

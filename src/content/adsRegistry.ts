/**
 * Plain data only: no React, no browser APIs, no Next.js runtime imports.
 *
 * This file is deliberately importable from Payload config, server components
 * and pure test helpers. Keys are permanent identifiers: do not rename them
 * when creative widths or copy change.
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

const legalRoutes = [
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/editorial-policy',
] as const

const previewQueryKeys = ['preview', 'draft', 'vercel-preview'] as const

export const adSlots = {
  'top-banner': {
    key: 'top-banner',
    label: { ar: 'شريط علوي', en: 'Top banner', fr: 'Bannière haute' },
    kind: 'in-flow',
    display: {
      desktop: { width: 970, height: 90, maxWidth: 970 },
      mobile: { width: 320, height: 100, maxWidth: 320 },
    },
    minUploadWidth: 1940,
    allowedFormats: ['image'],
    placement: {
      region: 'layout-after-header',
      position: 'above-the-fold',
      // Phase B passes a server-computed availability check here. Until then
      // the shell renders only in debug mode.
      note: 'must not collapse after load',
    },
    collapseStrategy: 'render-only-if-known',
  },
  'in-article-1': {
    key: 'in-article-1',
    label: { ar: 'داخل المقال ١', en: 'In-article 1', fr: 'Dans l’article 1' },
    kind: 'in-flow',
    display: {
      desktop: { width: 300, height: 250, maxWidth: 300 },
      mobile: { width: 300, height: 250, maxWidth: 300 },
    },
    minUploadWidth: 600,
    allowedFormats: ['image'],
    placement: {
      region: 'article-body',
      afterCountedParagraph: 3,
      minParagraphsFromEnd: 2,
    },
    collapseStrategy: 'collapse-after-load',
  },
  'article-end': {
    key: 'article-end',
    label: { ar: 'نهاية المقال', en: 'Article end', fr: 'Fin de l’article' },
    kind: 'in-flow',
    display: {
      desktop: { width: 728, height: 90, maxWidth: 728 },
      mobile: { width: 320, height: 100, maxWidth: 320 },
    },
    minUploadWidth: 1456,
    allowedFormats: ['image'],
    placement: {
      region: 'article-body-end',
      // Always rendered once, including short articles under the in-article
      // thresholds. Phase A never renders a second copy.
      position: 'after-content-before-share',
    },
    collapseStrategy: 'collapse-after-load',
  },
  sidebar: {
    key: 'sidebar',
    label: { ar: 'العمود الجانبي', en: 'Sidebar', fr: 'Colonne latérale' },
    kind: 'in-flow',
    display: {
      desktop: { width: 300, height: 250, maxWidth: 300 },
      mobile: 'hidden',
    },
    minUploadWidth: 600,
    allowedFormats: ['image'],
    placement: {
      region: 'article-sidebar',
      breakpoint: 'lg',
    },
    collapseStrategy: 'collapse-after-load',
  },
  'home-between-sections': {
    key: 'home-between-sections',
    label: {
      ar: 'بين أقسام الرئيسية',
      en: 'Between home sections',
      fr: 'Entre les sections',
    },
    kind: 'in-flow',
    display: {
      desktop: { width: 970, height: 250, maxWidth: 970 },
      mobile: { width: 320, height: 100, maxWidth: 320 },
    },
    minUploadWidth: 1940,
    allowedFormats: ['image'],
    placement: {
      region: 'home-category-sections',
      position: 'between-first-two',
    },
    collapseStrategy: 'collapse-after-load',
  },
  'mobile-bottom-bar': {
    key: 'mobile-bottom-bar',
    label: { ar: 'شريط سفلي للجوال', en: 'Mobile bottom bar', fr: 'Barre inférieure mobile' },
    kind: 'overlay-bar',
    display: {
      desktop: 'hidden',
      mobile: { width: 320, height: 50, maxWidth: 320 },
    },
    minUploadWidth: 640,
    allowedFormats: ['image'],
    placement: {
      region: 'global-overlay',
      breakpoint: 'below-lg',
    },
    collapseStrategy: 'overlay',
  },
  popup: {
    key: 'popup',
    label: { ar: 'نافذة منبثقة', en: 'Popup', fr: 'Fenêtre contextuelle' },
    kind: 'overlay-modal',
    display: {
      desktop: { width: 400, height: 500, aspectRatio: '4 / 5', maxWidth: 400 },
      mobile: {
        width: 400,
        height: 500,
        aspectRatio: '4 / 5',
        maxWidth: 'calc(100vw - 32px)',
      },
    },
    minUploadWidth: 800,
    allowedFormats: ['image'],
    placement: {
      region: 'global-overlay',
      minPageviewsInSession: 2,
      alternativeTrigger: { seconds: 20, scrollPercent: 50 },
      frequency: 'once-per-session',
      dismissalCooldownHours: 24,
      excludedRoutes: ['/admin', '/preview', ...legalRoutes],
      previewQueryKeys,
      waitForConsentDecision: true,
    },
    collapseStrategy: 'overlay',
  },
} as const satisfies Record<string, AdSlotDefinition>

export type AdSlotKey = keyof typeof adSlots

export const adSlotKeys = Object.keys(adSlots) as AdSlotKey[]

/** A wrong key is a compile error because the argument is a literal union. */
export const getAdSlot = <K extends AdSlotKey>(key: K): (typeof adSlots)[K] => adSlots[key]

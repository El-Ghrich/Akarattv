import type { CSSProperties, ReactNode } from 'react'

import { adsCopy } from '@/content/adsCopy'
import { getAdSlot, type AdDisplayConfig, type AdSlotKey } from '@/content/adsRegistry'
import type { Locale } from '@/i18n/routing'
import { adsDebugEnabled } from '@/utilities/adsDebug'

export type AdSlotProps = {
  children?: ReactNode
  /**
   * Phase B seam: a server check can mark a real creative as available. The
   * `render-only-if-known` slot stays empty until this is true.
   */
  hasActiveAd?: boolean
  locale: Locale
  slot: AdSlotKey
}

type DisplayVars = {
  '--ad-mobile-max': string
  '--ad-mobile-ratio': string
  '--ad-desktop-max': string
  '--ad-desktop-ratio': string
}

type NormalizedDisplay = {
  aspectRatio?: string
  height?: number
  maxWidth?: number | string
  width?: number
}

const normalize = (config: AdDisplayConfig): NormalizedDisplay =>
  config === 'hidden' ? {} : config

const maxWidthValue = (value: number | string | undefined): string =>
  typeof value === 'number' ? `${value}px` : (value ?? '100%')

const ratioOf = (display: NormalizedDisplay): string =>
  display.aspectRatio ??
  (display.width && display.height ? `${display.width} / ${display.height}` : 'auto')

const displayVars = (config: AdDisplayConfig): DisplayVars => {
  if (config === 'hidden') {
    return {
      '--ad-mobile-max': '0px',
      '--ad-mobile-ratio': 'auto',
      '--ad-desktop-max': '0px',
      '--ad-desktop-ratio': 'auto',
    }
  }

  const display = normalize(config)
  const maxWidth = maxWidthValue(display.maxWidth)

  return {
    '--ad-mobile-max': maxWidth,
    '--ad-mobile-ratio': ratioOf(display),
    '--ad-desktop-max': maxWidth,
    '--ad-desktop-ratio': ratioOf(display),
  }
}

const describe = (config: AdDisplayConfig): string => {
  if (config === 'hidden') return 'hidden'

  const display = normalize(config)
  const size = display.aspectRatio ??
    (display.width && display.height ? `${display.width}×${display.height}` : 'auto')
  const limit = display.maxWidth === undefined ? '' : ` max ${maxWidthValue(display.maxWidth)}`

  return `${size}${limit}`
}

/**
 * Server shell only. In production (and in preview, where callers omit it) it
 * returns null, so no wrapper, box or layout shift is introduced. Phase B will
 * pass a client child; this shell already reserves the correct aspect-ratio
 * space and exposes the collapse strategy through data attributes.
 */
export function AdSlot({ children, hasActiveAd = false, locale, slot }: AdSlotProps) {
  const definition = getAdSlot(slot)
  const hasContent = Boolean(children) || hasActiveAd

  if (!adsDebugEnabled && !hasContent) return null

  const hiddenClasses = [
    definition.display.mobile === 'hidden' ? 'ad-slot--mobile-hidden' : '',
    definition.display.desktop === 'hidden' ? 'ad-slot--desktop-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const mobileVars = displayVars(definition.display.mobile)
  const desktopVars = displayVars(definition.display.desktop)
  const style = {
    '--ad-mobile-max': mobileVars['--ad-mobile-max'],
    '--ad-mobile-ratio': mobileVars['--ad-mobile-ratio'],
    '--ad-desktop-max': desktopVars['--ad-desktop-max'],
    '--ad-desktop-ratio': desktopVars['--ad-desktop-ratio'],
  } as CSSProperties

  const isDebugPlaceholder = adsDebugEnabled && !hasContent
  const debugText = isDebugPlaceholder
    ? `${slot} · mobile ${describe(definition.display.mobile)} · desktop ${describe(
        definition.display.desktop,
      )} · ${definition.collapseStrategy}`
    : null

  return (
    <aside
      aria-hidden={!hasContent}
      aria-label={`${definition.label[locale]} — ${adsCopy[locale].marker}`}
      className={[
        'ad-slot',
        definition.kind === 'overlay-bar' ? 'ad-slot--overlay-bar' : '',
        isDebugPlaceholder ? 'ad-slot--debug' : '',
        hiddenClasses,
      ]
        .filter(Boolean)
        .join(' ')}
      data-collapse-strategy={definition.collapseStrategy}
      data-slot={slot}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
      style={style}
    >
      <div className="ad-slot__frame">
        <span className="ad-slot__label">{adsCopy[locale].marker}</span>
        <div className="ad-slot__creative">{children ?? debugText}</div>
      </div>
    </aside>
  )
}

export default AdSlot

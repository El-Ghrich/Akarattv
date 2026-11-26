import type { CSSProperties, ReactNode } from 'react'

import { adsCopy } from '@/features/ads/content/adsCopy'
import { getAdSlot, type AdSlotKey } from '@/features/ads/content/adsRegistry'
import type { Locale } from '@/i18n/routing'
import { describeDisplay, displayValues } from '@/features/ads/lib/adDisplay'
import { adsDebugEnabled } from '@/features/ads/lib/adsDebug'

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

  const mobile = displayValues(definition.display.mobile)
  const desktop = displayValues(definition.display.desktop)
  const style = {
    '--ad-mobile-max': mobile.max,
    '--ad-mobile-ratio': mobile.ratio,
    '--ad-desktop-max': desktop.max,
    '--ad-desktop-ratio': desktop.ratio,
  } as CSSProperties

  const isDebugPlaceholder = adsDebugEnabled && !hasContent
  const debugText = isDebugPlaceholder
    ? `${slot} · mobile ${describeDisplay(definition.display.mobile)} · desktop ${describeDisplay(
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

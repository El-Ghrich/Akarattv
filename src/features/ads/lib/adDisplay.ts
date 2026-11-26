import type { AdDisplayConfig } from '@/features/ads/content/types'

/** Shared display math for the server shell and the popup placeholder. */

export type NormalizedDisplay = {
  aspectRatio?: string
  height?: number
  maxWidth?: number | string
  width?: number
}

export const normalizeDisplay = (config: AdDisplayConfig): NormalizedDisplay =>
  config === 'hidden' ? {} : config

export const maxWidthValue = (value: number | string | undefined): string =>
  typeof value === 'number' ? `${value}px` : (value ?? '100%')

export const ratioOf = (display: NormalizedDisplay): string =>
  display.aspectRatio ??
  (display.width && display.height ? `${display.width} / ${display.height}` : 'auto')

const sizeLabel = (display: NormalizedDisplay): string =>
  display.aspectRatio ??
  (display.width && display.height ? `${display.width}×${display.height}` : 'auto')

/** Human-readable breakpoint description used by the debug outline. */
export const describeDisplay = (config: AdDisplayConfig): string => {
  if (config === 'hidden') return 'hidden'

  const display = normalizeDisplay(config)
  const limit = display.maxWidth === undefined ? '' : ` max ${maxWidthValue(display.maxWidth)}`

  return `${sizeLabel(display)}${limit}`
}

/** CSS custom properties consumed by the logical-property stylesheet. */
export const displayValues = (
  config: AdDisplayConfig,
): { max: string; ratio: string } => {
  if (config === 'hidden') return { max: '100%', ratio: 'auto' }

  return {
    max: maxWidthValue(config.maxWidth),
    ratio: ratioOf(config),
  }
}

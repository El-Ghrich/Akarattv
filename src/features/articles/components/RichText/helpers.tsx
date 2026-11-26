import { defaultColors } from '@payloadcms/richtext-lexical'
import Image from 'next/image'
import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/routing'

import type { Direction, InfoBoxFields, MediaFields } from './types'

/**
 * Lexical stores a direction per block node, but that value is inherited when
 * the editor presses Enter, so a Latin paragraph written right after an Arabic
 * one can be stored as `rtl`. Let the browser infer the base direction from the
 * first strong character instead: that is what makes a single paragraph mixing
 * Arabic, French and numbers render correctly on the frontend.
 */
export const dir = (_node: { direction?: Direction }): 'auto' => 'auto'

export const articleHref = (reference: unknown, locale: Locale): string => {
  if (reference !== null && typeof reference === 'object') {
    const doc = reference as { id?: number | string; slug?: string | null }

    if (doc.slug) return `/${locale}/articles/${encodeURIComponent(doc.slug)}`
    if (doc.id !== undefined) return `/${locale}/articles/${doc.id}`
  }

  if (typeof reference === 'number' || typeof reference === 'string') {
    return `/${locale}/articles/${encodeURIComponent(String(reference))}`
  }

  return '#'
}

export const asMedia = (value: unknown): MediaFields | null =>
  value !== null && typeof value === 'object' ? (value as MediaFields) : null

/**
 * Body images sit inside the 720px article column, so that is the widest they
 * are ever painted at 1x. `next/image` turns this into a `srcset` of real
 * widths (400/800/1200/1600) and lets the browser pick one.
 */
const BODY_IMAGE_SIZES = '(max-width: 800px) 100vw, 720px'

export const image = (
  media: MediaFields,
  alt: string,
  caption?: null | string,
): ReactNode => {
  if (!media.url) return null

  return (
    <figure className="rich-text__figure" dir="auto">
      <Image
        alt={alt}
        // Stored dimensions reserve the right amount of space before load.
        // Fall back to a 4:3 box for documents predating the media pipeline.
        height={media.height ?? 900}
        sizes={BODY_IMAGE_SIZES}
        src={media.url}
        width={media.width ?? 1200}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

const YOUTUBE_ID =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})(?![\w-])/i

export const youtubeId = (url?: null | string): string | null => {
  if (!url) return null

  return YOUTUBE_ID.exec(url)?.[1] ?? null
}

export const infoBoxLabel: Record<NonNullable<InfoBoxFields['variant']>, Record<Locale, string>> = {
  info: { ar: 'معلومة', fr: 'Information' },
  tip: { ar: 'نصيحة', fr: 'Conseil' },
  warning: { ar: 'تحذير', fr: 'Avertissement' },
}

export const relatedLabel: Record<Locale, string> = {
  ar: 'مقال ذو صلة',
  fr: 'Article lié',
}

export const textColor = (node: { color?: unknown }): string | undefined => {
  if (typeof node.color !== 'string') return undefined

  const palette = defaultColors.text as Record<string, { css?: { color?: string } } | undefined>

  return palette[node.color]?.css?.color
}

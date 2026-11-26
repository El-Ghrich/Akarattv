import type { Locale } from '@/i18n/routing'
import type { Article, Media } from '@/payload-types'

export type Direction = 'ltr' | 'rtl' | null | undefined

export type MediaFields = {
  url?: null | string
  alt?: null | string
  caption?: null | string
  width?: null | number
  height?: null | number
  mimeType?: null | string
  filename?: null | string
}

export type ImageBlockFields = {
  alt?: null | string
  caption?: null | string
  image?: Media | number | null
}

export type PullQuoteFields = {
  attribution?: null | string
  quote?: null | string
}

export type RelatedArticleFields = {
  article?: Article | number | null
}

export type YouTubeFields = {
  caption?: null | string
  title?: null | string
  url?: null | string
}

export type InfoBoxFields = {
  body?: null | string
  title?: null | string
  variant?: 'info' | 'tip' | 'warning' | null
}

export type RichTextProps = {
  className?: string
  content: Article['content'] | null | undefined
  locale: Locale
  /** Debug-only: inject the reserved in-article shell after a safe paragraph. */
  showAdSlot?: boolean
  hasManualAdBlock?: boolean
}

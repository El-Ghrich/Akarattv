import type { Article, Category, Media } from '@/payload-types'
import type { Locale } from '@/i18n/routing'

export type ArticleTeaser = {
  category?: Category | number | null
  createdAt?: string
  excerpt?: null | string
  heroImage?: Media | number | null
  id: number
  publishedAt?: null | string
  slug?: null | string
  title: string
}

export type ArticleViewProps = {
  article: Article
  latest?: ArticleTeaser[]
  locale: Locale
  preview?: boolean
  /** Debug-only: render reserved ad shells. Never set in Live Preview. */
  showAdSlots?: boolean
  shareUrl: string
}

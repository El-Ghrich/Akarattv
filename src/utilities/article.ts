import type { Article } from '@/payload-types'

import type { Locale } from '@/i18n/routing'

type LexicalNode = {
  children?: LexicalNode[]
  tag?: string
  text?: string
  type?: string
}

export type ArticleHeading = {
  id: string
  level: 2 | 3
  text: string
}

const localeTag = (locale: Locale): string => (locale === 'ar' ? 'ar-MA' : 'fr-MA')

const TIME_ZONE = 'Africa/Casablanca'

const nodeText = (node: LexicalNode | null | undefined): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (!Array.isArray(node.children)) return ''

  return node.children.map((child) => nodeText(child)).join('')
}

const rootChildren = (content: Article['content'] | null | undefined): LexicalNode[] => {
  const root = content as { root?: { children?: LexicalNode[] } } | null | undefined

  return Array.isArray(root?.root?.children) ? root.root.children : []
}

/**
 * The table of contents and the rich-text renderer agree on one rule: every
 * heading in the document is counted, but only h2/h3 are given a TOC entry.
 * The count is used for the anchor, so h4/h5 headings still advance the ids
 * without appearing in the sidebar.
 */
export const getArticleHeadings = (
  content: Article['content'] | null | undefined,
): ArticleHeading[] => {
  const headings: ArticleHeading[] = []
  let headingCount = 0

  for (const child of rootChildren(content)) {
    if (child.type !== 'heading') continue

    headingCount += 1

    if (child.tag !== 'h2' && child.tag !== 'h3') continue

    const text = nodeText(child).trim()
    if (!text) continue

    headings.push({
      id: `section-${headingCount}`,
      level: child.tag === 'h3' ? 3 : 2,
      text,
    })
  }

  return headings
}

export const getReadingTime = (
  content: Article['content'] | null | undefined,
  locale: Locale,
): number => {
  const text = rootChildren(content).map((child) => nodeText(child)).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length

  // Arabic script is read a little slower per word because short words carry
  // more of the sentence than they do in French.
  const wordsPerMinute = locale === 'ar' ? 190 : 210

  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export const formatArticleDate = (
  value: null | string | undefined,
  locale: Locale,
  withTime = false,
): null | string => {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const format = new Intl.DateTimeFormat(localeTag(locale), {
    day: 'numeric',
    month: 'long',
    timeZone: TIME_ZONE,
    year: 'numeric',
  }).format(date)

  if (!withTime) return format

  const time = new Intl.DateTimeFormat(localeTag(locale), {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(date)

  return `${format} (${time})`
}

/**
 * "35 minutes ago" for fresh stories, then an absolute date. The seed content
 * can be months old, and a relative "il y a 3 mois" is less useful than the
 * publication date in a news sidebar.
 */
export const formatRelativeArticleDate = (
  value: null | string | undefined,
  locale: Locale,
  now = Date.now(),
): null | string => {
  if (!value) return null

  const timestamp = new Date(value).getTime()
  if (Number.isNaN(timestamp)) return null

  const difference = timestamp - now
  const absolute = Math.abs(difference)
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour

  if (absolute >= 7 * day) return formatArticleDate(value, locale)

  const relative = new Intl.RelativeTimeFormat(localeTag(locale), { numeric: 'auto' })

  if (absolute < hour) return relative.format(Math.round(difference / minute), 'minute')
  if (absolute < day) return relative.format(Math.round(difference / hour), 'hour')

  return relative.format(Math.round(difference / day), 'day')
}

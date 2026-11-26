import React from 'react'
import Image from 'next/image'

import { CalendarIcon, ClockIcon, RefreshIcon } from '@/shared/ui/icons'
import type { Author, Media } from '@/payload-types'
import { formatArticleDate } from '@/features/articles/lib/article'

import { isDoc } from './utils'

type MetaItem = { key: string; node: React.ReactNode }

export function buildMetaItems({
  article,
  author,
  content,
  locale,
  readingMinutes,
  updatedAt,
}: {
  article: import('@/payload-types').Article
  author: Author | null
  content: {
    meta: {
      published: string
      updated: string
      reading: (minutes: number) => string
    }
  }
  locale: import('@/i18n/routing').Locale
  readingMinutes: number
  updatedAt: string | null
}): React.ReactNode[] {
  const publishedAt = formatArticleDate(article.publishedAt ?? article.createdAt, locale, true)
  const items: MetaItem[] = []

  if (author) {
    const photo = isDoc<Media>(author.photo) ? author.photo : null

    items.push({
      key: 'author',
      node: (
        <span className="flex items-center gap-2.5">
          {photo?.url ? (
            <Image
              alt={photo.alt ?? author.name}
              className="h-9 w-9 rounded-full border border-gold-500/40 object-cover"
              height={36}
              sizes="36px"
              src={photo.url}
              width={36}
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/40 bg-green-100 font-headline text-body-ui font-bold text-green-800"
            >
              {author.name.charAt(0)}
            </span>
          )}
          <span className="font-headline font-bold text-ink-900">{author.name}</span>
        </span>
      ),
    })
  }

  if (publishedAt) {
    items.push({
      key: 'published',
      node: (
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-gold-500" />
          <span>
            {content.meta.published}:{' '}
            <time
              dateTime={article.publishedAt ?? article.createdAt}
              suppressHydrationWarning
            >
              {publishedAt}
            </time>
          </span>
        </span>
      ),
    })
  }

  if (updatedAt) {
    items.push({
      key: 'updated',
      node: (
        <span className="flex items-center gap-1.5 font-semibold text-gold-700">
          <RefreshIcon className="h-4 w-4" />
          <span>
            {content.meta.updated}:{' '}
            <time dateTime={article.updatedAt} suppressHydrationWarning>
              {updatedAt}
            </time>
          </span>
        </span>
      ),
    })
  }

  items.push({
    key: 'reading',
    node: (
      <span className="flex items-center gap-1.5">
        <ClockIcon className="h-4 w-4" />
        <span>{content.meta.reading(readingMinutes)}</span>
      </span>
    ),
  })

  return items.map(({ key, node }) => (
    <React.Fragment key={key}>{node}</React.Fragment>
  ))
}

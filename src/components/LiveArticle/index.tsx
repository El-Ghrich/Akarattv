'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React from 'react'

import type { Article } from '@/payload-types'

import { ArticleView, type ArticleTeaser } from '@/components/ArticleView'
import type { Locale } from '@/i18n/routing'

export type LiveArticleProps = {
  initialArticle: Article
  latest: ArticleTeaser[]
  locale: Locale
  preview: boolean
  serverURL: string
  shareUrl: string
}

/**
 * Subscribes to Payload's Live Preview postMessage channel and re-renders the
 * article as the editor types. Outside the admin iframe it simply renders the
 * server-fetched article.
 */
export function LiveArticle({
  initialArticle,
  latest,
  locale,
  preview,
  serverURL,
  shareUrl,
}: LiveArticleProps) {
  const { data } = useLivePreview<Article>({
    depth: 2,
    initialData: initialArticle,
    serverURL,
  })

  return (
    <ArticleView
      article={data}
      latest={latest}
      locale={locale}
      preview={preview}
      shareUrl={shareUrl}
    />
  )
}

export default LiveArticle

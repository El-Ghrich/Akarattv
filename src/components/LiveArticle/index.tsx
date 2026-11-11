'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React from 'react'

import type { Article } from '@/payload-types'

import { ArticleView } from '@/components/ArticleView'

type Locale = 'ar' | 'fr'

export type LiveArticleProps = {
  initialArticle: Article
  locale: Locale
  preview: boolean
  serverURL: string
}

/**
 * Subscribes to Payload's Live Preview postMessage channel and re-renders the
 * article as the editor types. Outside the admin iframe it simply renders the
 * server-fetched article.
 */
export function LiveArticle({ initialArticle, locale, preview, serverURL }: LiveArticleProps) {
  const { data } = useLivePreview<Article>({
    depth: 2,
    initialData: initialArticle,
    serverURL,
  })

  return <ArticleView article={data} locale={locale} preview={preview} />
}

export default LiveArticle

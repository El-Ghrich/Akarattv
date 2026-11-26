import React from 'react'

import { HomeIcon } from '@/shared/ui/icons'
import type { Category, Region } from '@/payload-types'
import { articleContent } from '@/features/articles/content/article'
import type { Locale } from '@/i18n/routing'
import { categoryHref } from '@/shared/lib/urls'

import { buildMetaItems } from './ArticleMeta'
import { ArticleViewProps } from './types'

type ArticleHeaderProps = {
  article: ArticleViewProps['article']
  author: import('@/payload-types').Author | null
  category: Category | null
  content: typeof articleContent.ar
  isDraft: boolean
  locale: Locale
  preview: boolean
  readingMinutes: number
  region: Region | null
  updatedAt: string | null
}

export function ArticleHeader({
  article,
  author,
  category,
  content,
  isDraft,
  locale,
  preview,
  readingMinutes,
  region,
  updatedAt,
}: ArticleHeaderProps) {
  const categoryLink = category ? categoryHref(locale, category.slug) : `/${locale}#latest-news`
  const metaItems = buildMetaItems({
    article,
    author,
    content,
    locale,
    readingMinutes,
    updatedAt,
  })

  return (
    <>
      {preview && isDraft ? (
        <p
          className="mb-6 inline-flex items-center rounded-full border border-gold-500 px-3 py-1 font-headline text-label font-bold text-gold-700"
          dir="auto"
        >
          {content.draft}
        </p>
      ) : null}

      <nav aria-label={content.breadcrumb.label} className="mb-8">
        <ol className="flex min-w-0 flex-wrap items-center gap-2 font-semibold text-meta text-ink-500">
          <li>
            <a
              className="flex items-center gap-1 transition-colors hover:text-green-900"
              href={`/${locale}`}
            >
              <HomeIcon className="h-[17px] w-[17px]" />
              <span>{content.breadcrumb.home}</span>
            </a>
          </li>
          <li aria-hidden="true" className="text-ink-300">
            /
          </li>
          {category ? (
            <>
              <li>
                <a
                  className="transition-colors hover:text-green-900"
                  href={categoryLink}
                >
                  {category.title}
                </a>
              </li>
              <li aria-hidden="true" className="text-ink-300">
                /
              </li>
            </>
          ) : null}
          <li aria-current="page" className="min-w-0 max-w-md text-ink-700">
            <span className="block truncate">{article.title}</span>
          </li>
        </ol>
      </nav>

      <header className="mx-auto mb-8 flex max-w-[800px] flex-col items-center gap-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {category ? (
            <span className="inline-flex items-center rounded-full bg-gold-300 px-3.5 py-1 font-headline text-label font-bold text-gold-700 shadow-xs">
              {category.title}
            </span>
          ) : null}

          {region ? (
            <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 font-headline text-label font-bold text-ink-700">
              {region.name}
            </span>
          ) : null}
        </div>

        <h1 className="m-0 text-balance font-headline text-[30px] font-extrabold leading-[1.35] text-green-900 sm:text-h1">
          {article.title}
        </h1>

        <p className="m-0 max-w-2xl text-pretty text-[20px] font-normal leading-[1.7] text-ink-700">
          {article.excerpt}
        </p>

        <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-line pt-4 text-meta text-ink-500">
          {metaItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-ink-300">
                  •
                </span>
              ) : null}
              {item}
            </React.Fragment>
          ))}
        </div>
      </header>
    </>
  )
}

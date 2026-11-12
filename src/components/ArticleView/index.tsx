import Image from 'next/image'
import React from 'react'

import type { Article, Author, Category, Media, Region } from '@/payload-types'

import { RichText } from '@/components/RichText'

type Locale = 'ar' | 'fr'

/**
 * The article column is capped at 800px, so that is the widest a hero can be
 * painted at 1x. Above 800px of viewport the layout stops growing.
 */
const HERO_SIZES = '(max-width: 800px) 100vw, 800px'

const isDoc = <T,>(value: T | number | null | undefined): value is T =>
  value !== null && typeof value === 'object'

const formatDate = (value: null | string | undefined, locale: Locale): string | null => {
  if (!value) return null

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Africa/Casablanca',
    year: 'numeric',
  }).format(new Date(value))
}

const labels = {
  ar: {
    draft: 'معاينة المسودة',
    updated: 'آخر تحديث',
  },
  fr: {
    draft: 'Aperçu du brouillon',
    updated: 'Dernière mise à jour',
  },
} satisfies Record<Locale, Record<string, string>>

export type ArticleViewProps = {
  article: Article
  locale: Locale
  preview?: boolean
}

export function ArticleView({ article, locale, preview = false }: ArticleViewProps) {
  const category = isDoc<Category>(article.category) ? article.category : null
  const author = isDoc<Author>(article.author) ? article.author : null
  const region = isDoc<Region>(article.region) ? article.region : null
  const heroImage = isDoc<Media>(article.heroImage) ? article.heroImage : null
  const publishedAt = formatDate(article.publishedAt, locale)
  const isDraft = article._status === 'draft'

  return (
    <article className="article-page" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      {preview && isDraft ? (
        <p className="article-page__draft-badge" dir="auto">
          {labels[locale].draft}
        </p>
      ) : null}

      <header className="article-page__header">
        {category ? (
          <p className="article-page__eyebrow" dir="auto">
            {category.title}
          </p>
        ) : null}

        <h1 className="article-page__title" dir="auto">
          {article.title}
        </h1>

        <p className="article-page__excerpt" dir="auto">
          {article.excerpt}
        </p>

        <div className="article-page__meta" dir="auto">
          {author ? (
            <span className="article-page__author">
              {author.photo && isDoc<Media>(author.photo) && author.photo.url ? (
                <Image
                  alt={author.photo.alt ?? author.name}
                  className="article-page__author-photo"
                  height={48}
                  sizes="48px"
                  src={author.photo.url}
                  width={48}
                />
              ) : null}
              <span>
                <span className="article-page__author-name">{author.name}</span>
                {author.jobTitle ? (
                  <span className="article-page__author-job">{author.jobTitle}</span>
                ) : null}
              </span>
            </span>
          ) : null}

          <span className="article-page__meta-separator" aria-hidden="true">
            •
          </span>

          {publishedAt ? (
            <time dateTime={article.publishedAt ?? undefined}>{publishedAt}</time>
          ) : null}

          {region ? (
            <>
              <span className="article-page__meta-separator" aria-hidden="true">
                •
              </span>
              <span>{region.name}</span>
            </>
          ) : null}
        </div>
      </header>

      {heroImage?.url ? (
        <figure className="article-page__hero">
          <Image
            alt={heroImage.alt ?? article.title}
            // Only the hero is prioritised: it is the largest element in the
            // initial viewport and the one that decides LCP.
            priority
            sizes={HERO_SIZES}
            src={heroImage.url}
            // Stored dimensions give the browser the real aspect ratio, which
            // reserves the space before the bytes arrive. Fall back to a 16:9
            // box when an old document has none.
            height={heroImage.height ?? 900}
            width={heroImage.width ?? 1600}
          />
          {heroImage.caption ? <figcaption>{heroImage.caption}</figcaption> : null}
        </figure>
      ) : null}

      <RichText className="article-page__body rich-text" content={article.content} locale={locale} />

      {preview ? (
        <p className="article-page__updated" dir="auto">
          {labels[locale].updated}: {formatDate(article.updatedAt, locale)}
        </p>
      ) : null}
    </article>
  )
}

export default ArticleView

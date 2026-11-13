import Image from 'next/image'
import React from 'react'

import type { Article, Author, Category, Media, Region } from '@/payload-types'

import { ArticleShare } from '@/components/ArticleShare'
import { ArticleToc } from '@/components/ArticleToc'
import {
  ArrowIcon,
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  MailCheckIcon,
  RefreshIcon,
} from '@/components/icons'
import { RichText } from '@/components/RichText'
import { articleContent } from '@/content/article'
import type { Locale } from '@/i18n/routing'
import {
  formatArticleDate,
  formatRelativeArticleDate,
  getArticleHeadings,
  getReadingTime,
} from '@/utilities/article'
import { categoryHref } from '@/utilities/urls'

/**
 * The hero is painted at 1000px at most, and the reading column at 720px.
 * Explicit sizes keep the browser from downloading a wider R2 derivative than
 * the layout can ever use.
 */
const HERO_SIZES = '(min-width: 1064px) 1000px, 100vw'

const isDoc = <T,>(value: T | number | null | undefined): value is T =>
  value !== null && typeof value === 'object'

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
  shareUrl: string
}

const articleHref = (locale: Locale, teaser: ArticleTeaser): string =>
  `/${locale}/articles/${encodeURIComponent(teaser.slug ?? String(teaser.id))}`

const CategoryBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-gold-300/60 px-2.5 py-0.5 font-headline text-label font-bold text-gold-700">
    {children}
  </span>
)

type RelatedCardProps = {
  locale: Locale
  readLabel: string
  teaser: ArticleTeaser
}

const RelatedCard = ({ locale, readLabel, teaser }: RelatedCardProps) => {
  const category = isDoc<Category>(teaser.category) ? teaser.category : null
  const image = isDoc<Media>(teaser.heroImage) ? teaser.heroImage : null
  const date = formatArticleDate(teaser.publishedAt, locale)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-xs transition-all hover:border-gold-400">
      <div className="relative aspect-[16/9] overflow-hidden bg-green-100">
        {image?.url ? (
          <Image
            alt={image.alt ?? teaser.title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 33vw, 100vw"
            src={image.url}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {category ? (
            <div className="mb-2">
              <CategoryBadge>{category.title}</CategoryBadge>
            </div>
          ) : null}

          <h3 className="m-0 mb-2 line-clamp-2 font-headline text-card-title font-bold leading-snug text-ink-900 transition-colors group-hover:text-green-600">
            <a className="after:absolute after:inset-0" href={articleHref(locale, teaser)}>
              {teaser.title}
            </a>
          </h3>

          {teaser.excerpt ? (
            <p className="m-0 mb-4 line-clamp-2 text-body-ui leading-relaxed text-ink-700">
              {teaser.excerpt}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-meta text-ink-500">
          <span className="min-w-0" suppressHydrationWarning>
            {date}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 font-bold text-green-600">
            <span>{readLabel}</span>
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  )
}

export function ArticleView({
  article,
  latest = [],
  locale,
  preview = false,
  shareUrl,
}: ArticleViewProps) {
  const content = articleContent[locale]
  const category = isDoc<Category>(article.category) ? article.category : null
  const author = isDoc<Author>(article.author) ? article.author : null
  const region = isDoc<Region>(article.region) ? article.region : null
  const heroImage = isDoc<Media>(article.heroImage) ? article.heroImage : null
  const publishedAt = formatArticleDate(article.publishedAt ?? article.createdAt, locale, true)
  const updatedAt = formatArticleDate(article.updatedAt, locale, true)
  const readingMinutes = getReadingTime(article.content, locale)
  const headings = getArticleHeadings(article.content)
  const isDraft = article._status === 'draft'

  const latestItems = latest.filter((item) => item.id !== article.id).slice(0, 5)
  const hasToc = headings.length > 0
  const hasLatest = latestItems.length > 0
  const articleColumns = hasToc ? 'lg:col-span-6' : hasLatest ? 'lg:col-span-9' : 'lg:col-span-12'

  const relatedItems: ArticleTeaser[] = []
  const seen = new Set<number>([article.id])
  const addRelated = (candidate: Article | ArticleTeaser | number | null | undefined) => {
    if (!candidate || typeof candidate !== 'object') return
    if (seen.has(candidate.id) || relatedItems.length >= 3) return

    seen.add(candidate.id)
    relatedItems.push(candidate)
  }

  for (const candidate of article.relatedArticles ?? []) addRelated(candidate)
  for (const candidate of latest) addRelated(candidate)

  const categoryLink = category ? categoryHref(locale, category.slug) : `/${locale}#latest-news`

  const metaItems: React.ReactNode[] = []
  if (author) {
    const photo = isDoc<Media>(author.photo) ? author.photo : null

    metaItems.push(
      <span className="flex items-center gap-2.5" key="author">
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
      </span>,
    )
  }

  if (publishedAt) {
    metaItems.push(
      <span className="flex items-center gap-1.5" key="published">
        <CalendarIcon className="h-4 w-4 text-gold-500" />
        <span>
          {content.meta.published}:{' '}
          <time dateTime={article.publishedAt ?? article.createdAt} suppressHydrationWarning>
            {publishedAt}
          </time>
        </span>
      </span>,
    )
  }

  if (updatedAt) {
    metaItems.push(
      <span className="flex items-center gap-1.5 font-semibold text-gold-700" key="updated">
        <RefreshIcon className="h-4 w-4" />
        <span>
          {content.meta.updated}:{' '}
          <time dateTime={article.updatedAt} suppressHydrationWarning>
            {updatedAt}
          </time>
        </span>
      </span>,
    )
  }

  metaItems.push(
    <span className="flex items-center gap-1.5" key="reading">
      <ClockIcon className="h-4 w-4" />
      <span>{content.meta.reading(readingMinutes)}</span>
    </span>,
  )

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
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

      <ArticleShare locale={locale} title={article.title} url={shareUrl} />

      {heroImage?.url ? (
        <figure className="mx-auto mb-12 max-w-[1000px] overflow-hidden rounded-card border border-line bg-green-950 shadow-xs">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              alt={heroImage.alt ?? article.title}
              // The hero is the largest element in the initial viewport.
              priority
              className="h-full w-full object-cover"
              height={heroImage.height ?? 900}
              sizes={HERO_SIZES}
              src={heroImage.url}
              width={heroImage.width ?? 1600}
            />
          </div>
          {heroImage.caption ? (
            <figcaption className="flex flex-col justify-between gap-2 border-t border-line bg-surface p-3.5 text-meta text-ink-500 sm:flex-row sm:items-center">
              <span className="font-semibold text-ink-700">{heroImage.caption}</span>
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="mx-auto grid max-w-content grid-cols-1 items-start gap-10 lg:grid-cols-12">
        {hasToc ? (
          <aside
            aria-label={content.toc}
            className="sticky top-28 hidden space-y-6 lg:col-span-3 lg:block"
          >
            <ArticleToc headings={headings} title={content.toc} />
          </aside>
        ) : null}

        <article className={`${articleColumns} mx-auto w-full max-w-[720px]`}>
          <RichText className="article-content" content={article.content} locale={locale} />

          <div className="mt-12 space-y-6 border-t border-line pt-8">
            <ArticleShare
              locale={locale}
              title={article.title}
              url={shareUrl}
              variant="bottom"
            />
          </div>

          {preview ? (
            <p
              className="mt-12 border-t border-line pt-4 text-meta text-ink-500"
              dir="auto"
              suppressHydrationWarning
            >
              {content.meta.updated}: {updatedAt}
            </p>
          ) : null}
        </article>

        {hasLatest ? (
          <aside
            aria-label={content.latest.title}
            className="hidden space-y-6 lg:col-span-3 lg:block"
          >
            <div className="rounded-card border border-line bg-surface p-5 shadow-xs">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3">
                <h2 className="m-0 flex items-center gap-2 font-headline text-body-ui font-bold text-green-900">
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                  <span>{content.latest.title}</span>
                </h2>
                <a
                  className="text-label font-bold text-green-600 transition-colors hover:text-green-700"
                  href={categoryLink}
                >
                  {content.latest.more}
                </a>
              </div>

              <div className="space-y-4">
                {latestItems.map((item) => {
                  const image = isDoc<Media>(item.heroImage) ? item.heroImage : null
                  const relative = formatRelativeArticleDate(
                    item.publishedAt ?? item.createdAt,
                    locale,
                  )

                  return (
                    <a
                      className="group flex items-center gap-3"
                      href={articleHref(locale, item)}
                      key={item.id}
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-card bg-green-100">
                        {image?.url ? (
                          <Image
                            alt={image.alt ?? item.title}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            fill
                            sizes="64px"
                            src={image.url}
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="m-0 line-clamp-2 font-headline text-xs font-bold leading-snug text-ink-900 transition-colors group-hover:text-green-600">
                          {item.title}
                        </h3>
                        {relative ? (
                          <span className="text-[11px] text-ink-500" suppressHydrationWarning>
                            {relative}
                          </span>
                        ) : null}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      {relatedItems.length > 0 ? (
        <section aria-labelledby="related-articles-title" className="my-14 border-t border-line pt-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3">
            <div>
              <h2
                className="m-0 font-headline text-h2 font-bold text-green-900"
                id="related-articles-title"
              >
                {content.related.title}
              </h2>
              <div className="mt-1 h-[3px] w-12 rounded-full bg-gold-500" />
            </div>

            <a
              className="group inline-flex items-center gap-1.5 font-headline text-body-ui font-bold text-green-600 transition-colors hover:text-green-700"
              href={categoryLink}
            >
              <span>{content.related.more}</span>
              <ArrowIcon className="h-[19px] w-[19px] transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedItems.map((teaser) => (
              <RelatedCard
                key={teaser.id}
                locale={locale}
                readLabel={content.related.read}
                teaser={teaser}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section
        aria-labelledby="article-newsletter-title"
        className="pattern-architectural relative my-14 overflow-hidden rounded-card border border-gold-500/30 bg-green-900 p-8 text-white shadow-md sm:p-10"
        id="newsletter-block"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <MailCheckIcon className="mb-2 h-8 w-8 text-gold-400" />
          <h2
            className="m-0 mb-2 font-headline text-h2 font-extrabold text-white"
            id="article-newsletter-title"
          >
            {content.newsletter.title}
          </h2>
          <p className="m-0 mb-6 max-w-lg text-body-ui leading-relaxed text-gold-300">
            {content.newsletter.description}
          </p>

          <form
            action="#newsletter-block"
            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              aria-label={content.newsletter.emailLabel}
              className="h-12 flex-1 rounded-card border border-line bg-surface px-4 text-body-ui text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder={content.newsletter.placeholder}
              required
              type="email"
            />
            <button
              className="h-12 whitespace-nowrap rounded-card bg-gold-500 px-8 font-headline text-body-ui font-bold text-green-950 shadow-sm transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-green-900"
              type="submit"
            >
              {content.newsletter.button}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default ArticleView

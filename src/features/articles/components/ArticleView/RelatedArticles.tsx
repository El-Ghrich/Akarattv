import Image from 'next/image'

import { ArrowIcon } from '@/shared/ui/icons'
import type { Category, Media } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { formatArticleDate } from '@/features/articles/lib/article'

import type { ArticleTeaser } from './types'
import { articleHref, isDoc } from './utils'

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

type RelatedArticlesProps = {
  categoryLink: string
  content: import('@/features/articles/content/article').ArticleContent
  items: ArticleTeaser[]
  locale: Locale
}

export function RelatedArticles({ categoryLink, content, items, locale }: RelatedArticlesProps) {
  if (items.length === 0) return null

  return (
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
        {items.map((teaser) => (
          <RelatedCard
            key={teaser.id}
            locale={locale}
            readLabel={content.related.read}
            teaser={teaser}
          />
        ))}
      </div>
    </section>
  )
}

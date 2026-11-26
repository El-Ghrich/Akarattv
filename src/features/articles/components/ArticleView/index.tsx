import { AdSlot } from '@/features/ads/components/AdSlot'
import { ArticleShare } from '@/features/articles/components/ArticleShare'
import { ArticleToc } from '@/features/articles/components/ArticleToc'
import { RichText } from '@/features/articles/components/RichText'
import type { Author, Region } from '@/payload-types'
import { articleContent } from '@/features/articles/content/article'
import { formatArticleDate, getArticleHeadings, getReadingTime } from '@/features/articles/lib/article'
import { categoryHref } from '@/shared/lib/urls'

import { ArticleHeader } from './ArticleHeader'
import { ArticleHero } from './ArticleHero'
import { ArticleNewsletter } from './ArticleNewsletter'
import { ArticleRail } from './ArticleRail'
import { RelatedArticles } from './RelatedArticles'
import type { ArticleViewProps } from './types'
import { articleColumnClass, getArticleLayout, isDoc } from './utils'

export type { ArticleTeaser, ArticleViewProps } from './types'
export { articleHref, isDoc } from './utils'

export function ArticleView({
  article,
  latest = [],
  locale,
  preview = false,
  shareUrl,
  showAdSlots = false,
}: ArticleViewProps) {
  const content = articleContent[locale]
  const author = isDoc<Author>(article.author) ? article.author : null
  const region = isDoc<Region>(article.region) ? article.region : null
  const updatedAt = formatArticleDate(article.updatedAt, locale, true)
  const readingMinutes = getReadingTime(article.content, locale)
  const headings = getArticleHeadings(article.content)
  const isDraft = article._status === 'draft'

  const {
    category,
    hasLatest,
    hasRightRail,
    hasToc,
    heroImage,
    latestItems,
    relatedItems,
  } = getArticleLayout(article, latest, headings, showAdSlots)

  const categoryLink = category ? categoryHref(locale, category.slug) : `/${locale}#latest-news`

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <ArticleHeader
        article={article}
        author={author}
        category={category}
        content={content}
        isDraft={isDraft}
        locale={locale}
        preview={preview}
        readingMinutes={readingMinutes}
        region={region}
        updatedAt={updatedAt}
      />

      <ArticleShare locale={locale} title={article.title} url={shareUrl} />

      <ArticleHero image={heroImage} title={article.title} />

      <div className="mx-auto grid max-w-content grid-cols-1 items-start gap-10 lg:grid-cols-12">
        {hasToc ? (
          <aside
            aria-label={content.toc}
            className="sticky top-28 hidden space-y-6 lg:col-span-3 lg:block"
          >
            <ArticleToc headings={headings} title={content.toc} />
          </aside>
        ) : null}

        <article className={`${articleColumnClass({ hasRightRail, hasToc })} mx-auto w-full max-w-[720px]`}>
          <RichText
            className="article-content"
            content={article.content}
            locale={locale}
            showAdSlot={showAdSlots}
          />

          {showAdSlots ? <AdSlot locale={locale} slot="article-end" /> : null}

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

        {hasRightRail ? (
          <ArticleRail
            categoryLink={categoryLink}
            content={content}
            hasLatest={hasLatest}
            items={latestItems}
            locale={locale}
            showAdSlots={showAdSlots}
          />
        ) : null}
      </div>

      <RelatedArticles
        categoryLink={categoryLink}
        content={content}
        items={relatedItems}
        locale={locale}
      />

      <ArticleNewsletter content={content} />
    </div>
  )
}

export default ArticleView

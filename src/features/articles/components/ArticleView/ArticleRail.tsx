import Image from 'next/image'

import { AdSlot } from '@/features/ads/components/AdSlot'
import { adsCopy } from '@/features/ads/content/adsCopy'
import type { ArticleContent } from '@/features/articles/content/article'
import type { Locale } from '@/i18n/routing'
import { formatRelativeArticleDate } from '@/features/articles/lib/article'

import type { ArticleTeaser } from './types'
import { articleHref, isDoc } from './utils'

type ArticleRailProps = {
  categoryLink: string
  content: ArticleContent
  hasLatest: boolean
  items: ArticleTeaser[]
  locale: Locale
  showAdSlots: boolean
}

export function ArticleRail({
  categoryLink,
  content,
  hasLatest,
  items,
  locale,
  showAdSlots,
}: ArticleRailProps) {
  return (
    <aside
      aria-label={hasLatest ? content.latest.title : adsCopy[locale].marker}
      className="hidden space-y-6 lg:col-span-3 lg:block"
    >
      {showAdSlots ? <AdSlot locale={locale} slot="sidebar" /> : null}
      {hasLatest ? (
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
            {items.map((item) => {
              const image = isDoc<import('@/payload-types').Media>(item.heroImage)
                ? item.heroImage
                : null
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
      ) : null}
    </aside>
  )
}

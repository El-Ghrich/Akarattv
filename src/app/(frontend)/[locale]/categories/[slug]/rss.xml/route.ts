import { hasLocale } from 'next-intl'

import { routing, type Locale } from '@/i18n/routing'
import { buildRssFeed, findCategory, getFeedArticles } from '@/utilities/feeds'
import { decodeSlug } from '@/utilities/urls'

export const revalidate = 600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale, slug: rawSlug } = await params

  if (!hasLocale(routing.locales, locale)) {
    return new Response('Not found', { status: 404 })
  }

  const typedLocale: Locale = locale
  // Slugs are localized, so a French feed URL must not resolve an Arabic slug.
  const category = await findCategory(decodeSlug(rawSlug), typedLocale)

  if (!category) {
    return new Response('Not found', { status: 404 })
  }

  const articles = await getFeedArticles(typedLocale, category.id)

  return new Response(buildRssFeed(articles, { category, locale: typedLocale }), {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

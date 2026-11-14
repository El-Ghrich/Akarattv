import { hasLocale } from 'next-intl'

import { routing, type Locale } from '@/i18n/routing'
import { buildRssFeed, getFeedArticles } from '@/utilities/feeds'

export const revalidate = 600

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return new Response('Not found', { status: 404 })
  }

  const typedLocale: Locale = locale
  const articles = await getFeedArticles(typedLocale)

  return new Response(buildRssFeed(articles, { locale: typedLocale }), {
    headers: {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}

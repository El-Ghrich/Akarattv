import { routing } from '@/i18n/routing'
import { buildNewsSitemap, getNewsArticles } from '@/utilities/feeds'

/**
 * Google News sitemap: published stories from the last 48 hours across both
 * locales. Unlike `/sitemap.xml` this must stay small and recent, so it is
 * rebuilt every hour.
 */
export const revalidate = 3600

export async function GET() {
  const groups = await Promise.all(
    routing.locales.map(async (locale) => ({
      articles: await getNewsArticles(locale),
      locale,
    })),
  )

  return new Response(buildNewsSitemap(groups), {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

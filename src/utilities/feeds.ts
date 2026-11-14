import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Article, Category, Media } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { absoluteURL, siteDescription, siteName } from '@/utilities/seo'
import { articlePath, categoryPath } from '@/utilities/urls'

/**
 * RSS + Google News sitemap builders.
 *
 * Both are plain XML routes rather than Next metadata files, so they can be
 * scoped per locale (and per category) and stream a fresh read of the
 * published articles.
 */

const FEED_LIMIT = 40

/** Google News only indexes stories published in the last 48 hours. */
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000

const isDoc = <T,>(value: unknown): value is T =>
  value !== null && typeof value === 'object' && 'id' in (value as object)

export const xmlEscape = (value: string): string =>
  value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "'": '&apos;',
        '"': '&quot;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
      })[character] ?? character,
  )

const imageURL = (media: unknown): string | undefined => {
  if (!isDoc<Media>(media)) return undefined

  const url = media.sizes?.large?.url ?? media.sizes?.medium?.url ?? media.url

  return url ? absoluteURL(url) : undefined
}

const categoryOf = (article: Article): Category | null =>
  isDoc<Category>(article.category) ? article.category : null

export const findCategory = async (
  slug: string,
  locale: Locale,
): Promise<Category | null> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] ?? null
}

export const getFeedArticles = async (
  locale: Locale,
  categoryID?: number,
): Promise<Article[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    fallbackLocale: false,
    limit: FEED_LIMIT,
    locale,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        ...(categoryID ? [{ category: { equals: categoryID } }] : []),
      ],
    },
  })

  return result.docs
}

type NewsArticleRow = {
  publishedAt?: null | string
  slug?: null | string
  title: string
}

export const getNewsArticles = async (locale: Locale): Promise<NewsArticleRow[]> => {
  const payload = await getPayload({ config })
  const since = new Date(Date.now() - NEWS_WINDOW_MS).toISOString()

  const result = await payload.find({
    collection: 'articles',
    depth: 0,
    fallbackLocale: false,
    limit: 1000,
    locale,
    overrideAccess: false,
    select: { publishedAt: true, slug: true, title: true },
    sort: '-publishedAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { publishedAt: { greater_than_equal: since } },
      ],
    },
  })

  return result.docs as unknown as NewsArticleRow[]
}

export type FeedOptions = {
  category?: Category
  locale: Locale
}

/** RSS 2.0 feed for a language, or for one category in that language. */
export const buildRssFeed = (
  articles: Article[],
  { category, locale }: FeedOptions,
): string => {
  const language = locale === 'ar' ? 'ar-MA' : 'fr-MA'
  const title = category ? `${category.title} — ${siteName(locale)}` : siteName(locale)
  const description = category?.description || siteDescription(locale)
  const path = category
    ? `/${locale}${categoryPath(category.slug)}`
    : `/${locale}`
  const url = absoluteURL(path)
  const feedURL = absoluteURL(`${path}/rss.xml`)

  const items = articles
    .map((article) => {
      if (!article.slug) return ''

      const link = absoluteURL(`/${locale}${articlePath(article.slug)}`)
      const published = new Date(article.publishedAt ?? article.createdAt).toUTCString()
      const image = imageURL(article.heroImage)
      const section = categoryOf(article)?.title

      return `<item>
  <title>${xmlEscape(article.title)}</title>
  <link>${xmlEscape(link)}</link>
  <guid isPermaLink="true">${xmlEscape(link)}</guid>
  <pubDate>${published}</pubDate>
  <description>${xmlEscape(article.excerpt)}</description>
  ${section ? `<category>${xmlEscape(section)}</category>` : ''}
  ${image ? `<enclosure url="${xmlEscape(image)}" type="image/jpeg" length="0" />` : ''}
</item>`
    })
    .filter(Boolean)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${xmlEscape(title)}</title>
    <link>${xmlEscape(url)}</link>
    <description>${xmlEscape(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${xmlEscape(feedURL)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

const newsBlock = (article: NewsArticleRow, locale: Locale): string => {
  const url = absoluteURL(`/${locale}${articlePath(article.slug ?? '')}`)
  const published = new Date(article.publishedAt ?? Date.now()).toISOString()

  return `  <url>
    <loc>${xmlEscape(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(siteName(locale))}</news:name>
        <news:language>${locale}</news:language>
      </news:publication>
      <news:publication_date>${published}</news:publication_date>
      <news:title>${xmlEscape(article.title)}</news:title>
    </news:news>
  </url>`
}

/** One `urlset` covering every locale's last-48h stories. */
export const buildNewsSitemap = (
  groups: { articles: NewsArticleRow[]; locale: Locale }[],
): string => {
  const urls = groups
    .flatMap(({ articles, locale }) =>
      articles.filter((article) => article.slug).map((article) => newsBlock(article, locale)),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`
}

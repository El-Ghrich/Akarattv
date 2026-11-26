import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Article } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { CONTENT_TAGS } from '@/shared/lib/cacheTags'
import { REVALIDATE_SECONDS } from '@/shared/lib/content/constants'

const fetchArticle = async (
  slug: string,
  locale: Locale,
  draft: boolean,
): Promise<Article | null> => {
  const payload = await getPayload({ config })
  const isID = /^\d+$/.test(slug)

  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: false,
    where: isID ? { id: { equals: Number(slug) } } : { slug: { equals: slug } },
  })

  return result.docs[0] ?? null
}

const getCachedArticle = unstable_cache(
  async (slug: string, locale: Locale): Promise<Article | null> =>
    fetchArticle(slug, locale, false),
  ['article-by-slug'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.articles],
  },
)

/**
 * Published reads are cached across requests. Draft previews are never cached:
 * they depend on the current editor and must always read the latest version.
 */
export const getArticle = (slug: string, locale: Locale, draft: boolean): Promise<Article | null> =>
  draft ? fetchArticle(slug, locale, true) : getCachedArticle(slug, locale)

export const getLatestArticles = unstable_cache(
  async (locale: Locale, excludeID: number): Promise<Article[]> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'articles',
      depth: 1,
      fallbackLocale: false,
      limit: 6,
      locale,
      overrideAccess: false,
      sort: '-publishedAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { id: { not_equals: excludeID } },
        ],
      },
    })

    return result.docs
  },
  ['latest-articles'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.articles],
  },
)

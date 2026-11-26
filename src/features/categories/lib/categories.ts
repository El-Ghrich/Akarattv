import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Category } from '@/payload-types'
import type { HomeCard } from '@/features/home/content'
import type { LocaleAlternate } from '@/i18n/alternates'
import { routing, type Locale } from '@/i18n/routing'
import { CONTENT_TAGS } from '@/shared/lib/cacheTags'
import { categoryPath } from '@/shared/lib/urls'
import { cacheOptions, PAGE_SIZE, REVALIDATE_SECONDS } from '@/shared/lib/content/constants'
import { toHomeCard } from '@/shared/lib/content/shared'

export const fetchCategories = async (locale: Locale): Promise<Category[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'categories',
    depth: 0,
    fallbackLocale: false,
    limit: 100,
    locale,
    overrideAccess: false,
    pagination: false,
    sort: 'id',
  })

  return result.docs
}

export type CategoryPageData = {
  cards: HomeCard[]
  category: Category
  page: number
  totalDocs: number
  totalPages: number
}

export const getCategoryPage = unstable_cache(
  async (slug: string, locale: Locale, page: number): Promise<CategoryPageData | null> => {
    const payload = await getPayload({ config })

    // Slugs are localized, so the lookup is locale-strict. A French URL with an
    // Arabic category slug must not resolve.
    const categoryResult = await payload.find({
      collection: 'categories',
      depth: 0,
      fallbackLocale: false,
      limit: 1,
      locale,
      overrideAccess: false,
      where: { slug: { equals: slug } },
    })

    const category = categoryResult.docs[0]
    if (!category) return null

    const articles = await payload.find({
      collection: 'articles',
      depth: 1,
      fallbackLocale: false,
      limit: PAGE_SIZE,
      locale,
      overrideAccess: false,
      page,
      sort: '-publishedAt',
      where: {
        and: [
          { category: { equals: category.id } },
          { _status: { equals: 'published' } },
        ],
      },
    })

    const categoriesByID = new Map([[category.id, category]])

    return {
      cards: articles.docs.map((article) => toHomeCard(article, locale, categoriesByID)),
      category,
      page: articles.page ?? page,
      totalDocs: articles.totalDocs,
      totalPages: articles.totalPages,
    }
  },
  ['category-page'],
  cacheOptions,
)

/**
 * Builds the language switcher options for a category. The other locale is
 * looked up by document id with `fallbackLocale: false`, so a category that
 * has not been translated renders as a disabled option.
 */
export const getCategoryAlternates = unstable_cache(
  async (
    id: number | string,
    slug: string,
    currentLocale: Locale,
  ): Promise<LocaleAlternate[]> => {
    const payload = await getPayload({ config })

    return Promise.all(
      routing.locales.map(async (locale): Promise<LocaleAlternate> => {
        if (locale === currentLocale) {
          return { href: slug ? categoryPath(slug) : null, locale }
        }

        try {
          const localized = await payload.findByID({
            id,
            collection: 'categories',
            depth: 0,
            fallbackLocale: false,
            locale,
            select: { slug: true },
          })

          const translatedSlug = localized?.slug

          return {
            href: translatedSlug ? categoryPath(translatedSlug) : null,
            locale,
          }
        } catch {
          return { href: null, locale }
        }
      }),
    )
  },
  ['category-alternates'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.categories],
  },
)

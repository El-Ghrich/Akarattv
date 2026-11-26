import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Category, Region } from '@/payload-types'
import type { HomeCard } from '@/features/home/content'
import type { LocaleAlternate } from '@/i18n/alternates'
import { routing, type Locale } from '@/i18n/routing'
import { CONTENT_TAGS } from '@/shared/lib/cacheTags'
import { regionPath } from '@/shared/lib/urls'
import { cacheOptions, PAGE_SIZE, REGIONS_REVALIDATE_SECONDS } from '@/shared/lib/content/constants'
import { toHomeCard } from '@/shared/lib/content/shared'

const fetchRegion = async (slug: string, locale: Locale): Promise<Region | null> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'regions',
    depth: 0,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] ?? null
}

export const fetchRegions = async (locale: Locale): Promise<Region[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'regions',
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

/** Single region lookup, used by the layout and the region archive metadata. */
export const getRegion = unstable_cache(fetchRegion, ['region-by-slug'], {
  revalidate: REGIONS_REVALIDATE_SECONDS,
  tags: [CONTENT_TAGS.regions],
})

export type RegionPageData = {
  cards: HomeCard[]
  page: number
  region: Region
  totalDocs: number
  totalPages: number
}

/**
 * Region archives mirror the category archives: locale-strict slug lookup and
 * the same paginated card grid. Regions have no description field, so the
 * page header only carries the name and the article count.
 */
export const getRegionPage = unstable_cache(
  async (slug: string, locale: Locale, page: number): Promise<RegionPageData | null> => {
    const region = await fetchRegion(slug, locale)
    if (!region) return null

    const payload = await getPayload({ config })

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
          { region: { equals: region.id } },
          { _status: { equals: 'published' } },
        ],
      },
    })

    const categoriesByID = new Map<number, Category>()

    return {
      cards: articles.docs.map((article) => toHomeCard(article, locale, categoriesByID)),
      page: articles.page ?? page,
      region,
      totalDocs: articles.totalDocs,
      totalPages: articles.totalPages,
    }
  },
  ['region-page'],
  cacheOptions,
)

/**
 * Same contract as `getCategoryAlternates`: the other locale is read by id with
 * `fallbackLocale: false`, so an untranslated region renders as disabled.
 */
export const getRegionAlternates = unstable_cache(
  async (
    id: number | string,
    slug: string,
    currentLocale: Locale,
  ): Promise<LocaleAlternate[]> => {
    const payload = await getPayload({ config })

    return Promise.all(
      routing.locales.map(async (locale): Promise<LocaleAlternate> => {
        if (locale === currentLocale) {
          return { href: slug ? regionPath(slug) : null, locale }
        }

        try {
          const localized = await payload.findByID({
            id,
            collection: 'regions',
            depth: 0,
            fallbackLocale: false,
            locale,
            select: { slug: true },
          })

          return {
            href: localized?.slug ? regionPath(localized.slug) : null,
            locale,
          }
        } catch {
          return { href: null, locale }
        }
      }),
    )
  },
  ['region-alternates'],
  {
    revalidate: REGIONS_REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.regions],
  },
)

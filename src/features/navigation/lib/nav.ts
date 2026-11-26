import { unstable_cache } from 'next/cache'

import { fetchCategories } from '@/features/categories/lib/categories'
import { homeContent, type HomeLink } from '@/features/home/content'
import { fetchRegions } from '@/features/regions/lib/regions'
import type { Locale } from '@/i18n/routing'
import { CONTENT_TAGS } from '@/shared/lib/cacheTags'
import {
  FOOTER_REGION_LIMIT,
  REVALIDATE_SECONDS,
  REGIONS_REVALIDATE_SECONDS,
} from '@/shared/lib/content/constants'
import { categoryLinks, groupedCategoryLinks, regionLinks } from '@/shared/lib/content/shared'

export type FooterNav = {
  regions: HomeLink[]
  sections: HomeLink[]
}

export const getCategoryNav = unstable_cache(
  async (locale: Locale): Promise<HomeLink[]> => {
    const categories = await fetchCategories(locale)
    const home: HomeLink = {
      href: '/',
      label: locale === 'ar' ? 'الرئيسية' : 'Accueil',
    }

    // The header always starts with the homepage, then the live categories.
    // Returning the static editorial anchors here would reintroduce the
    // scroll-vs-route behaviour.
    return [home, ...groupedCategoryLinks(categories, locale)]
  },
  ['category-nav'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.categories],
  },
)

/**
 * The footer mixes two Payload collections with two static editorial columns.
 * Both lists are cached with their own tags, so a region or category edit
 * refreshes the footer everywhere without touching article caches.
 */
export const getFooterNav = unstable_cache(
  async (locale: Locale): Promise<FooterNav> => {
    const [categories, regions] = await Promise.all([
      fetchCategories(locale),
      fetchRegions(locale),
    ])
    const fallback = homeContent[locale].regions.items
    const liveRegions = regionLinks(regions).slice(0, FOOTER_REGION_LIMIT)

    return {
      regions: liveRegions.length > 0 ? liveRegions : fallback.slice(0, FOOTER_REGION_LIMIT),
      sections: categoryLinks(categories),
    }
  },
  ['footer-nav'],
  {
    revalidate: REGIONS_REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.categories, CONTENT_TAGS.regions],
  },
)

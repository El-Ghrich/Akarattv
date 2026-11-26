import type { Locale } from '@/i18n/routing'
import { CONTENT_TAGS } from '@/shared/lib/cacheTags'

export const REVALIDATE_SECONDS = 3600

/**
 * Regions change rarely and are read on every page (header chips, footer,
 * archives), so the safety net is a day. Edits in the admin still invalidate
 * the `regions` tag immediately.
 */
export const REGIONS_REVALIDATE_SECONDS = 60 * 60 * 24

export const PAGE_SIZE = 9

export const cacheOptions = {
  revalidate: REVALIDATE_SECONDS,
  tags: [CONTENT_TAGS.articles, CONTENT_TAGS.categories, CONTENT_TAGS.regions],
}

/**
 * The three housing archives sit behind a single header entry. Slugs are
 * localized, so both spellings are listed; only the ones that exist in the
 * current locale are pulled into the group.
 */
export const HOUSING_SLUGS = new Set([
  'سكن-اقتصادي',
  'سكن-متوسط',
  'سكن-عالي',
  'logement-economique',
  'logement-intermediaire',
  'logement-haut-standing',
])

export const HOUSING_LABEL: Record<Locale, string> = {
  ar: 'السكن',
  fr: 'Logement',
}

/**
 * The footer and the homepage chips lead with the regions the old static city
 * list used to cover; any other region follows by id.
 */
export const PRIORITY_REGION_SLUGS = [
  'casablanca-settat',
  'rabat-sale-kenitra',
  'marrakech-safi',
  'tanger-tetouan-al-hoceima',
  'fes-meknes',
  'souss-massa',
]

export const FOOTER_REGION_LIMIT = 6

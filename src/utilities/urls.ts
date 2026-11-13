import type { Locale } from '@/i18n/routing'

/**
 * URL helpers shared by server pages and client components. Slugs are
 * localized, and Arabic slugs need percent-encoding, so every call site must
 * build article and category links the same way.
 */
export const articlePath = (slug: string): string => `/articles/${encodeURIComponent(slug)}`

export const categoryPath = (slug: string): string => `/categories/${encodeURIComponent(slug)}`

export const regionPath = (slug: string): string => `/regions/${encodeURIComponent(slug)}`

export const articleHref = (locale: Locale, slug: string): string =>
  `/${locale}${articlePath(slug)}`

export const categoryHref = (locale: Locale, slug: string): string =>
  `/${locale}${categoryPath(slug)}`

export const regionHref = (locale: Locale, slug: string): string =>
  `/${locale}${regionPath(slug)}`

/**
 * Dynamic route params arrive percent-encoded. A malformed escape sequence
 * should fall back to the raw value rather than throw.
 */
export const decodeSlug = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

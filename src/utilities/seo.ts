import { homeContent } from '@/content/home'
import type { LocaleAlternate } from '@/i18n/alternates'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import type { Article, Author, Category, Media } from '@/payload-types'
import { getServerURL } from '@/utilities/serverURL'

/**
 * Shared SEO primitives: absolute URLs, cross-locale hreflang maps and the
 * JSON-LD graphs used across the public site.
 *
 * Relative paths are returned where Next can resolve them against
 * `metadataBase` (set by the locale layout). JSON-LD is consumed by crawlers
 * outside that machinery, so it always gets fully-qualified URLs.
 */

export type JsonLdObject = Record<string, unknown>

const LOGO_PATH = '/logo.png'

const ORGANIZATION_NAME = 'Akarat TV'

export const siteURL = (): string => {
  const configured = getServerURL()

  return (configured ?? 'http://localhost:3000').replace(/\/$/, '')
}

export const absoluteURL = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path

  return `${siteURL()}${path.startsWith('/') ? '' : '/'}${path}`
}

export const siteName = (locale: Locale): string => homeContent[locale].header.siteName

export const siteDescription = (locale: Locale): string =>
  homeContent[locale].footer.description

const isDoc = <T,>(value: unknown): value is T =>
  value !== null && typeof value === 'object' && 'id' in (value as object)

/** Prefers the largest generated variant; R2 URLs are already absolute. */
export const mediaURL = (media?: Media | number | null): string | undefined => {
  if (!isDoc<Media>(media)) return undefined

  const url = media.sizes?.large?.url ?? media.sizes?.medium?.url ?? media.url

  return url ? absoluteURL(url) : undefined
}

/**
 * Builds the `alternates.languages` map from the same translations the locale
 * switcher uses.
 *
 * An entry is only emitted when the page exists in that locale. When just one
 * locale is translated there is nothing to cross-link, so no map is returned
 * at all. `x-default` points at the default locale's translation.
 */
export const alternateLanguages = (
  alternates: LocaleAlternate[],
): Record<string, string> | undefined => {
  const translated = alternates.filter(
    (alternate): alternate is LocaleAlternate & { href: string } => Boolean(alternate.href),
  )

  if (translated.length < 2) return undefined

  const languages: Record<string, string> = {}

  for (const alternate of translated) {
    languages[alternate.locale] = getPathname({
      href: alternate.href,
      locale: alternate.locale,
    })
  }

  const defaultAlternate = translated.find(
    (alternate) => alternate.locale === routing.defaultLocale,
  )

  if (defaultAlternate) {
    languages['x-default'] = getPathname({
      href: defaultAlternate.href,
      locale: routing.defaultLocale,
    })
  }

  return languages
}

/** Both locale homepages always exist, so the pair is statically linkable. */
export const homeLanguages = (): Record<string, string> => ({
  'x-default': `/${routing.defaultLocale}`,
  ...Object.fromEntries(routing.locales.map((locale) => [locale, `/${locale}`])),
})

/** Open Graph locale codes, as expected by `og:locale`. */
export const openGraphLocale = (locale: Locale): string => (locale === 'ar' ? 'ar_MA' : 'fr_MA')

/** Schema.org languages for articles; the UI language is the Moroccan variant. */
const schemaLanguage = (locale: Locale): string => (locale === 'ar' ? 'ar-MA' : 'fr-MA')

const organizationReference = (): JsonLdObject => ({
  '@id': `${siteURL()}/#organization`,
})

export const organizationJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteURL()}/#organization`,
  name: ORGANIZATION_NAME,
  alternateName: ['عقارات تيفي', 'Akarattv'],
  url: siteURL(),
  logo: {
    '@type': 'ImageObject',
    url: absoluteURL(LOGO_PATH),
  },
})

export const websiteJsonLd = (locale: Locale): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteURL()}/#website-${locale}`,
  name: siteName(locale),
  alternateName: ORGANIZATION_NAME,
  description: siteDescription(locale),
  url: absoluteURL(`/${locale}`),
  inLanguage: locale,
  publisher: organizationReference(),
})

export type BreadcrumbItem = {
  name: string
  /** Locale-prefixed path, for example `/ar/categories/market`. */
  path: string
}

export const breadcrumbJsonLd = (items: BreadcrumbItem[]): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteURL(item.path),
  })),
})

/**
 * `NewsArticle` for a published article. Author, section and image are only
 * included when the relationship is populated on the document.
 */
export const newsArticleJsonLd = (
  article: Article,
  locale: Locale,
  path: string,
): JsonLdObject => {
  const author = isDoc<Author>(article.author) ? article.author : null
  const category = isDoc<Category>(article.category) ? article.category : null
  const image = mediaURL(isDoc<Media>(article.heroImage) ? article.heroImage : null)
  const url = absoluteURL(`/${locale}${path}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: article.title,
    description: article.excerpt || undefined,
    image: image ? [image] : undefined,
    datePublished: article.publishedAt ?? article.createdAt,
    dateModified: article.updatedAt,
    inLanguage: schemaLanguage(locale),
    articleSection: category?.title,
    author: author
      ? [
          {
            '@type': 'Person',
            name: author.name,
            ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
          },
        ]
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION_NAME,
      url: siteURL(),
      logo: {
        '@type': 'ImageObject',
        url: absoluteURL(LOGO_PATH),
      },
    },
    url,
  }
}

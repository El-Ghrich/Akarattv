import type { Metadata } from 'next'

import { infoContent, type InfoPageSlug } from '@/features/info/content'
import type { LocaleAlternate } from '@/i18n/alternates'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { alternateLanguages, openGraphLocale, siteName } from '@/features/seo/lib/seo'

export const infoPagePath = (slug: InfoPageSlug): string => `/${slug}`

export const infoPageHref = (slug: InfoPageSlug, locale: Locale): string =>
  getPathname({ href: infoPagePath(slug), locale })

/** Both locales always have these pages, so the switcher never disables them. */
export const infoPageAlternates = (slug: InfoPageSlug): LocaleAlternate[] =>
  routing.locales.map((locale) => ({ href: infoPagePath(slug), locale }))

export const infoPageMetadata = (slug: InfoPageSlug, locale: Locale): Metadata => {
  const content = infoContent[locale][slug]
  const path = infoPageHref(slug, locale)

  return {
    alternates: {
      canonical: path,
      languages: alternateLanguages(infoPageAlternates(slug)),
    },
    description: content.description,
    openGraph: {
      description: content.description,
      locale: openGraphLocale(locale),
      siteName: siteName(locale),
      title: content.title,
      type: 'website',
      url: path,
    },
    title: content.title,
    twitter: {
      card: 'summary_large_image',
      description: content.description,
      title: content.title,
    },
  }
}

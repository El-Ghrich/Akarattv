import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { LocaleAlternate } from '@/i18n/alternates'
import { routing, type Locale } from '@/i18n/routing'

type LocalizedSlug = {
  slug?: null | string
}

/**
 * Builds the switcher's option for the article being rendered.
 *
 * Slugs are localized, so the French URL is not the Arabic URL with a
 * different prefix. Each alternate is looked up with `fallbackLocale: false`:
 * when the other locale has no slug of its own, the article is not translated
 * and the switcher must render the option as disabled instead of linking to a
 * page that would resolve to the wrong language.
 *
 * `cache` is keyed by primitives so `generateMetadata` and the page share the
 * lookups within one request.
 */
export const getArticleAlternates = cache(
  async (id: number | string, slug: string, currentLocale: Locale): Promise<LocaleAlternate[]> => {
    const payload = await getPayload({ config })

    return Promise.all(
      routing.locales.map(async (locale): Promise<LocaleAlternate> => {
        if (locale === currentLocale) {
          return {
            href: slug ? `/articles/${encodeURIComponent(slug)}` : null,
            locale,
          }
        }

        try {
          const localized = await payload.findByID({
            id,
            collection: 'articles',
            depth: 0,
            fallbackLocale: false,
            locale,
            select: { slug: true },
          })

          const translatedSlug = (localized as LocalizedSlug | null)?.slug

          return {
            href: translatedSlug ? `/articles/${encodeURIComponent(translatedSlug)}` : null,
            locale,
          }
        } catch {
          return { href: null, locale }
        }
      }),
    )
  },
)

import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { routing, type Locale } from '@/i18n/routing'
import { absoluteURL } from '@/utilities/seo'
import { articlePath, categoryPath, regionPath } from '@/utilities/urls'

/**
 * `/sitemap.xml` with one URL per locale plus `hreflang` alternates.
 *
 * Alternates are only emitted when the document is translated into both
 * languages, matching the switcher and the page metadata. Regenerated hourly;
 * the underlying reads are cheap (id, slug, updatedAt only).
 */

export const revalidate = 3600

type Collection = 'articles' | 'categories' | 'regions'

type DocRow = {
  id: number
  slug?: null | string
  updatedAt: string
}

type Entry = {
  slugs: Partial<Record<Locale, string>>
  updatedAt: string
}

const fetchRows = async (
  collection: Collection,
  locale: Locale,
  publishedOnly: boolean,
): Promise<DocRow[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection,
    depth: 0,
    fallbackLocale: false,
    locale,
    overrideAccess: false,
    pagination: false,
    select: { slug: true, updatedAt: true },
    ...(publishedOnly
      ? { where: { _status: { equals: 'published' } } }
      : {}),
  })

  return result.docs as unknown as DocRow[]
}

/** Groups every locale's version of a document by its shared id. */
const collectEntries = async (
  collection: Collection,
  publishedOnly = false,
): Promise<Map<number, Entry>> => {
  const byId = new Map<number, Entry>()

  for (const locale of routing.locales) {
    const rows = await fetchRows(collection, locale, publishedOnly)

    for (const row of rows) {
      if (!row.slug) continue

      const entry = byId.get(row.id) ?? { slugs: {}, updatedAt: row.updatedAt }
      entry.slugs[locale] = row.slug
      entry.updatedAt = row.updatedAt
      byId.set(row.id, entry)
    }
  }

  return byId
}

const languageVersions = (entry: Entry, pathFor: (slug: string) => string) => {
  const languages: Record<string, string> = {}

  for (const locale of routing.locales) {
    const slug = entry.slugs[locale]
    if (slug) languages[locale] = absoluteURL(`/${locale}${pathFor(slug)}`)
  }

  // Only cross-link when the page actually exists in both languages.
  if (!languages.ar || !languages.fr) return undefined

  return { ...languages, 'x-default': languages.ar }
}

const archiveEntries = (
  entries: Map<number, Entry>,
  pathFor: (slug: string) => string,
  changeFrequency: 'daily' | 'weekly',
  priority: number,
): MetadataRoute.Sitemap =>
  [...entries.values()].flatMap((entry) => {
    const languages = languageVersions(entry, pathFor)

    return routing.locales.flatMap((locale) => {
      const slug = entry.slugs[locale]
      if (!slug) return []

      return [
        {
          alternates: languages ? { languages } : undefined,
          changeFrequency,
          lastModified: entry.updatedAt,
          priority,
          url: absoluteURL(`/${locale}${pathFor(slug)}`),
        },
      ]
    })
  })

const homeEntries = (): MetadataRoute.Sitemap => {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, absoluteURL(`/${locale}`)]),
  )

  return routing.locales.map((locale) => ({
    alternates: { languages: { ...languages, 'x-default': languages.ar } },
    changeFrequency: 'hourly' as const,
    priority: 1,
    url: absoluteURL(`/${locale}`),
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, regions] = await Promise.all([
    collectEntries('articles', true),
    collectEntries('categories'),
    collectEntries('regions'),
  ])

  return [
    ...homeEntries(),
    ...archiveEntries(categories, categoryPath, 'weekly', 0.8),
    ...archiveEntries(regions, regionPath, 'weekly', 0.7),
    ...archiveEntries(articles, articlePath, 'daily', 0.9),
  ]
}

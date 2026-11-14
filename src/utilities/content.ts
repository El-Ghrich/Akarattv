import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Article, Category, Media, Region, Video } from '@/payload-types'
import {
  homeContent,
  type HomeCard,
  type HomeContent,
  type HomeLink,
  type HomeSection,
} from '@/content/home'
import type { LocaleAlternate } from '@/i18n/alternates'
import { routing, type Locale } from '@/i18n/routing'
import { formatRelativeArticleDate, getReadingTime } from '@/utilities/article'
import { CONTENT_TAGS } from '@/utilities/cacheTags'
import { articlePath, categoryPath, regionPath } from '@/utilities/urls'
import { extractYouTubeId, youtubeThumbnail } from '@/utilities/youtube'

/**
 * Payload-backed content, cached with tags so a save in the admin can
 * invalidate the affected pages on demand (see `src/utilities/revalidate.ts`).
 *
 * Everything here runs on the server. `unstable_cache` needs primitive
 * arguments: the locale, slug and page number are all part of the cache key.
 */

const REVALIDATE_SECONDS = 3600

/**
 * Regions change rarely and are read on every page (header chips, footer,
 * archives), so the safety net is a day. Edits in the admin still invalidate
 * the `regions` tag immediately.
 */
const REGIONS_REVALIDATE_SECONDS = 60 * 60 * 24

const PAGE_SIZE = 9

const cacheOptions = {
  revalidate: REVALIDATE_SECONDS,
  tags: [CONTENT_TAGS.articles, CONTENT_TAGS.categories, CONTENT_TAGS.regions],
}

const isDoc = <T,>(value: T | number | null | undefined): value is T =>
  value !== null && typeof value === 'object'

const categoryID = (article: Article): number | null => {
  if (isDoc<Category>(article.category)) return article.category.id
  if (typeof article.category === 'number') return article.category

  return null
}

const articleImage = (article: Article): { alt: string; src?: string } => {
  const media = isDoc<Media>(article.heroImage) ? article.heroImage : null

  return {
    alt: media?.alt || article.title,
    src: media?.sizes?.medium?.url ?? media?.url ?? undefined,
  }
}

const readingLabel = (locale: Locale, minutes: number): string =>
  locale === 'ar' ? `قراءة: ${minutes} د` : `Lecture : ${minutes} min`

const articleMeta = (article: Article, locale: Locale): string => {
  const date = formatRelativeArticleDate(article.publishedAt ?? article.createdAt, locale)
  const reading = readingLabel(locale, getReadingTime(article.content, locale))

  return date ? `${date} • ${reading}` : reading
}

const toHomeCard = (
  article: Article,
  locale: Locale,
  categories?: Map<number, Category>,
): HomeCard => {
  const populatedCategory = isDoc<Category>(article.category) ? article.category : null
  const id = categoryID(article)
  const category = populatedCategory ?? (id === null ? null : categories?.get(id) ?? null)
  const image = articleImage(article)

  return {
    alt: image.alt,
    category: category?.title ?? '',
    cta: locale === 'ar' ? 'اقرأ المقال' : "Lire l'article",
    excerpt: article.excerpt || undefined,
    href: articlePath(article.slug),
    imageSrc: image.src,
    meta: articleMeta(article, locale),
    title: article.title,
  }
}

const fetchCategories = async (locale: Locale): Promise<Category[]> => {
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

/**
 * Categories without an explicit `homepageOrder` go after the ordered ones.
 * The id keeps the order stable when editors leave the field empty.
 */
const orderedCategories = (categories: Category[]): Category[] =>
  [...categories].sort((a, b) => {
    const orderA = a.homepageOrder ?? Number.MAX_SAFE_INTEGER
    const orderB = b.homepageOrder ?? Number.MAX_SAFE_INTEGER

    return orderA - orderB || a.id - b.id
  })

const categoryLinks = (categories: Category[]): HomeLink[] =>
  orderedCategories(categories).map((category) => ({
    href: categoryPath(category.slug),
    label: category.title,
  }))

const fetchRegions = async (locale: Locale): Promise<Region[]> => {
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

/**
 * The footer and the homepage chips lead with the regions the old static city
 * list used to cover; any other region follows by id.
 */
const PRIORITY_REGION_SLUGS = [
  'casablanca-settat',
  'rabat-sale-kenitra',
  'marrakech-safi',
  'tanger-tetouan-al-hoceima',
  'fes-meknes',
  'souss-massa',
]

const FOOTER_REGION_LIMIT = 6

const prioritizeRegions = (regions: Region[]): Region[] => {
  const bySlug = new Map(regions.map((region) => [region.slug, region]))
  const priority = PRIORITY_REGION_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (region): region is Region => Boolean(region),
  )
  const rest = regions
    .filter((region) => !PRIORITY_REGION_SLUGS.includes(region.slug))
    .sort((a, b) => a.id - b.id)

  return [...priority, ...rest]
}

const regionLinks = (regions: Region[]): HomeLink[] =>
  prioritizeRegions(regions).map((region) => ({
    href: regionPath(region.slug),
    label: region.name,
  }))

const fetchPublishedArticles = async (locale: Locale, limit = 50): Promise<Article[]> => {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    fallbackLocale: false,
    limit,
    locale,
    overrideAccess: false,
    sort: '-publishedAt',
    where: { _status: { equals: 'published' } },
  })

  return result.docs
}

const buildHomeContent = async (locale: Locale): Promise<HomeContent> => {
  const base = homeContent[locale]
  const [categories, articles, regions] = await Promise.all([
    fetchCategories(locale),
    fetchPublishedArticles(locale),
    fetchRegions(locale),
  ])

  const liveRegions = regionLinks(regions)
  // Regions are the only part of the homepage that survives an empty database:
  // the chips are a navigation aid even before the first article is published.
  const withRegions = (content: HomeContent): HomeContent =>
    liveRegions.length > 0
      ? { ...content, regions: { ...content.regions, items: liveRegions } }
      : content

  // An empty database should still show the designed homepage, not a blank one.
  if (articles.length === 0) return withRegions(base)

  const categoriesByID = new Map(categories.map((category) => [category.id, category]))
  const ordered = orderedCategories(categories)
  const hasHomepageSelection = ordered.some((category) => category.showOnHomepage)

  const articlesByCategory = new Map<number, Article[]>()
  for (const article of articles) {
    const id = categoryID(article)
    if (id === null) continue

    const list = articlesByCategory.get(id) ?? []
    list.push(article)
    articlesByCategory.set(id, list)
  }

  const featuredArticle = articles.find((article) => article.isFeatured) ?? articles[0]
  if (!featuredArticle) return base

  const sidebarArticles = articles
    .filter((article) => article.id !== featuredArticle.id)
    .slice(0, 3)
  const latestArticles = articles
    .filter((article) => article.id !== featuredArticle.id)
    .slice(0, 4)

  const sections: HomeSection[] = []

  for (const category of ordered) {
    if (hasHomepageSelection && !category.showOnHomepage) continue

    const items = articlesByCategory.get(category.id)
    const first = items?.[0]
    if (!first) continue

    sections.push({
      compact: items.slice(1, 4).map((article) => toHomeCard(article, locale, categoriesByID)),
      featured: toHomeCard(first, locale, categoriesByID),
      id: `category-${category.id}`,
      title: category.title,
      viewAll: {
        href: categoryPath(category.slug),
        label: base.latest.viewAll.label,
      },
    })
  }

  // Navbar items always open the category archive. The homepage sections keep
  // their ids for in-page navigation, but the header no longer races a hash
  // jump against the category route.
  const nav: HomeLink[] = categoryLinks(categories)

  return withRegions({
    ...base,
    header: { ...base.header, nav },
    heroZone: {
      ...base.heroZone,
      featured: toHomeCard(featuredArticle, locale, categoriesByID),
      sidebar: {
        ...base.heroZone.sidebar,
        items: sidebarArticles.map((article) => toHomeCard(article, locale, categoriesByID)),
      },
    },
    latest: {
      ...base.latest,
      items: latestArticles.map((article) => toHomeCard(article, locale, categoriesByID)),
    },
    // If no category has a published article yet, keep the designed sections.
    sections: sections.length > 0 ? sections : base.sections,
  })
}

export const getHomeContent = unstable_cache(buildHomeContent, ['home-content'], cacheOptions)

/** Shape the homepage video section needs; keeps the collection type out of components. */
export type HomeVideo = {
  description: string | null
  durationSeconds: number | null
  id: number
  publishedAt: string | null
  thumbnailUrl: string
  title: string
  videoId: string
  viewCount: number | null
  youtubeUrl: string
}

const toHomeVideo = (video: Video): HomeVideo => {
  const videoId = video.videoId ?? extractYouTubeId(video.youtubeUrl) ?? ''

  return {
    description: video.description ?? null,
    durationSeconds: video.durationSeconds ?? null,
    id: video.id,
    publishedAt: video.publishedAt ?? null,
    // `hqdefault` always exists; `maxresdefault` is missing on older uploads.
    thumbnailUrl: video.thumbnailUrl ?? youtubeThumbnail(videoId, 'hq'),
    title: video.title ?? `YouTube ${videoId}`,
    videoId,
    viewCount: video.viewCount ?? null,
    youtubeUrl: video.youtubeUrl,
  }
}

/**
 * The homepage carousel reads its own cache entry, tagged `videos`. Saving a
 * video refreshes this list without dropping the article caches behind
 * `getHomeContent`.
 */
export const getHomeVideos = unstable_cache(
  async (): Promise<HomeVideo[]> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'videos',
      depth: 0,
      limit: 12,
      overrideAccess: false,
      pagination: false,
      sort: ['order', 'id'],
      where: { showOnHomepage: { equals: true } },
    })

    return result.docs.map(toHomeVideo)
  },
  ['home-videos'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.videos],
  },
)

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
    return [home, ...categoryLinks(categories)]
  },
  ['category-nav'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.categories],
  },
)

export type FooterNav = {
  regions: HomeLink[]
  sections: HomeLink[]
}

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
      regions:
        liveRegions.length > 0 ? liveRegions : fallback.slice(0, FOOTER_REGION_LIMIT),
      sections: categoryLinks(categories),
    }
  },
  ['footer-nav'],
  {
    revalidate: REGIONS_REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.categories, CONTENT_TAGS.regions],
  },
)

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

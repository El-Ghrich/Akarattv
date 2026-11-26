import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Article } from '@/payload-types'
import { fetchCategories } from '@/features/categories/lib/categories'
import {
  homeContent,
  type HomeContent,
  type HomeLink,
  type HomeSection,
} from '@/features/home/content'
import { fetchRegions } from '@/features/regions/lib/regions'
import type { Locale } from '@/i18n/routing'
import { categoryPath } from '@/shared/lib/urls'
import { cacheOptions } from '@/shared/lib/content/constants'
import {
  categoryID,
  categoryLinks,
  orderedCategories,
  regionLinks,
  toHomeCard,
} from '@/shared/lib/content/shared'

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


import type { Article, Category, Media, Region } from '@/payload-types'
import type { HomeCard, HomeLink } from '@/features/home/content'
import type { Locale } from '@/i18n/routing'
import { formatRelativeArticleDate, getReadingTime } from '@/features/articles/lib/article'
import { articlePath, categoryPath, regionPath } from '@/shared/lib/urls'
import { HOUSING_LABEL, HOUSING_SLUGS, PRIORITY_REGION_SLUGS } from './constants'

export const isDoc = <T,>(value: T | number | null | undefined): value is T =>
  value !== null && typeof value === 'object'

export const categoryID = (article: Article): number | null => {
  if (isDoc<Category>(article.category)) return article.category.id
  if (typeof article.category === 'number') return article.category

  return null
}

export const articleImage = (article: Article): { alt: string; src?: string } => {
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

export const toHomeCard = (
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

/**
 * Categories without an explicit `homepageOrder` go after the ordered ones.
 * The id keeps the order stable when editors leave the field empty.
 */
export const orderedCategories = (categories: Category[]): Category[] =>
  [...categories].sort((a, b) => {
    const orderA = a.homepageOrder ?? Number.MAX_SAFE_INTEGER
    const orderB = b.homepageOrder ?? Number.MAX_SAFE_INTEGER

    return orderA - orderB || a.id - b.id
  })

export const categoryLinks = (categories: Category[]): HomeLink[] =>
  orderedCategories(categories).map((category) => ({
    href: categoryPath(category.slug),
    label: category.title,
  }))

const isHousingLink = (link: HomeLink): boolean => {
  const slug = decodeURIComponent(link.href).split('/').pop() ?? ''
  return HOUSING_SLUGS.has(slug)
}

export const groupedCategoryLinks = (categories: Category[], locale: Locale): HomeLink[] => {
  const links = categoryLinks(categories)
  const housing = links.filter(isHousingLink)
  if (housing.length === 0) return links

  const group: HomeLink = {
    children: housing,
    // Used only as a no-JS fallback; the header opens the dropdown on click.
    href: housing[0]!.href,
    label: HOUSING_LABEL[locale],
  }
  const firstIndex = links.findIndex(isHousingLink)
  const result = links.filter((link) => !isHousingLink(link))
  result.splice(firstIndex, 0, group)

  return result
}

export const prioritizeRegions = (regions: Region[]): Region[] => {
  const bySlug = new Map(regions.map((region) => [region.slug, region]))
  const priority = PRIORITY_REGION_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (region): region is Region => Boolean(region),
  )
  const rest = regions
    .filter((region) => !PRIORITY_REGION_SLUGS.includes(region.slug))
    .sort((a, b) => a.id - b.id)

  return [...priority, ...rest]
}

export const regionLinks = (regions: Region[]): HomeLink[] =>
  prioritizeRegions(regions).map((region) => ({
    href: regionPath(region.slug),
    label: region.name,
  }))

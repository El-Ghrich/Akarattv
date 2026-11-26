import type { Category, Media } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import type { ArticleTeaser } from './types'

export const isDoc = <T,>(value: T | number | null | undefined): value is T =>
  value !== null && typeof value === 'object'

export const articleHref = (locale: Locale, teaser: ArticleTeaser): string =>
  `/${locale}/articles/${encodeURIComponent(teaser.slug ?? String(teaser.id))}`

export type ArticleLayout = {
  category: Category | null
  hasLatest: boolean
  hasRightRail: boolean
  hasToc: boolean
  heroImage: Media | null
  latestItems: ArticleTeaser[]
  relatedItems: ArticleTeaser[]
}

export function getArticleLayout(
  article: import('@/payload-types').Article,
  latest: ArticleTeaser[],
  headings: unknown[],
  showAdSlots: boolean,
): ArticleLayout {
  const category = isDoc<Category>(article.category) ? article.category : null
  const heroImage = isDoc<Media>(article.heroImage) ? article.heroImage : null
  const latestItems = latest.filter((item) => item.id !== article.id).slice(0, 5)
  const hasToc = headings.length > 0
  const hasLatest = latestItems.length > 0
  // The sidebar ad lives in the existing right-hand rail, which is already
  // hidden below `lg`. It never moves underneath the article on small screens.
  const hasRightRail = hasLatest || showAdSlots

  const relatedItems: ArticleTeaser[] = []
  const seen = new Set<number>([article.id])
  const addRelated = (candidate: unknown) => {
    if (!candidate || typeof candidate !== 'object') return
    const item = candidate as ArticleTeaser
    if (seen.has(item.id) || relatedItems.length >= 3) return
    seen.add(item.id)
    relatedItems.push(item)
  }

  for (const candidate of article.relatedArticles ?? []) addRelated(candidate)
  for (const candidate of latest) addRelated(candidate)

  return {
    category,
    hasLatest,
    hasRightRail,
    hasToc,
    heroImage,
    latestItems,
    relatedItems,
  }
}

export const articleColumnClass = (layout: Pick<ArticleLayout, 'hasRightRail' | 'hasToc'>): string =>
  layout.hasToc
    ? 'lg:col-span-6'
    : layout.hasRightRail
      ? 'lg:col-span-9'
      : 'lg:col-span-12'

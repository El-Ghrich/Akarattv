import { headers as getHeaders } from 'next/headers'

import { infoPageSlugs, type InfoPageSlug } from '@/features/info/content'
import type { LocaleAlternate } from '@/i18n/alternates'
import { routing, type Locale } from '@/i18n/routing'
import { getArticleAlternates } from '@/features/seo/lib/articleAlternates'
import { getArticle } from '@/features/articles/lib/articles'
import {
  getCategoryAlternates,
  getCategoryPage,
} from '@/features/categories/lib/categories'
import {
  getRegion,
  getRegionAlternates,
} from '@/features/regions/lib/regions'
import { infoPageAlternates } from '@/features/info/lib/infoPages'
import { decodeSlug } from '@/shared/lib/urls'

const ARTICLE_PATH = /^\/[^/]+\/articles\/([^/]+)\/?$/
const CATEGORY_PATH = /^\/[^/]+\/categories\/([^/]+)\/?$/
const REGION_PATH = /^\/[^/]+\/regions\/([^/]+)\/?$/
const INFO_PATH = new RegExp(`^/[^/]+/(${infoPageSlugs.join('|')})/?$`)

const homeAlternates = (): LocaleAlternate[] =>
  routing.locales.map((locale) => ({ href: '/', locale }))

/** The 404 page has no translated slug to offer in the other locale. */
const unavailableAlternates = (): LocaleAlternate[] =>
  routing.locales.map((locale) => ({ href: null, locale }))

export type LayoutChrome = {
  alternates: LocaleAlternate[]
  newsletterHref: string
}

/**
 * The locale layout does not receive the child route's `slug`, but the
 * language switcher still needs the translated slug of the current page. The
 * proxy stores the request pathname in `x-pathname`, so the layout can resolve
 * the same alternates the page uses and render the shared header/footer once.
 */
export async function getLayoutChrome(locale: Locale): Promise<LayoutChrome> {
  const pathname = (await getHeaders()).get('x-pathname') ?? `/${locale}`
  const articleMatch = ARTICLE_PATH.exec(pathname)

  if (articleMatch?.[1]) {
    const slug = decodeSlug(articleMatch[1])
    const article = await getArticle(slug, locale, false)

    return {
      alternates: article
        ? await getArticleAlternates(article.id, article.slug ?? slug, locale)
        : unavailableAlternates(),
      // The article page keeps its newsletter block in the page body.
      newsletterHref: '#newsletter-block',
    }
  }

  const categoryMatch = CATEGORY_PATH.exec(pathname)

  if (categoryMatch?.[1]) {
    const data = await getCategoryPage(decodeSlug(categoryMatch[1]), locale, 1)

    return {
      alternates: data
        ? await getCategoryAlternates(data.category.id, data.category.slug, locale)
        : unavailableAlternates(),
      newsletterHref: `/${locale}#newsletter-section`,
    }
  }

  const regionMatch = REGION_PATH.exec(pathname)

  if (regionMatch?.[1]) {
    const slug = decodeSlug(regionMatch[1])
    const region = await getRegion(slug, locale)

    return {
      alternates: region
        ? await getRegionAlternates(region.id, region.slug, locale)
        : unavailableAlternates(),
      newsletterHref: `/${locale}#newsletter-section`,
    }
  }

  const infoMatch = INFO_PATH.exec(pathname)

  if (infoMatch?.[1]) {
    return {
      alternates: infoPageAlternates(infoMatch[1] as InfoPageSlug),
      newsletterHref: `/${locale}#newsletter-section`,
    }
  }

  return {
    alternates: homeAlternates(),
    newsletterHref: `/${locale}#newsletter-section`,
  }
}

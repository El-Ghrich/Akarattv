import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { getArticle } from '@/utilities/content'
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/utilities/ogImage'
import { mediaURL } from '@/utilities/seo'
import { decodeSlug } from '@/utilities/urls'

export const alt = OG_ALT
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const revalidate = 3600

type ImageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function Image({ params }: ImageProps) {
  const { locale, slug } = await params
  const typedLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
  const article = await getArticle(decodeSlug(slug), typedLocale, false)

  if (!article) {
    const t = await getTranslations({ locale: typedLocale, namespace: 'Article' })

    return renderOgImage({ locale: typedLocale, title: t('notFound') })
  }

  const category = typeof article.category === 'object' ? article.category.title : undefined

  return renderOgImage({
    eyebrow: category,
    imageURL: mediaURL(article.heroImage),
    locale: typedLocale,
    title: article.title,
  })
}

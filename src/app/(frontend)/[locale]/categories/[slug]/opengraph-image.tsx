import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { routing } from '@/i18n/routing'
import { getCategoryPage } from '@/utilities/content'
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/utilities/ogImage'
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
  const data = await getCategoryPage(decodeSlug(slug), typedLocale, 1)

  if (!data) {
    const t = await getTranslations({ locale: typedLocale, namespace: 'Category' })

    return renderOgImage({ locale: typedLocale, title: t('notFound') })
  }

  return renderOgImage({
    eyebrow: typedLocale === 'ar' ? 'تصنيف' : 'Rubrique',
    locale: typedLocale,
    title: data.category.title,
  })
}

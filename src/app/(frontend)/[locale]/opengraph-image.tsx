import { hasLocale } from 'next-intl'

import { homeContent } from '@/content/home'
import { routing } from '@/i18n/routing'
import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/utilities/ogImage'

export const alt = OG_ALT
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const revalidate = 3600

type ImageProps = {
  params: Promise<{ locale: string }>
}

export default async function Image({ params }: ImageProps) {
  const { locale } = await params
  const typedLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
  const content = homeContent[typedLocale]

  return renderOgImage({
    eyebrow: content.hero.badges[0],
    locale: typedLocale,
    title: content.hero.titleAfter,
  })
}

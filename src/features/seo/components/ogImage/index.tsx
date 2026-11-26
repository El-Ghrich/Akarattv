import { ImageResponse } from 'next/og'

import { homeContent } from '@/features/home/content'
import type { Locale } from '@/i18n/routing'

import { OgImageCard } from './card'
import { fonts } from './fonts'
import { clamp, inlineImage } from './image'
import { OG_SIZE } from './theme'

export { OG_ALT, OG_CONTENT_TYPE, OG_SIZE } from './theme'

type CardOptions = {
  /** Small label above the title: section, region or tagline. */
  eyebrow?: string
  imageURL?: string
  locale: Locale
  title: string
}

export const renderOgImage = async ({
  eyebrow,
  imageURL,
  locale,
  title,
}: CardOptions): Promise<ImageResponse> => {
  const rtl = locale === 'ar'
  const brand = homeContent[locale].header.siteName
  const tagline =
    locale === 'ar' ? 'أخبار العقار في المغرب' : "L'actualité immobilière au Maroc"
  const image = await inlineImage(imageURL)
  const headline = clamp(title, 130)
  const headlineSize = headline.length > 95 ? 52 : headline.length > 65 ? 62 : 72

  return new ImageResponse(
    <OgImageCard
      brand={brand}
      eyebrow={eyebrow}
      headline={headline}
      headlineSize={headlineSize}
      image={image}
      locale={locale}
      rtl={rtl}
      tagline={tagline}
    />,
    {
      ...OG_SIZE,
      fonts,
      headers: {
        // Social crawlers treat an hour-old card as fresh enough.
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}

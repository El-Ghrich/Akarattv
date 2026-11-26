import React from 'react'

import { AdSlot } from '@/features/ads/components/AdSlot'
import type { HomeContent } from '@/features/home/content'
import type { HomeVideo } from '@/features/home/lib/videos'
import type { Locale } from '@/i18n/routing'

import { CategorySection } from './cards'
import { BrandHero, HeroZone } from './hero'
import { NewsletterBand } from './newsletter'
import { VideosSection } from './VideosSection'

export type HomeSectionsProps = {
  content: HomeContent
  locale: Locale
  videos: HomeVideo[]
}

export const HomeSections = ({ content, locale, videos }: HomeSectionsProps) => {
  const sections = content.sections.slice(0, 2)

  return (
    <>
      <BrandHero content={content} locale={locale} />
      <HeroZone content={content} locale={locale} />
      <VideosSection content={content.videos} locale={locale} videos={videos} />
      {/* Only the first two category blocks belong on the homepage; the header
          still lists every category. The reserved slot sits once, between them. */}
      {sections.map((section, index) => (
        <React.Fragment key={section.id}>
          {index === 1 ? <AdSlot locale={locale} slot="home-between-sections" /> : null}
          <CategorySection locale={locale} section={section} />
        </React.Fragment>
      ))}
      <NewsletterBand content={content} />
    </>
  )
}

export { BrandHero, HeroZone, NewsletterBand }

import { getTranslations } from 'next-intl/server'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import type { HomeContent } from '@/content/home'
import type { Locale } from '@/i18n/routing'
import type { HomeVideo } from '@/utilities/content'
import { toISODuration, youtubeEmbedUrl, youtubeWatchUrl } from '@/utilities/youtube'

import { VideoCarousel } from './VideoCarousel'

type VideosSectionProps = {
  content: HomeContent['videos']
  locale: Locale
  videos: HomeVideo[]
}

const numberFormat: Record<Locale, Intl.NumberFormat> = {
  ar: new Intl.NumberFormat('ar-MA'),
  fr: new Intl.NumberFormat('fr-MA'),
}

const formatDuration = (seconds: number | null, unit: string): string | undefined => {
  if (!seconds || seconds <= 0) return undefined

  const hours = Math.floor(seconds / 3_600)
  const minutes = Math.floor((seconds % 3_600) / 60)
  const rest = seconds % 60
  const clock =
    hours > 0
      ? `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
      : `${minutes}:${String(rest).padStart(2, '0')}`

  return `${clock} ${unit}`
}

/**
 * Green "Akarat TV videos" band on the homepage.
 *
 * Renders nothing when the collection is empty, so the page looks exactly as
 * before until the first video is published from the admin.
 */
export const VideosSection = async ({ content, locale, videos }: VideosSectionProps) => {
  if (videos.length === 0) return null

  const t = await getTranslations({ locale, namespace: 'Videos' })

  const cards = videos.map((video) => ({
    durationLabel: formatDuration(video.durationSeconds, t('duration')),
    href: youtubeWatchUrl(video.videoId),
    id: video.id,
    thumbnailUrl: video.thumbnailUrl,
    title: video.title,
    viewsLabel:
      video.viewCount && video.viewCount > 0
        ? `${numberFormat[locale].format(video.viewCount)} ${t('views')}`
        : undefined,
  }))

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((video, index) => ({
      '@type': 'ListItem',
      item: {
        '@type': 'VideoObject',
        description: video.description ?? undefined,
        duration: video.durationSeconds ? toISODuration(video.durationSeconds) : undefined,
        embedUrl: youtubeEmbedUrl(video.videoId),
        name: video.title,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.publishedAt ?? undefined,
        url: youtubeWatchUrl(video.videoId),
      },
      position: index + 1,
    })),
  }

  return (
    <section aria-labelledby="videos-title" className="relative my-10 py-2">
      <JsonLd data={jsonLd} />

      <div className="relative overflow-hidden rounded-3xl border border-green-800/50 bg-gradient-to-br from-green-900 via-green-800 to-green-950 px-4 py-10 text-white shadow-[0_16px_45px_rgba(15,46,4,0.22)] sm:px-8 sm:py-14">
        {/* Vector backdrop for the channel band. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/BG%20Youtube.svg')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-950/30 via-green-900/40 to-green-950/20"
        />

        {/* Faded YouTube watermark, bottom-left corner. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-30 -right-30 select-none text-white opacity-[0.06]"
        >
          <svg className="h-70 w-70 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 select-none text-white opacity-[0.06]"
        >
          <svg className="h-96 w-96 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>

        {/* Warm ambient glow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl"
        />

        <div className="relative z-10 mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
          <h2
            className="m-0 mb-2.5 font-headline text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            id="videos-title"
          >
            {content.title}
          </h2>
          <p className="m-0 font-headline text-xs font-medium leading-relaxed text-ink-300 sm:text-sm">
            {content.subtitle}
          </p>
        </div>

        <div className="relative z-10">
          <VideoCarousel
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            labels={{
              list: content.title,
              next: t('next'),
              play: t('play'),
              previous: t('previous'),
            }}
            videos={cards}
          />
        </div>
      </div>
    </section>
  )
}

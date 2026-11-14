import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { HomeSections } from '@/components/Home'
import { routing, type Locale } from '@/i18n/routing'
import { getHomeContent, getHomeVideos } from '@/utilities/content'
import { homeLanguages, openGraphLocale, siteName } from '@/utilities/seo'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const description = t('description')
  const title = t('title')

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: homeLanguages(),
      types: {
        'application/rss+xml': `/${locale}/rss.xml`,
      },
    },
    description,
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      siteName: siteName(locale),
      title,
      type: 'website',
      url: `/${locale}`,
    },
    title: { absolute: title },
    twitter: {
      card: 'summary_large_image',
      description,
      title,
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  const typedLocale: Locale = locale
  const [content, videos] = await Promise.all([getHomeContent(typedLocale), getHomeVideos()])

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-14 px-4 py-8 sm:px-6">
      <HomeSections content={content} locale={typedLocale} videos={videos} />
    </main>
  )
}

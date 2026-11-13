import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { HomeSections } from '@/components/Home'
import { routing, type Locale } from '@/i18n/routing'
import { getHomeContent } from '@/utilities/content'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

// Static editorial content, but the utility bar carries the current date.
export const revalidate = 3600

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: '/ar', fr: '/fr' },
    },
    description: t('description'),
    title: t('title'),
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  const typedLocale: Locale = locale
  const content = await getHomeContent(typedLocale)

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-14 px-4 py-8 sm:px-6">
      <HomeSections content={content} locale={typedLocale} />
    </main>
  )
}

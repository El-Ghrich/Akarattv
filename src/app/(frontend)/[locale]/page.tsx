import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { HomeSections } from '@/components/Home'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { homeContent } from '@/content/home'
import type { LocaleAlternate } from '@/i18n/alternates'
import { routing, type Locale } from '@/i18n/routing'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

const alternates: LocaleAlternate[] = [
  { href: '/', locale: 'ar' },
  { href: '/', locale: 'fr' },
]

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
  const content = homeContent[typedLocale]

  return (
    <>
      <SiteHeader activeNav="market" alternates={alternates} locale={typedLocale} />

      <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-14 px-4 py-8 sm:px-6">
        <HomeSections content={content} locale={typedLocale} />
      </main>

      <SiteFooter alternates={alternates} locale={typedLocale} />
    </>
  )
}

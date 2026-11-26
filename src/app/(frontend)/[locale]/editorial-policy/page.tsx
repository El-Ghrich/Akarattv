import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import React from 'react'

import { InfoPage } from '@/features/info/components/InfoPage'
import { routing } from '@/i18n/routing'
import { infoPageMetadata } from '@/features/info/lib/infoPages'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  return infoPageMetadata('editorial-policy', locale)
}

export default async function EditorialPolicyPage({ params }: PageProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  return <InfoPage locale={locale} slug="editorial-policy" />
}

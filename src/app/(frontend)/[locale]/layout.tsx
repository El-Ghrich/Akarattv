import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { routing } from '@/i18n/routing'
import { getLayoutChrome } from '@/utilities/layoutChrome'
import {
  organizationJsonLd,
  openGraphLocale,
  siteName,
  websiteJsonLd,
} from '@/utilities/seo'
import { getServerURL } from '@/utilities/serverURL'

import '../styles.css'

/**
 * Cairo covers Arabic; Titillium Web covers the Latin/French UI. Both are
 * self-hosted from `src/fonts`, so neither the build nor the browser calls
 * Google Fonts.
 */
const cairo = localFont({
  display: 'swap',
  src: '../../../fonts/Cairo-VariableFont_slnt,wght.ttf',
  variable: '--font-cairo',
  weight: '200 1000',
})

const titillium = localFont({
  display: 'swap',
  src: [
    { path: '../../../fonts/TitilliumWeb-Regular.ttf', style: 'normal', weight: '400' },
    { path: '../../../fonts/TitilliumWeb-SemiBold.ttf', style: 'normal', weight: '600' },
    { path: '../../../fonts/TitilliumWeb-Bold.ttf', style: 'normal', weight: '700' },
  ],
  variable: '--font-titillium',
})

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const serverURL = getServerURL()
  const description = t('description')
  const title = t('title')

  return {
    description,
    metadataBase: serverURL ? new URL(serverURL) : undefined,
    openGraph: {
      description,
      locale: openGraphLocale(locale),
      siteName: siteName(locale),
      title,
      type: 'website',
      url: `/${locale}`,
    },
    title: { default: title, template: `%s | ${title}` },
    twitter: {
      card: 'summary_large_image',
      description,
      title,
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  const { alternates, newsletterHref } = await getLayoutChrome(locale)

  return (
    <html
      className={`${cairo.variable} ${titillium.variable} scroll-smooth`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <body className="flex min-h-screen flex-col bg-canvas text-ink-900 antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />
        <NextIntlClientProvider>
          <SiteHeader alternates={alternates} locale={locale} newsletterHref={newsletterHref} />
          {children}
          <SiteFooter alternates={alternates} locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

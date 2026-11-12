import type { Metadata } from 'next'
import { Cairo, Titillium_Web } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { routing } from '@/i18n/routing'
import { getServerURL } from '@/utilities/serverURL'

import '../styles.css'

/**
 * Cairo covers Arabic; Titillium Web covers the Latin/French UI. Both are
 * self-hosted by next/font at build time, so the browser never calls Google.
 */
const cairo = Cairo({
  display: 'swap',
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
})

const titillium = Titillium_Web({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-titillium',
  // Titillium Web is not a variable font, so the weights must be explicit.
  weight: ['400', '600', '700'],
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

  return {
    description: t('description'),
    metadataBase: serverURL ? new URL(serverURL) : undefined,
    title: t('title'),
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  return (
    <html
      className={`${cairo.variable} ${titillium.variable} scroll-smooth`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <body className="flex min-h-screen flex-col bg-canvas text-ink-900 antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

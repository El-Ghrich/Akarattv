import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import localFont from 'next/font/local'
import React from 'react'

import { NotFoundView } from '@/components/NotFoundView'
import { localeFromPathname } from '@/content/notFound'

import './(frontend)/styles.css'

const cairo = localFont({
  display: 'swap',
  src: '../fonts/Cairo-Variable-wght.woff2',
  variable: '--font-cairo',
  weight: '200 1000',
})

const titillium = localFont({
  display: 'swap',
  src: [
    { path: '../fonts/TitilliumWeb-Regular.woff2', style: 'normal', weight: '400' },
    { path: '../fonts/TitilliumWeb-SemiBold.woff2', style: 'normal', weight: '600' },
    { path: '../fonts/TitilliumWeb-Bold.woff2', style: 'normal', weight: '700' },
  ],
  variable: '--font-titillium',
})

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: '404 — Akarat TV',
}

export default async function GlobalNotFound() {
  const pathname = (await getHeaders()).get('x-pathname')
  const locale = localeFromPathname(pathname)

  return (
    <html
      className={`${cairo.variable} ${titillium.variable} scroll-smooth`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <body className="flex min-h-screen flex-col bg-green-950 text-white antialiased">
        <header className="flex items-center justify-between border-b border-white/10 bg-green-950 px-4 py-4 sm:px-6">
          <a aria-label="Akarat TV" href={`/${locale}`}>
            <img alt="Akarat TV" className="h-8 w-auto" src="/akarattv-white.png" />
          </a>
          <nav aria-label={locale === 'ar' ? 'تغيير اللغة' : 'Changer de langue'} className="flex items-center gap-3 text-meta font-bold">
            <a
              aria-current={locale === 'ar' ? 'page' : undefined}
              className={locale === 'ar' ? 'text-gold-300' : 'text-ink-300 hover:text-white'}
              href="/ar"
              lang="ar"
            >
              العربية
            </a>
            <span aria-hidden="true" className="text-green-800">
              |
            </span>
            <a
              aria-current={locale === 'fr' ? 'page' : undefined}
              className={locale === 'fr' ? 'text-gold-300' : 'text-ink-300 hover:text-white'}
              href="/fr"
              lang="fr"
            >
              Français
            </a>
          </nav>
        </header>

        <NotFoundView locale={locale} />
      </body>
    </html>
  )
}

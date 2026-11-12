import Image from 'next/image'
import React from 'react'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { CalendarIcon, GlobeIcon, MenuIcon, SearchIcon, TrendUpIcon } from '@/components/icons'
import { homeContent } from '@/content/home'
import type { LocaleAlternate } from '@/i18n/alternates'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export type SiteHeaderProps = {
  activeNav?: string
  alternates: LocaleAlternate[]
  locale: Locale
}

const formatDate = (locale: Locale): string =>
  new Intl.DateTimeFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Africa/Casablanca',
    weekday: 'long',
    year: 'numeric',
  }).format(new Date())

const logo = '/logo.png'

/**
 * Rendered by each page rather than by the locale layout: the switcher needs
 * the current page's translated slug, and a layout does not receive child
 * route params.
 */
export async function SiteHeader({ activeNav, alternates, locale }: SiteHeaderProps) {
  const content = homeContent[locale].header
  const date = formatDate(locale)

  return (
    <>
      <aside className="border-b border-green-900 bg-green-950 text-meta text-ink-300">
        <div className="mx-auto flex h-9 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CalendarIcon className="h-[17px] w-[17px] text-gold-400" />
              <time className="truncate" dateTime={new Date().toISOString()}>
                {date}
              </time>
            </div>

            <span aria-hidden="true" className="hidden text-green-800 sm:inline">
              |
            </span>

            <div className="hidden items-center gap-2 whitespace-nowrap sm:flex">
              <TrendUpIcon className="h-[17px] w-[17px] text-gold-400" />
              <span className="font-semibold text-white">{content.marketLabel}</span>
              <span className="font-bold tabular-nums text-success">{content.marketIndex}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="flex items-center gap-1.5">
              <GlobeIcon className="h-[17px] w-[17px] text-gold-400" />
              <LocaleSwitcher
                alternates={alternates}
                locale={locale}
                separatorClassName="text-green-700"
              />
            </div>

            <span aria-hidden="true" className="hidden text-green-800 sm:inline">
              |
            </span>

            <button
              aria-label={content.search}
              className="hidden items-center gap-1 transition-colors hover:text-white sm:flex"
              type="button"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
              <span>{content.search}</span>
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 bg-green-900 shadow-md">
        <div className="mx-auto flex h-20 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-8">
            <Link
              aria-label={content.homeLabel}
              className="group inline-flex shrink-0 items-center py-1"
              href="/"
              locale={locale}
            >
              <span className="flex h-12 items-center justify-center rounded border border-gold-500/40 bg-surface/95 px-2.5 py-1.5 sm:h-14">
                <Image
                  alt={content.siteName}
                  className="h-9 w-auto sm:h-11"
                  height={391}
                  priority
                  src={logo}
                  width={742}
                />
              </span>
            </Link>

            <nav aria-label={content.siteName} className="hidden items-center gap-1 lg:flex">
              {content.nav.map((item) => {
                const isActive = activeNav === item.href.slice(1)

                return (
                  <a
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative px-3 py-2 font-headline text-body-ui font-bold transition-colors ${
                      isActive ? 'text-gold-300' : 'text-white/90 hover:text-gold-400'
                    }`}
                    href={`/${locale}${item.href}`}
                    key={item.href + item.label}
                  >
                    <span>{item.label}</span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-gold-500"
                      />
                    ) : null}
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              aria-label={content.search}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gold-300 transition-colors hover:bg-green-800 hover:text-white"
              type="button"
            >
              <SearchIcon className="h-[22px] w-[22px]" />
            </button>

            <a
              className="hidden h-11 items-center justify-center rounded-card bg-gold-500 px-5 font-headline text-body-ui font-bold text-green-950 shadow-sm transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 sm:inline-flex"
              href={`/${locale}#newsletter-section`}
            >
              {content.newsletter}
            </a>

            <details className="group relative lg:hidden">
              <summary
                aria-label={content.menu}
                className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-gold-300 transition-colors hover:bg-green-800 hover:text-white [&::-webkit-details-marker]:hidden"
              >
                <MenuIcon className="h-6 w-6" />
              </summary>

              <div className="absolute end-0 top-full z-50 mt-2 w-72 rounded-card border border-green-800 bg-green-900 p-3 shadow-xl">
                <nav aria-label={content.siteName} className="flex flex-col">
                  {content.nav.map((item) => (
                    <a
                      className="rounded px-3 py-2.5 font-headline text-body-ui font-bold text-white/90 transition-colors hover:bg-green-800 hover:text-gold-300"
                      href={`/${locale}${item.href}`}
                      key={item.href + item.label}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <a
                  className="mt-2 flex h-11 items-center justify-center rounded-card bg-gold-500 px-5 font-headline text-body-ui font-bold text-green-950 transition-colors hover:bg-gold-400"
                  href={`/${locale}#newsletter-section`}
                >
                  {content.newsletter}
                </a>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  )
}

export default SiteHeader

import Image from 'next/image'
import React from 'react'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { GlobeIcon, PlayIcon } from '@/components/icons'
import { homeContent, type HomeLink } from '@/content/home'
import type { LocaleAlternate } from '@/i18n/alternates'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getFooterNav } from '@/utilities/content'

export type SiteFooterProps = {
  alternates: LocaleAlternate[]
  locale: Locale
}

const socialGlyphs = (index: number) => {
  switch (index) {
    case 0:
      return <span className="font-headline text-xs font-bold">in</span>
    case 1:
      return <span className="font-headline text-xs font-bold">𝕏</span>
    case 2:
      return <PlayIcon className="h-[18px] w-[18px]" />
    default:
      return <span className="font-headline text-xs font-bold">f</span>
  }
}

export async function SiteFooter({ alternates, locale }: SiteFooterProps) {
  const content = homeContent[locale]
  const footer = content.footer
  const nav = await getFooterNav(locale)

  // Categories and regions come from Payload; the two editorial columns stay
  // static. A collection with no published docs simply loses its column.
  const columns: { links: HomeLink[]; title: string }[] = [
    { links: nav.sections, title: footer.sectionsTitle },
    { links: nav.regions, title: footer.regionsTitle },
    footer.about,
    footer.policies,
  ].filter((column) => column.links.length > 0)

  return (
    <footer
      className="mt-16 border-t border-green-900 bg-green-950 pb-12 pt-16 text-white"
      id="footer"
    >
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 border-b border-green-900 pb-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link aria-label={content.header.homeLabel} href="/" locale={locale}>
                <Image
                  alt={content.header.siteName}
                  className="h-9 w-auto"
                  height={391}
                  src="/logo.png"
                  width={742}
                />

            </Link>

            <p className="m-0 max-w-sm text-body-ui leading-relaxed text-ink-300">
              {footer.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {footer.social.map((label, index) => (
                <a
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-green-800 bg-green-900 text-gold-400 transition-colors hover:border-gold-500 hover:bg-gold-500 hover:text-white"
                  href="#footer"
                  key={label}
                >
                  {socialGlyphs(index)}
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div className="flex flex-col gap-3" key={column.title}>
              <h3 className="mb-1 font-headline text-body-ui font-bold text-gold-400">
                {column.title}
              </h3>
              <ul className="flex list-none flex-col gap-2.5 p-0 text-meta text-ink-300">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      className="transition-colors hover:text-white"
                      href={`/${locale}${link.href}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-meta text-ink-500 md:flex-row">
          <p className="m-0 text-center md:text-start">{footer.copyright}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-ink-300">
              <GlobeIcon className="h-4 w-4 text-gold-400" />
              <LocaleSwitcher
                alternates={alternates}
                locale={locale}
                separatorClassName="text-green-800"
              />
            </div>
            <span aria-hidden="true">•</span>
            <span>{footer.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter

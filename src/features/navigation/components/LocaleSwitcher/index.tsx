import { getTranslations } from 'next-intl/server'
import React from 'react'

import type { LocaleAlternate } from '@/i18n/alternates'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export type LocaleSwitcherProps = {
  alternates: LocaleAlternate[]
  className?: string
  locale: Locale
  separatorClassName?: string
}

/**
 * Language names are intentionally written in their own language, not
 * translated: a visitor who cannot read Arabic should still recognise
 * "العربية" as the Arabic option.
 */
const nativeNames: Record<Locale, string> = {
  ar: 'العربية',
  fr: 'Français',
}

export async function LocaleSwitcher({
  alternates,
  className,
  locale,
  separatorClassName,
}: LocaleSwitcherProps) {
  const t = await getTranslations({ locale, namespace: 'LocaleSwitcher' })

  return (
    <nav
      aria-label={t('label')}
      className={`flex items-center gap-2 text-meta ${className ?? ''}`}
    >
      {alternates.map((alternate, index) => {
        const name = nativeNames[alternate.locale]
        const isActive = alternate.locale === locale

        const item = isActive ? (
          <span className="font-bold text-white" key={alternate.locale} lang={alternate.locale}>
            {name}
          </span>
        ) : alternate.href ? (
          <Link
            className="transition-colors hover:text-gold-300"
            href={alternate.href}
            hrefLang={alternate.locale}
            key={alternate.locale}
            lang={alternate.locale}
            locale={alternate.locale}
          >
            {name}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="cursor-not-allowed opacity-40"
            key={alternate.locale}
            lang={alternate.locale}
            title={t('unavailable')}
          >
            {name}
          </span>
        )

        return (
          <React.Fragment key={alternate.locale}>
            {index > 0 ? (
              <span aria-hidden="true" className={separatorClassName}>
                |
              </span>
            ) : null}
            {item}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default LocaleSwitcher

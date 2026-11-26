'use client'

import { consentContent } from '@/features/consent/content/consent'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

import { ShieldCheckIcon } from '@/shared/ui/icons'

import type { ConsentChoice } from './context'
import { compactActionClassName } from './styles'

type ConsentBannerProps = {
  locale: Locale
  openSettings: () => void
  save: (choice: ConsentChoice) => void
}

export function ConsentBanner({ locale, openSettings, save }: ConsentBannerProps) {
  const content = consentContent[locale].banner

  return (
    <div className="consent-banner fixed inset-x-0 bottom-0 z-50 p-2.5 sm:p-4">
      <div
        aria-label={content.title}
        aria-live="polite"
        className="mx-auto flex max-w-content flex-col gap-2.5 rounded-card border border-gold-500/30 bg-green-950 px-4 py-3 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.28)] sm:flex-row sm:items-center sm:justify-between sm:gap-5"
        role="region"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
          </span>
          <p className="m-0 text-meta leading-snug text-ink-300">
            <strong className="font-headline font-bold text-white">{content.title}</strong>{' '}
            {content.description}{' '}
            <Link
              className="font-bold text-gold-300 underline underline-offset-2 transition-colors hover:text-gold-400"
              href="/privacy"
              locale={locale}
            >
              {content.privacyLabel}
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {/* Accept and reject share size/shape/contrast — no dark pattern. */}
          <button
            className={`${compactActionClassName} bg-gold-500 text-green-950 hover:bg-gold-400`}
            onClick={() => save('granted')}
            type="button"
          >
            {content.accept}
          </button>
          <button
            className={`${compactActionClassName} border border-white/40 bg-white/5 text-white hover:border-gold-400 hover:bg-white/10`}
            onClick={() => save('denied')}
            type="button"
          >
            {content.reject}
          </button>
          <button
            className="min-h-9 px-1 font-headline text-label font-bold text-gold-300 underline underline-offset-4 transition-colors hover:text-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
            onClick={openSettings}
            type="button"
          >
            {content.settings}
          </button>
        </div>
      </div>
    </div>
  )
}

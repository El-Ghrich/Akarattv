'use client'

import { useEffect, useRef, useState } from 'react'

import { consentContent } from '@/features/consent/content/consent'
import type { Locale } from '@/i18n/routing'

import { InfoIcon } from '@/shared/ui/icons'

import type { ConsentChoice } from './context'
import { actionClassName } from './styles'

type ConsentPreferencesProps = {
  closeSettings: () => void
  consent: ConsentChoice | null
  locale: Locale
  save: (choice: ConsentChoice) => void
}

export function ConsentPreferences({
  closeSettings,
  consent,
  locale,
  save,
}: ConsentPreferencesProps) {
  const content = consentContent[locale].preferences
  const [draft, setDraft] = useState<ConsentChoice>(consent ?? 'denied')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return (
    <div className="consent-banner fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-6 sm:pb-6">
      <div
        aria-labelledby="consent-preferences-title"
        aria-modal="false"
        className="w-full max-w-2xl rounded-card border border-gold-500/30 bg-green-950 p-6 text-white shadow-[0_-12px_40px_rgba(0,0,0,0.28)] focus:outline-none"
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            className="m-0 font-headline text-h3 font-bold text-white"
            id="consent-preferences-title"
          >
            {content.title}
          </h2>
          <button
            aria-label={content.close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            onClick={closeSettings}
            title={content.close}
            type="button"
          >
            <span aria-hidden="true" className="text-body-ui">
              ×
            </span>
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="rounded-card border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="m-0 font-headline text-body-ui font-bold text-white">
                {content.essentialTitle}
              </h3>
              <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-label font-bold text-gold-300">
                {content.statusGranted}
              </span>
            </div>
            <p className="mb-0 mt-2 text-meta leading-relaxed text-ink-300">
              {content.essentialDescription}
            </p>
          </div>

          <div className="rounded-card border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="m-0 font-headline text-body-ui font-bold text-white">
                {content.analyticsTitle}
              </h3>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-label font-bold text-ink-300">
                {draft === 'granted' ? content.statusGranted : content.statusDenied}
              </span>
            </div>
            <p className="mb-0 mt-2 text-meta leading-relaxed text-ink-300">
              {content.analyticsDescription}
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <button
                aria-pressed={draft === 'granted'}
                className={`${actionClassName} h-10 border text-meta ${
                  draft === 'granted'
                    ? 'border-gold-400 bg-gold-500 text-green-950'
                    : 'border-white/40 bg-transparent text-white hover:bg-white/10'
                }`}
                onClick={() => setDraft('granted')}
                type="button"
              >
                {content.accept}
              </button>
              <button
                aria-pressed={draft === 'denied'}
                className={`${actionClassName} h-10 border text-meta ${
                  draft === 'denied'
                    ? 'border-gold-400 bg-gold-500 text-green-950'
                    : 'border-white/40 bg-transparent text-white hover:bg-white/10'
                }`}
                onClick={() => setDraft('denied')}
                type="button"
              >
                {content.reject}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            className="inline-flex h-11 items-center gap-2 px-4 font-headline text-meta font-bold text-ink-300 transition-colors hover:text-white"
            onClick={closeSettings}
            type="button"
          >
            <InfoIcon className="h-4 w-4" />
            {content.close}
          </button>
          <button
            className={`${actionClassName} bg-gold-500 text-green-950 hover:bg-gold-400`}
            onClick={() => save(draft)}
            type="button"
          >
            {content.save}
          </button>
        </div>
      </div>
    </div>
  )
}

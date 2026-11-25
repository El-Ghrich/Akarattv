'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { InfoIcon, ShieldCheckIcon } from '@/components/icons'
import { consentContent } from '@/content/consent'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export type ConsentChoice = 'granted' | 'denied'

type ConsentContextValue = {
  /** `null` means no choice has been recorded yet. */
  consent: ConsentChoice | null
  isReady: boolean
  analyticsEnabled: boolean
  settingsOpen: boolean
  acceptAnalytics: () => void
  rejectAnalytics: () => void
  openSettings: () => void
  closeSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

const COOKIE_NAME = 'akarat-consent'
/** Six months, matching the usual consent refresh interval. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

function readConsentCookie(): ConsentChoice | null {
  if (typeof document === 'undefined') return null

  for (const entry of document.cookie.split(';')) {
    const separator = entry.indexOf('=')
    if (separator < 0) continue

    const name = entry.slice(0, separator).trim()
    if (name !== COOKIE_NAME) continue

    const value = entry.slice(separator + 1)
    return value === 'granted' || value === 'denied' ? value : null
  }

  return null
}

function writeConsentCookie(choice: ConsentChoice): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${choice}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext)

  if (!context) throw new Error('useConsent must be used inside a ConsentProvider')

  return context
}

export type ConsentProviderProps = {
  analyticsEnabled: boolean
  children: React.ReactNode
  locale: Locale
}

export function ConsentProvider({ analyticsEnabled, children, locale }: ConsentProviderProps) {
  const [consent, setConsentState] = useState<ConsentChoice | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // The cookie is first-party and readable by JS, so the banner can stay
  // hidden for returning visitors instead of flashing on every page load.
  useEffect(() => {
    setConsentState(readConsentCookie())
    setIsReady(true)
  }, [])

  const setConsent = useCallback((choice: ConsentChoice) => {
    writeConsentCookie(choice)
    setConsentState(choice)
    setSettingsOpen(false)
  }, [])

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  const value = useMemo<ConsentContextValue>(
    () => ({
      acceptAnalytics: () => setConsent('granted'),
      analyticsEnabled,
      closeSettings,
      consent,
      isReady,
      openSettings,
      rejectAnalytics: () => setConsent('denied'),
      settingsOpen,
    }),
    [analyticsEnabled, closeSettings, consent, isReady, openSettings, setConsent, settingsOpen],
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {analyticsEnabled && isReady ? (
        settingsOpen ? (
          <ConsentPreferences
            closeSettings={closeSettings}
            consent={consent}
            locale={locale}
            save={setConsent}
          />
        ) : consent === null ? (
          <ConsentBanner locale={locale} openSettings={openSettings} save={setConsent} />
        ) : null
      ) : null}
    </ConsentContext.Provider>
  )
}

const actionClassName =
  'inline-flex h-11 items-center justify-center rounded-card px-5 font-headline text-body-ui font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400'

/** Compact buttons for the single-line banner; keep both choices identical. */
const compactActionClassName =
  'inline-flex h-9 items-center justify-center rounded-card px-3.5 font-headline text-meta font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400'

function ConsentBanner({
  locale,
  openSettings,
  save,
}: {
  locale: Locale
  openSettings: () => void
  save: (choice: ConsentChoice) => void
}) {
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

function ConsentPreferences({
  closeSettings,
  consent,
  locale,
  save,
}: {
  closeSettings: () => void
  consent: ConsentChoice | null
  locale: Locale
  save: (choice: ConsentChoice) => void
}) {
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

export default ConsentProvider

'use client'

import type { Locale } from '@/i18n/routing'

import { ConsentBanner } from './ConsentBanner'
import { ConsentPreferences } from './ConsentPreferences'
import { ConsentContext } from './context'
import { useConsentState } from './useConsentState'

export { useConsent } from './context'
export type { ConsentChoice } from './context'

export type ConsentProviderProps = {
  analyticsEnabled: boolean
  children: React.ReactNode
  locale: Locale
}

export function ConsentProvider({ analyticsEnabled, children, locale }: ConsentProviderProps) {
  const { setConsent, value } = useConsentState(analyticsEnabled)
  const { closeSettings, consent, isReady, openSettings, settingsOpen } = value

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

export default ConsentProvider

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  readConsentCookie,
  writeConsentCookie,
  type ConsentChoice,
  type ConsentContextValue,
} from './context'

export type ConsentState = {
  value: ConsentContextValue
  /** Raw saver used by the banner and preferences panel; also closes settings. */
  setConsent: (choice: ConsentChoice) => void
}

export function useConsentState(analyticsEnabled: boolean): ConsentState {
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

  return { setConsent, value }
}

'use client'

import { createContext, useContext } from 'react'

export type ConsentChoice = 'granted' | 'denied'

export type ConsentContextValue = {
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

export const ConsentContext = createContext<ConsentContextValue | null>(null)

const COOKIE_NAME = 'akarat-consent'
/** Six months, matching the usual consent refresh interval. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

export function readConsentCookie(): ConsentChoice | null {
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

export function writeConsentCookie(choice: ConsentChoice): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=${choice}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext)

  if (!context) throw new Error('useConsent must be used inside a ConsentProvider')

  return context
}

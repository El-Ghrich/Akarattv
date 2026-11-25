'use client'

import { useConsent } from './index'

export type CookieSettingsButtonProps = {
  label: string
}

/** Withdraw or change the analytics decision from the site footer. */
export function CookieSettingsButton({ label }: CookieSettingsButtonProps) {
  const { openSettings } = useConsent()

  return (
    <button
      className="font-headline text-meta font-bold text-ink-300 underline underline-offset-4 transition-colors hover:text-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
      onClick={openSettings}
      type="button"
    >
      {label}
    </button>
  )
}

export default CookieSettingsButton

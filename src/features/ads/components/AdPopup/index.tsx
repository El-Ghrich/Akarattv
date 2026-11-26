'use client'

import type { Locale } from '@/i18n/routing'

import { PopupDialog } from './PopupDialog'
import { usePopupState } from './usePopupState'

/**
 * Debug-only popup mount point. Hooks run unconditionally; no dialog, listener
 * or storage write exists until the eligibility rules open it. Production
 * layouts never render this component.
 */
export function AdPopup({ locale }: { locale: Locale }) {
  const { close, open } = usePopupState()

  if (!open) return null

  return <PopupDialog locale={locale} onClose={close} />
}

export default AdPopup

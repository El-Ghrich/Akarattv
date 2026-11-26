import type { Locale } from '@/i18n/routing'

/**
 * Small UI strings for the reserved ad shells. These are not ad creative or
 * tracking copy; they only label an empty/debug slot for editors and readers.
 */
export type AdsCopy = {
  close: string
  debugTitle: string
  marker: string
}

export const adsCopy: Record<Locale, AdsCopy> = {
  ar: {
    close: 'إغلاق',
    debugTitle: 'مساحة إعلان محجوزة',
    marker: 'إعلان',
  },
  fr: {
    close: 'Fermer',
    debugTitle: 'Emplacement publicitaire réservé',
    marker: 'Publicité',
  },
}

/** Storage helpers for the debug-only popup. All access is wrapped because
 * private browsing and preview iframes can throw on any storage call. */

export type StorageArea = 'localStorage' | 'sessionStorage'

export const PAGEVIEWS_KEY = 'akarat-ad-popup-pageviews'
export const SHOWN_KEY = 'akarat-ad-popup-shown'
export const DISMISSED_KEY = 'akarat-ad-popup-dismissed-at'

export const safeRead = (area: StorageArea, key: string): string | null => {
  try {
    return window[area].getItem(key)
  } catch {
    return null
  }
}

export const safeWrite = (area: StorageArea, key: string, value: string): void => {
  try {
    window[area].setItem(key, value)
  } catch {
    // Eligibility still works for this page view; the choice just will not
    // survive a reload.
  }
}

export const parseStoredNumber = (value: string | null): number | null => {
  if (value === null) return null
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

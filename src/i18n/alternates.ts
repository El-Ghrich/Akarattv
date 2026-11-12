import type { Locale } from './routing'

/**
 * A link to the same page in another locale.
 *
 * `href` is locale-less (for example `/articles/casablanca-2026`); next-intl's
 * `Link` adds the `locale` prefix. `null` means the page does not exist in
 * that locale yet and the switcher renders it as disabled.
 */
export type LocaleAlternate = {
  href: null | string
  locale: Locale
}

import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ar', 'fr'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  /**
   * Arabic is the default for `/` regardless of the browser's
   * `Accept-Language`. Visitors reach French through the switcher, which
   * writes the locale into the URL (and the `NEXT_LOCALE` cookie).
   */
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

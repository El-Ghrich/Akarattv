import type { routing } from './i18n/routing'

/**
 * Teaches next-intl the locale union and the message shape, so `t()` keys are
 * checked against `ar.json` and returning an unknown locale is a type error.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof import('./messages/ar.json')
  }
}

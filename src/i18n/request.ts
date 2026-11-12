import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import * as rootParams from 'next/root-params'
import { notFound } from 'next/navigation'

import { routing } from './routing'

/**
 * Resolves the active locale from the `[locale]` root segment and loads the
 * matching JSON catalog. `next/root-params` keeps the result available to both
 * server and client components without falling back to next-intl's legacy
 * `setRequestLocale`.
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const param = await rootParams.locale()

    if (hasLocale(routing.locales, param)) {
      locale = param
    } else {
      notFound()
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

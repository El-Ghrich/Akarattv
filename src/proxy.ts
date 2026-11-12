import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

/**
 * next-intl builds its response from `request.headers`, so the pathname has to
 * be set on a cloned request before handing it over. The article `not-found`
 * page reads it back with `headers()` to find out which slug was requested.
 */
export default function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  return handleI18nRouting(new NextRequest(request, { headers: requestHeaders }))
}

export const config = {
  /*
   * Payload owns `/admin` and `/api`, and `my-route` is a plain route handler.
   * Paths containing a dot (favicon, files) are skipped as well.
   */
  matcher: '/((?!api|admin|my-route|_next|_vercel|.*\\..*).*)',
}

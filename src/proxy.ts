import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'
import { findRedirect } from './utilities/redirects'

const handleI18nRouting = createMiddleware(routing)

/**
 * next-intl builds its response from `request.headers`, so the pathname has to
 * be set on a cloned request before handing it over. The article `not-found`
 * page reads it back with `headers()` to find out which slug was requested.
 */
export default async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  // Managed redirects run before next-intl so an old URL never picks up a
  // locale prefix first. They are only meaningful for navigations.
  if (request.method === 'GET' || request.method === 'HEAD') {
    const redirect = await findRedirect(request.nextUrl.pathname, request.nextUrl.origin)

    if (redirect) {
      const url = new URL(redirect.destination, request.nextUrl.origin)

      // Keep the query string of the old URL unless the target defines its own.
      if (!url.search && request.nextUrl.search) url.search = request.nextUrl.search

      const isSameURL =
        url.pathname === request.nextUrl.pathname && url.search === request.nextUrl.search

      if (!isSameURL) return NextResponse.redirect(url, redirect.status)
    }
  }

  return handleI18nRouting(new NextRequest(request, { headers: requestHeaders }))
}

export const config = {
  /*
   * Payload owns `/admin` and `/api`, and `my-route` is a plain route handler.
   * Paths containing a dot (favicon, files) are skipped as well.
   */
  matcher: '/((?!api|admin|my-route|_next|_vercel|.*\\..*).*)',
}

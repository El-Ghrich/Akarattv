/**
 * Single source of truth for ad-prep debug output.
 *
 * `NEXT_PUBLIC_ADS_DEBUG` is inlined at build time, while `VERCEL_ENV` is a
 * server-only variable. Keep this helper on the server: layouts pass the
 * resulting boolean down to the one client component that needs it. Query
 * parameters are deliberately never read here.
 */
const rawFlag = process.env.NEXT_PUBLIC_ADS_DEBUG?.trim().toLowerCase() ?? ''
const optedIn = rawFlag === '1' || rawFlag === 'true'

const isVercelProduction =
  process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production'

export const adsDebugEnabled = optedIn && !isVercelProduction

/**
 * Absolute origin for canonical and hreflang metadata.
 *
 * `NEXT_PUBLIC_SERVER_URL` is the explicit source of truth when it is set.
 * Vercel otherwise exposes the deployment host at request time; the project's
 * production domain is the stable one, with the per-deployment URL as a
 * fallback (previews and branch deployments).
 */
export const getServerURL = (): string | undefined => {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL
  if (configured) return configured

  const vercelURL = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

  return vercelURL ? `https://${vercelURL}` : undefined
}

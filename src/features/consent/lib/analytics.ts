/**
 * The GTM container is opt-in. An empty or malformed container ID disables both
 * the tag and the consent UI, so a local or preview build never asks for a
 * decision it cannot actually honour.
 *
 * `NEXT_PUBLIC_GTM_ID` is inlined at build time by Next.js, which is why this
 * module can be imported from a Client Component.
 */
const rawContainerId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? ''

export const gtmContainerId = /^GTM-[A-Z0-9]+$/.test(rawContainerId) ? rawContainerId : null

export const analyticsEnabled = gtmContainerId !== null

/**
 * GA4 is opt-in. An empty or malformed Measurement ID disables both the script
 * and the consent UI, so a local or preview build never asks for a decision it
 * cannot actually honour.
 *
 * `NEXT_PUBLIC_GA_MEASUREMENT_ID` is inlined at build time by Next.js, which is
 * why this module can be imported from a Client Component.
 */
const rawMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? ''

export const gaMeasurementId = /^G-[A-Z0-9]+$/.test(rawMeasurementId) ? rawMeasurementId : null

export const analyticsEnabled = gaMeasurementId !== null

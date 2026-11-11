/**
 * Builds an admin UI label keyed by language code.
 *
 * Payload accepts `Record<string, string>` for collection labels, field labels,
 * select option labels, admin group names and admin descriptions, so the admin
 * picks the value that matches the currently selected UI language.
 */
export const l = (en: string, fr: string, ar: string): Record<string, string> => ({
  en,
  fr,
  ar,
})

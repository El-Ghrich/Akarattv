/**
 * Creates a URL-friendly slug from a string.
 *
 * Unicode-aware: letters and numbers from any script (Arabic, French accented
 * characters, etc.) are preserved, while punctuation and whitespace are
 * collapsed into single hyphens. Diacritics are removed so "é" becomes "e".
 */
export const slugify = (value: unknown): string => {
  if (typeof value !== 'string') return ''

  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

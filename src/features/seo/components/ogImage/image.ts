/** Collapses whitespace and cuts long headlines so the card cannot overflow. */
export const clamp = (value: string, max: number): string => {
  const text = value.replace(/\s+/g, ' ').trim()

  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

const imageCache = new Map<string, string>()

/**
 * Satori needs the bytes, not a URL: inline the hero image as a data URI. The
 * page already stores a medium variant, so the fetch stays small. A failure
 * simply renders the gradient card.
 */
export const inlineImage = async (url: string | undefined): Promise<string | null> => {
  if (!url) return null

  const cached = imageCache.get(url)
  if (cached) return cached

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4_000),
    })

    if (!response.ok) return null

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > 6_000_000) return null

    const contentType = response.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
    const dataURI = `data:${contentType};base64,${buffer.toString('base64')}`

    imageCache.set(url, dataURI)

    return dataURI
  } catch {
    return null
  }
}

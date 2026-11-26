/**
 * YouTube helpers shared by the `YouTubeBlock` richtext block, the `videos`
 * collection and the homepage video section.
 *
 * The collection stores a snapshot of the video metadata: the public frontend
 * never calls YouTube at render time, so the homepage stays fast even if the
 * embed service is slow. The snapshot is refreshed when an editor saves the
 * document (see `src/collections/Videos.ts`).
 */

const YOUTUBE_ID =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i

const REQUEST_TIMEOUT_MS = 5_000

/** Accepts a full watch/shorts/embed/youtu.be URL and returns the 11-char id. */
export const extractYouTubeId = (value: string): string | null => {
  const match = YOUTUBE_ID.exec(value.trim())

  return match?.[1] ?? null
}

export const youtubeWatchUrl = (id: string): string => `https://www.youtube.com/watch?v=${id}`

export const youtubeEmbedUrl = (id: string): string => `https://www.youtube.com/embed/${id}`

export const youtubeThumbnail = (id: string, quality: 'maxres' | 'hq' = 'maxres'): string =>
  `https://i.ytimg.com/vi/${id}/${quality === 'maxres' ? 'maxresdefault' : 'hqdefault'}.jpg`

export type YouTubeMetadata = {
  authorName?: string
  description?: string
  durationSeconds?: number
  publishedAt?: string
  thumbnailUrl: string
  title: string
  viewCount?: number
}

type YouTubeLogger = {
  warn: (message: string) => void
}

type DataAPIResponse = {
  items?: Array<{
    contentDetails?: { duration?: string }
    snippet?: {
      channelTitle?: string
      description?: string
      publishedAt?: string
      thumbnails?: {
        high?: { url?: string }
        maxres?: { url?: string }
        medium?: { url?: string }
      }
      title?: string
    }
    statistics?: { viewCount?: string }
  }>
}

type OEmbedResponse = {
  author_name?: string
  thumbnail_url?: string
  title?: string
}

/** `PT1H2M3S` / `PT5M2S` / `P1DT2H` → seconds. */
export const parseISODuration = (value: string | undefined): number | undefined => {
  if (!value) return undefined

  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(value)
  if (!match) return undefined

  const [, days, hours, minutes, seconds] = match
  const total =
    Number(days ?? 0) * 86_400 +
    Number(hours ?? 0) * 3_600 +
    Number(minutes ?? 0) * 60 +
    Number(seconds ?? 0)

  return Number.isFinite(total) ? total : undefined
}

/** Seconds → `PT5M2S`, used by the JSON-LD `VideoObject.duration` field. */
export const toISODuration = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3_600)
  const minutes = Math.floor((safe % 3_600) / 60)
  const seconds = safe % 60
  const parts = `${hours > 0 ? `${hours}H` : ''}${minutes > 0 ? `${minutes}M` : ''}${
    seconds > 0 || safe === 0 ? `${seconds}S` : ''
  }`

  return `PT${parts}`
}

const fetchJSON = async <T,>(url: string): Promise<T | null> => {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) return null

  return (await response.json()) as T
}

const numeric = (value: string | undefined): number | undefined => {
  if (value === undefined) return undefined

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Fetches the metadata shown on the cards.
 *
 * The Data API (when `YOUTUBE_API_KEY` is set) is the only source for duration,
 * view count and publish date. oEmbed is the key-less fallback: it returns the
 * title, channel and thumbnail only. Failures always resolve to `null` so a
 * save is never blocked by YouTube being slow or unavailable.
 */
export const fetchYouTubeMetadata = async (
  id: string,
  logger?: YouTubeLogger,
): Promise<YouTubeMetadata | null> => {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (apiKey) {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/videos')
      url.searchParams.set('part', 'snippet,contentDetails,statistics')
      url.searchParams.set('id', id)
      url.searchParams.set('key', apiKey)

      const body = await fetchJSON<DataAPIResponse>(url.toString())
      const item = body?.items?.[0]

      if (item?.snippet?.title) {
        return {
          authorName: item.snippet.channelTitle,
          description: item.snippet.description,
          durationSeconds: parseISODuration(item.contentDetails?.duration),
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl:
            item.snippet.thumbnails?.maxres?.url ??
            item.snippet.thumbnails?.high?.url ??
            youtubeThumbnail(id),
          title: item.snippet.title,
          viewCount: numeric(item.statistics?.viewCount),
        }
      }
    } catch (error) {
      logger?.warn(`[youtube] Data API lookup failed for ${id}: ${String(error)}`)
    }
  }

  try {
    const url = new URL('https://www.youtube.com/oembed')
    url.searchParams.set('url', youtubeWatchUrl(id))
    url.searchParams.set('format', 'json')

    const body = await fetchJSON<OEmbedResponse>(url.toString())

    if (body?.title) {
      return {
        authorName: body.author_name,
        thumbnailUrl: body.thumbnail_url ?? youtubeThumbnail(id),
        title: body.title,
      }
    }
  } catch (error) {
    logger?.warn(`[youtube] oEmbed lookup failed for ${id}: ${String(error)}`)
  }

  return null
}

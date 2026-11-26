import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  extractYouTubeId,
  fetchYouTubeMetadata,
  parseISODuration,
  toISODuration,
  youtubeEmbedUrl,
  youtubeThumbnail,
  youtubeWatchUrl,
} from '@/shared/lib/youtube'

const ID = 'dQw4w9WgXcQ'

const jsonResponse = (body: unknown, ok = true) => ({
  ok,
  json: async () => body,
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('extractYouTubeId', () => {
  it('extracts an id from every supported URL shape', () => {
    const urls = [
      `https://www.youtube.com/watch?v=${ID}`,
      `https://www.youtube.com/watch?feature=share&v=${ID}&t=12`,
      `https://youtube.com/watch?v=${ID}`,
      `https://www.youtube.com/shorts/${ID}`,
      `https://www.youtube.com/embed/${ID}`,
      `https://www.youtube.com/live/${ID}`,
      `https://youtu.be/${ID}`,
      `  https://YOUTU.BE/${ID}  `,
    ]

    for (const url of urls) expect(extractYouTubeId(url)).toBe(ID)
  })

  it('accepts underscores and dashes in ids', () => {
    expect(extractYouTubeId(`https://youtu.be/a_b-cD12345`)).toBe('a_b-cD12345')
  })

  it('rejects missing, short, bare and non-YouTube values', () => {
    expect(extractYouTubeId('')).toBe(null)
    expect(extractYouTubeId('not a url')).toBe(null)
    expect(extractYouTubeId(ID)).toBe(null)
    expect(extractYouTubeId('https://vimeo.com/12345')).toBe(null)
    expect(extractYouTubeId('https://www.youtube.com/watch?v=short')).toBe(null)
    expect(extractYouTubeId('https://www.youtube.com/watch?list=PL123')).toBe(null)
  })

  it('does not silently truncate an overlong video id', () => {
    // YouTube ids are exactly 11 characters; a longer value is not a valid id.
    expect(extractYouTubeId(`https://youtu.be/${ID}extra`)).toBe(null)
  })
})

describe('YouTube URL builders', () => {
  it('builds watch, embed and thumbnail URLs', () => {
    expect(youtubeWatchUrl(ID)).toBe(`https://www.youtube.com/watch?v=${ID}`)
    expect(youtubeEmbedUrl(ID)).toBe(`https://www.youtube.com/embed/${ID}`)
    expect(youtubeThumbnail(ID)).toBe(`https://i.ytimg.com/vi/${ID}/maxresdefault.jpg`)
    expect(youtubeThumbnail(ID, 'hq')).toBe(`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`)
  })
})

describe('parseISODuration', () => {
  it('parses hours, minutes, seconds and days', () => {
    expect(parseISODuration('PT1H2M3S')).toBe(3723)
    expect(parseISODuration('PT5M2S')).toBe(302)
    expect(parseISODuration('P1DT2H')).toBe(93_600)
    expect(parseISODuration('PT1H30M')).toBe(5400)
    expect(parseISODuration('PT45S')).toBe(45)
  })

  it('parses zero-length durations', () => {
    expect(parseISODuration('PT0S')).toBe(0)
    expect(parseISODuration('P')).toBe(0)
    expect(parseISODuration('PT')).toBe(0)
  })

  it('rejects missing or malformed values', () => {
    expect(parseISODuration(undefined)).toBe(undefined)
    expect(parseISODuration('')).toBe(undefined)
    expect(parseISODuration('1H2M')).toBe(undefined)
    expect(parseISODuration('PT1.5S')).toBe(undefined)
    expect(parseISODuration('P-1D')).toBe(undefined)
    expect(parseISODuration('PT1H2M3Sextra')).toBe(undefined)
  })
})

describe('toISODuration', () => {
  it('formats seconds, minutes and hours', () => {
    expect(toISODuration(0)).toBe('PT0S')
    expect(toISODuration(59.9)).toBe('PT59S')
    expect(toISODuration(60)).toBe('PT1M')
    expect(toISODuration(3600)).toBe('PT1H')
    expect(toISODuration(3661)).toBe('PT1H1M1S')
    // No day component exists in the JSON-LD format used by the cards.
    expect(toISODuration(90_061)).toBe('PT25H1M1S')
  })

  it('clamps negative input to zero', () => {
    expect(toISODuration(-5)).toBe('PT0S')
  })

  it('does not emit an invalid duration for non-finite input', () => {
    expect(toISODuration(Number.NaN)).toBe('PT0S')
    expect(toISODuration(Number.POSITIVE_INFINITY)).toBe('PT0S')
  })
})

describe('fetchYouTubeMetadata', () => {
  it('uses the Data API when a key is configured', async () => {
    vi.stubEnv('YOUTUBE_API_KEY', 'test-key')
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        items: [
          {
            contentDetails: { duration: 'PT2M3S' },
            snippet: {
              channelTitle: 'Akarat TV',
              description: 'Description',
              publishedAt: '2026-01-01T00:00:00Z',
              thumbnails: { high: { url: 'https://img/high.jpg' } },
              title: 'Un titre',
            },
            statistics: { viewCount: '1234' },
          },
        ],
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    expect(await fetchYouTubeMetadata(ID)).toEqual({
      authorName: 'Akarat TV',
      description: 'Description',
      durationSeconds: 123,
      publishedAt: '2026-01-01T00:00:00Z',
      thumbnailUrl: 'https://img/high.jpg',
      title: 'Un titre',
      viewCount: 1234,
    })
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('key=test-key')
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(`id=${ID}`)
  })

  it('falls back to the generated thumbnail and ignores non-numeric views', async () => {
    vi.stubEnv('YOUTUBE_API_KEY', 'test-key')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          items: [
            {
              snippet: { title: 'Titre' },
              statistics: { viewCount: 'not-a-number' },
            },
          ],
        }),
      ),
    )

    const metadata = await fetchYouTubeMetadata(ID)
    expect(metadata?.thumbnailUrl).toBe(youtubeThumbnail(ID))
    expect(metadata?.viewCount).toBe(undefined)
    expect(metadata?.durationSeconds).toBe(undefined)
  })

  it('falls back to oEmbed when the Data API fails or has no usable item', async () => {
    vi.stubEnv('YOUTUBE_API_KEY', 'test-key')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, false))
      .mockResolvedValueOnce(
        jsonResponse({
          author_name: 'Akarat TV',
          thumbnail_url: 'https://img/oembed.jpg',
          title: 'Titre oEmbed',
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    expect(await fetchYouTubeMetadata(ID)).toEqual({
      authorName: 'Akarat TV',
      thumbnailUrl: 'https://img/oembed.jpg',
      title: 'Titre oEmbed',
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('youtube.com/oembed')
  })

  it('uses oEmbed directly when no API key is configured', async () => {
    vi.stubEnv('YOUTUBE_API_KEY', '')
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ title: 'Titre' }))
    vi.stubGlobal('fetch', fetchMock)

    expect(await fetchYouTubeMetadata(ID)).toEqual({
      authorName: undefined,
      thumbnailUrl: youtubeThumbnail(ID),
      title: 'Titre',
    })
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('returns null instead of throwing when every source fails', async () => {
    vi.stubEnv('YOUTUBE_API_KEY', 'test-key')
    const logger = { warn: vi.fn() }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValueOnce(new Error('timeout')).mockResolvedValueOnce(jsonResponse({}, false)),
    )

    expect(await fetchYouTubeMetadata(ID, logger)).toBe(null)
    // A failed Data API request is logged; a non-ok oEmbed response is simply
    // treated as "no metadata" without a warning.
    expect(logger.warn).toHaveBeenCalledTimes(1)
    expect(String(logger.warn.mock.calls[0]?.[0])).toContain('Data API')
  })

  it('returns null when oEmbed has no title', async () => {
    vi.stubEnv('YOUTUBE_API_KEY', '')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ thumbnail_url: 'x' })))

    expect(await fetchYouTubeMetadata(ID)).toBe(null)
  })
})

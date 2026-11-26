import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Video } from '@/payload-types'
import { CONTENT_TAGS } from '@/shared/lib/cacheTags'
import { REVALIDATE_SECONDS } from '@/shared/lib/content/constants'
import { extractYouTubeId, youtubeThumbnail } from '@/shared/lib/youtube'

/** Shape the homepage video section needs; keeps the collection type out of components. */
export type HomeVideo = {
  description: string | null
  durationSeconds: number | null
  id: number
  publishedAt: string | null
  thumbnailUrl: string
  title: string
  videoId: string
  viewCount: number | null
  youtubeUrl: string
}

const toHomeVideo = (video: Video): HomeVideo => {
  const videoId = video.videoId ?? extractYouTubeId(video.youtubeUrl) ?? ''

  return {
    description: video.description ?? null,
    durationSeconds: video.durationSeconds ?? null,
    id: video.id,
    publishedAt: video.publishedAt ?? null,
    // `hqdefault` always exists; `maxresdefault` is missing on older uploads.
    thumbnailUrl: video.thumbnailUrl ?? youtubeThumbnail(videoId, 'hq'),
    title: video.title ?? `YouTube ${videoId}`,
    videoId,
    viewCount: video.viewCount ?? null,
    youtubeUrl: video.youtubeUrl,
  }
}

/**
 * The homepage carousel reads its own cache entry, tagged `videos`. Saving a
 * video refreshes this list without dropping the article caches behind
 * `getHomeContent`.
 */
export const getHomeVideos = unstable_cache(
  async (): Promise<HomeVideo[]> => {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'videos',
      depth: 0,
      limit: 12,
      overrideAccess: false,
      pagination: false,
      sort: ['order', 'id'],
      where: { showOnHomepage: { equals: true } },
    })

    return result.docs.map(toHomeVideo)
  },
  ['home-videos'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAGS.videos],
  },
)

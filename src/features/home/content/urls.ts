import { homeFallbackImageId } from './images'
import type { HomeCard } from './types'

/** Unsplash source at a width large enough for its card. Next optimises from here. */
export const unsplashUrl = (id: string, width: number): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

/** CMS cards use their R2 URL; static editorial cards fall back to Unsplash. */
export const cardImageUrl = (card: Pick<HomeCard, 'imageId' | 'imageSrc'>, width: number): string =>
  card.imageSrc ?? unsplashUrl(card.imageId ?? homeFallbackImageId, width)

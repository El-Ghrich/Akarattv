import type { Locale } from '@/i18n/routing'
import { ar } from './ar'
import { fr } from './fr'
import type { HomeContent } from './types'

export type { HomeCard, HomeContent, HomeLink, HomeSection } from './types'
export { homeFallbackImageId } from './images'
export { cardImageUrl, unsplashUrl } from './urls'

export const homeContent: Record<Locale, HomeContent> = { ar, fr }

import type { Locale } from '@/i18n/routing'

import type { InfoPageContent, InfoPageSlug } from './types'
import { ar } from './ar'
import { fr } from './fr'

export { infoPageSlugs, infoLastUpdated } from './types'
export type {
  InfoPageSlug,
  InfoSection,
  InfoTeamMember,
  InfoContactChannel,
  InfoContactForm,
  InfoContact,
  InfoPageContent,
  InfoUi,
} from './types'
export { infoUi } from './ui'
export { infoContact } from './contact'

export const infoContent: Record<Locale, Record<InfoPageSlug, InfoPageContent>> = {
  ar,
  fr,
}

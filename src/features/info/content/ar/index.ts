import type { InfoPageContent, InfoPageSlug } from '../types'

import { about } from './about'
import { contact } from './contact'
import { privacy } from './privacy'
import { terms } from './terms'
import { editorialPolicy } from './editorialPolicy'

export const ar: Record<InfoPageSlug, InfoPageContent> = {
  about,
  contact,
  privacy,
  terms,
  'editorial-policy': editorialPolicy,
}

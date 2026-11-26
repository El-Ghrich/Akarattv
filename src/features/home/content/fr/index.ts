import type { HomeContent } from '../types'
import { frCore } from './core'
import { frNewsletter } from './newsletter'
import { frSections } from './sections'

export const fr: HomeContent = {
  ...frCore,
  newsletter: frNewsletter,
  sections: frSections,
}

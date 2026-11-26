import type { HomeContent } from '../types'
import { arCore } from './core'
import { arNewsletter } from './newsletter'
import { arSections } from './sections'

export const ar: HomeContent = {
  ...arCore,
  newsletter: arNewsletter,
  sections: arSections,
}

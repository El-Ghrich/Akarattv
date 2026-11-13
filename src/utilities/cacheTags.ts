/**
 * Cache tags used by the Payload data layer and by the collection hooks that
 * invalidate it. Keeping them in a standalone module avoids a cycle between
 * `content.ts` (which reads Payload) and the collection configs (which are
 * loaded by `payload.config.ts`).
 */
export const CONTENT_TAGS = {
  articles: 'articles',
  categories: 'categories',
  regions: 'regions',
} as const

/** Tag sets invalidated by collection hooks. */
export const revalidationTags = {
  article: [CONTENT_TAGS.articles, CONTENT_TAGS.categories, CONTENT_TAGS.regions],
  category: [CONTENT_TAGS.categories, CONTENT_TAGS.articles],
  // Region names and slugs appear on articles, the homepage and the footer.
  region: [CONTENT_TAGS.regions, CONTENT_TAGS.articles],
} as const

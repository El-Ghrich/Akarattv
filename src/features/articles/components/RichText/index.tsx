import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { getInArticlePlacement } from '@/features/ads/lib/adPlacement'

import { createConverters } from './converters'
import type { RichTextProps } from './types'

export type { RichTextProps } from './types'

/**
 * Renders Payload's Lexical JSON as semantic HTML.
 *
 * Everything that has a native semantic element gets one: figures with
 * captions, block quotes with citations, ordered/unordered lists, etc.
 * `dir` is set on every block so Arabic, French and numbers can coexist.
 */
export function RichText({
  className,
  content,
  locale,
  hasManualAdBlock = false,
  showAdSlot = false,
}: RichTextProps) {
  if (!content) return null

  // The planner returns a source node identity, never an edited document, so
  // Lexical keeps rendering one stable tree and heading/TOC ids stay in sync.
  const placement = showAdSlot
    ? getInArticlePlacement(content, locale, { hasManualAdBlock })
    : null

  // Mirrors `getArticleHeadings`: every heading takes a number, so TOC anchors
  // stay stable even when h4/h5 headings are hidden from the sidebar. The ids
  // are computed from the source nodes instead of a render counter: Lexical
  // keeps the converter closure between renders, and a counter would keep
  // advancing for the same heading (and break hydration).
  const headingIds = new WeakMap<object, number>()
  const rootChildren = (content as { root?: { children?: unknown[] } }).root?.children ?? []
  let headingCount = 0

  for (const child of rootChildren) {
    if (!child || typeof child !== 'object') continue
    if ((child as { type?: string }).type !== 'heading') continue

    headingCount += 1
    headingIds.set(child, headingCount)
  }

  const converters: JSXConvertersFunction = ({ defaultConverters }) =>
    createConverters({ defaultConverters, headingIds, locale, placement })

  return (
    <LexicalRichText
      className={className ?? 'rich-text'}
      converters={converters}
      data={content as unknown as SerializedEditorState}
    />
  )
}

export default RichText

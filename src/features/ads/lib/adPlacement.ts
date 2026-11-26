import type { Locale } from '@/i18n/routing'

type LexicalNode = {
  children?: LexicalNode[]
  fields?: unknown
  tag?: string
  text?: string
  type?: string
}

export type InArticlePlacement = {
  /** Node identity, not an index into a mutated document. */
  afterNode: object | null
  index: number | null
  shouldInject: boolean
}

/**
 * All in-article rules in one place. Thresholds are per-locale on purpose:
 * Arabic and French bodies are edited separately and can diverge.
 */
export const AD_PLACEMENT = {
  inArticle: {
    afterCountedParagraph: 3,
    minParagraphsFromEnd: 2,
  },
  shortArticle: {
    /** Fewer than 6 counted paragraphs means no mid-article slot. */
    maxCountedParagraphs: 5,
    minWords: { ar: 400, fr: 400 } satisfies Record<Locale, number>,
  },
  /** Visual blocks must never touch the slot. */
  visualBlockTypes: [
    'imageBlock',
    'pullQuote',
    'youtube',
    'infoBox',
    'relatedArticle',
  ],
  /**
   * Future hook: an editor-added manual ad block will set this and skip the
   * automatic injection. No Payload field is read in Phase A.
   */
  hasManualAdBlock: false,
} as const

const EMPTY_PLACEMENT: InArticlePlacement = {
  afterNode: null,
  index: null,
  shouldInject: false,
}

const rootChildren = (content: unknown): LexicalNode[] => {
  const editorState = content as { root?: { children?: unknown[] } } | null | undefined

  return Array.isArray(editorState?.root?.children)
    ? (editorState.root.children as LexicalNode[])
    : []
}

const nodeText = (node: LexicalNode | null | undefined): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  if (!Array.isArray(node.children)) return ''

  return node.children.map((child) => nodeText(child)).join('')
}

const countWords = (nodes: LexicalNode[]): number =>
  nodes
    .map((node) => nodeText(node))
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

const isHeading = (node: LexicalNode | undefined): boolean => node?.type === 'heading'

const isVisualNode = (node: LexicalNode | undefined): boolean => {
  if (!node) return false
  if (node.type === 'upload' || node.type === 'image') return true

  if (node.type === 'blocks') {
    const fields = node.fields as { blockType?: string } | undefined
    const blockType = fields?.blockType

    // Unknown custom blocks are treated as visual rather than risking an ad
    // wedged next to something an editor considers a visual unit.
    return blockType
      ? (AD_PLACEMENT.visualBlockTypes as readonly string[]).includes(blockType)
      : true
  }

  return false
}

/**
 * Pure placement planner. It never mutates the Lexical document: the renderer
 * receives the chosen node identity and injects the slot while rendering.
 *
 * Short articles deliberately return no mid-article slot. The article-end slot
 * is rendered unconditionally by `ArticleView`, so they still get an ad.
 */
export const getInArticlePlacement = (
  content: unknown,
  locale: Locale,
  options: { hasManualAdBlock?: boolean } = {},
): InArticlePlacement => {
  if (options.hasManualAdBlock ?? AD_PLACEMENT.hasManualAdBlock) return EMPTY_PLACEMENT

  const children = rootChildren(content)
  const counted = children
    .map((node, index) => ({ index, node }))
    .filter(({ node }) => node.type === 'paragraph' && nodeText(node).trim().length > 0)

  if (counted.length <= AD_PLACEMENT.shortArticle.maxCountedParagraphs) return EMPTY_PLACEMENT
  if (countWords(children) < AD_PLACEMENT.shortArticle.minWords[locale]) return EMPTY_PLACEMENT

  const startOrdinal = AD_PLACEMENT.inArticle.afterCountedParagraph - 1

  for (let ordinal = startOrdinal; ordinal < counted.length; ordinal += 1) {
    const candidate = counted[ordinal]
    if (!candidate) break

    const remaining = counted.length - (ordinal + 1)
    if (remaining < AD_PLACEMENT.inArticle.minParagraphsFromEnd) break

    const before = candidate.node
    const after = children[candidate.index + 1]

    if (before.type !== 'paragraph') continue
    if (isHeading(before) || isVisualNode(before)) continue
    if (isHeading(after) || isVisualNode(after)) continue

    return {
      afterNode: before,
      index: candidate.index,
      shouldInject: true,
    }
  }

  return EMPTY_PLACEMENT
}

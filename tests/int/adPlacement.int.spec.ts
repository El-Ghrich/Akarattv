import { describe, expect, it } from 'vitest'

import { AD_PLACEMENT, getInArticlePlacement } from '@/features/ads/lib/adPlacement'

const words = (count: number): string =>
  Array.from({ length: count }, (_, index) => `mot${index}`).join(' ')

const paragraph = (text: string) => ({ type: 'paragraph', children: [{ text }] })
const document = (children: unknown[]) => ({ root: { children, type: 'root' } })
const imageBlock = () => ({ type: 'blocks', fields: { blockType: 'imageBlock' } })
const heading = () => ({ type: 'heading', tag: 'h2', children: [{ text: 'Titre' }] })
const longParagraphs = (count: number, perParagraph = 70) =>
  Array.from({ length: count }, () => paragraph(words(perParagraph)))

describe('getInArticlePlacement', () => {
  it('skips the mid-article slot for short articles', () => {
    const result = getInArticlePlacement(document(longParagraphs(3)), 'fr')

    expect(result.shouldInject).toBe(false)
    expect(result.afterNode).toBeNull()
  })

  it('skips the slot below the word threshold even with many paragraphs', () => {
    // 8 paragraphs x 5 words = 40 words: long by paragraph count, short by words.
    expect(getInArticlePlacement(document(longParagraphs(8, 5)), 'fr').shouldInject).toBe(false)
  })

  it('injects after the third counted paragraph of a long article', () => {
    const children = longParagraphs(8)
    const result = getInArticlePlacement(document(children), 'fr')

    expect(result.shouldInject).toBe(true)
    expect(result.index).toBe(2)
    // Identity from the source tree, so the renderer never mutates content.
    expect(result.afterNode).toBe(children[2])
  })

  it('ignores empty paragraphs when counting', () => {
    const children = [paragraph(''), ...longParagraphs(7)]
    const result = getInArticlePlacement(document(children), 'ar')

    expect(result.shouldInject).toBe(true)
    expect(result.index).toBe(3)
  })

  it('moves to the next safe gap instead of sitting before a heading', () => {
    const children = [...longParagraphs(3), heading(), ...longParagraphs(5)]
    const result = getInArticlePlacement(document(children), 'fr')

    expect(result.index).toBe(4)
  })

  it('never sits next to a visual block', () => {
    const children = [...longParagraphs(3), imageBlock(), ...longParagraphs(5)]
    const result = getInArticlePlacement(document(children), 'fr')

    expect(result.index).toBe(4)
  })

  it('keeps at least two paragraphs before the end', () => {
    const children = [
      ...longParagraphs(3),
      imageBlock(),
      ...longParagraphs(1),
      imageBlock(),
      ...longParagraphs(1),
      imageBlock(),
      ...longParagraphs(1),
    ]

    expect(getInArticlePlacement(document(children), 'fr').shouldInject).toBe(false)
  })

  it('does not count paragraphs nested inside custom blocks', () => {
    const nested = {
      type: 'blocks',
      fields: { blockType: 'infoBox', paragraphs: longParagraphs(6) },
    }
    const children = [...longParagraphs(3), nested]

    expect(getInArticlePlacement(document(children), 'fr').shouldInject).toBe(false)
  })

  it('respects the future manual ad block hook', () => {
    const children = longParagraphs(8)

    expect(getInArticlePlacement(document(children), 'fr', { hasManualAdBlock: true }).shouldInject).toBe(
      false,
    )
    expect(AD_PLACEMENT.hasManualAdBlock).toBe(false)
  })
})

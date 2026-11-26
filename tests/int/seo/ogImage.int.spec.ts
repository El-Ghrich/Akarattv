import { afterEach, describe, expect, it, vi } from 'vitest'

import { clamp, inlineImage } from '@/features/seo/components/ogImage/image'

afterEach(() => {
  vi.unstubAllGlobals()
})

const imageResponse = (bytes: Uint8Array, contentType = 'image/png; charset=utf-8', ok = true) => ({
  ok,
  arrayBuffer: async () => bytes.buffer,
  headers: { get: (name: string) => (name === 'content-type' ? contentType : null) },
})

describe('clamp', () => {
  it('collapses whitespace and trims', () => {
    expect(clamp('  Un   titre\ncompact  ', 100)).toBe('Un titre compact')
    expect(clamp('', 10)).toBe('')
  })

  it('leaves short text untouched', () => {
    expect(clamp('abcdef', 6)).toBe('abcdef')
    expect(clamp('abc', 6)).toBe('abc')
  })

  it('truncates with an ellipsis and strips trailing spaces', () => {
    expect(clamp('abcdefghij', 5)).toBe('abcd…')
    // Whitespace is collapsed before truncation, leaving "abc " to trim.
    expect(clamp('abc   def', 5)).toBe('abc…')
    expect(clamp('abc', 1)).toBe('…')
  })
})

describe('inlineImage', () => {
  it('returns null without fetching when no URL is given', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    expect(await inlineImage(undefined)).toBe(null)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('turns bytes into a data URI and caches the result', async () => {
    const bytes = new Uint8Array([1, 2, 3, 4])
    const fetchMock = vi.fn().mockResolvedValue(imageResponse(bytes))
    vi.stubGlobal('fetch', fetchMock)
    const url = 'https://images.example/og-cache-test.png'

    const first = await inlineImage(url)
    const second = await inlineImage(url)

    expect(first).toBe(`data:image/png;base64,${Buffer.from(bytes).toString('base64')}`)
    expect(second).toBe(first)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('uses the default content type when the header is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(imageResponse(new Uint8Array([1]), null as never)))

    expect(await inlineImage('https://images.example/no-content-type.png')).toMatch(/^data:image\/jpeg;base64,/)
  })

  it('returns null on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(imageResponse(new Uint8Array([1]), 'image/png', false)))

    expect(await inlineImage('https://images.example/not-ok.png')).toBe(null)
  })

  it('rejects payloads larger than 6MB', async () => {
    const bytes = new Uint8Array(6_000_001)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(imageResponse(bytes)))

    expect(await inlineImage('https://images.example/too-large.png')).toBe(null)
  })

  it('returns null when the fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    expect(await inlineImage('https://images.example/offline.png')).toBe(null)
  })
})

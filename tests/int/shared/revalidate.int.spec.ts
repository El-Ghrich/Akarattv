import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { cacheMocks } = vi.hoisted(() => ({
  cacheMocks: {
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  },
}))

vi.mock('next/cache', () => cacheMocks)

import { revalidateContent } from '@/shared/lib/revalidate'

beforeEach(() => {
  cacheMocks.revalidatePath.mockClear()
  cacheMocks.revalidateTag.mockClear()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('revalidateContent', () => {
  it('invalidates every tag once with zero expiry and the whole layout path', async () => {
    await revalidateContent(['articles', 'categories', 'articles'])

    expect(cacheMocks.revalidateTag).toHaveBeenCalledTimes(2)
    expect(cacheMocks.revalidateTag).toHaveBeenNthCalledWith(1, 'articles', { expire: 0 })
    expect(cacheMocks.revalidateTag).toHaveBeenNthCalledWith(2, 'categories', { expire: 0 })
    expect(cacheMocks.revalidatePath).toHaveBeenCalledExactlyOnceWith('/', 'layout')
  })

  it('still revalidates the layout when no tags are supplied', async () => {
    await revalidateContent()

    expect(cacheMocks.revalidateTag).not.toHaveBeenCalled()
    expect(cacheMocks.revalidatePath).toHaveBeenCalledExactlyOnceWith('/', 'layout')
  })

  it('swallows errors outside a Next runtime', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('NEXT_RUNTIME', '')
    cacheMocks.revalidateTag.mockImplementationOnce(() => {
      throw new Error('no request store')
    })

    await expect(revalidateContent(['articles'])).resolves.toBeUndefined()
    expect(warn).not.toHaveBeenCalled()
  })

  it('warns when invalidation fails inside a Next runtime', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('NEXT_RUNTIME', 'nodejs')
    cacheMocks.revalidateTag.mockImplementationOnce(() => {
      throw new Error('boom')
    })

    await expect(revalidateContent(['articles'])).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalledOnce()
    expect(String(warn.mock.calls[0]?.[0])).toContain('[revalidate]')
  })
})

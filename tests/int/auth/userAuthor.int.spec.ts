import { describe, expect, it, vi } from 'vitest'

import { relationID, syncUserAuthor } from '@/features/auth/lib/userAuthor'

const createPayload = () => ({
  create: vi.fn().mockResolvedValue({ id: 99 }),
  find: vi.fn().mockResolvedValue({ docs: [] }),
  update: vi.fn().mockResolvedValue({}),
})

const req = {} as never

describe('relationID', () => {
  it('accepts primitive ids and populated relationships', () => {
    expect(relationID(7)).toBe(7)
    expect(relationID('abc')).toBe('abc')
    expect(relationID({ id: 12 })).toBe(12)
    expect(relationID({ id: 'slug' })).toBe('slug')
  })

  it('returns undefined for empty or id-less values', () => {
    expect(relationID(null)).toBe(undefined)
    expect(relationID(undefined)).toBe(undefined)
    expect(relationID({})).toBe(undefined)
  })
})

describe('syncUserAuthor', () => {
  it('creates an author, writes both locales and links the user', async () => {
    const payload = createPayload()

    const id = await syncUserAuthor({ req, payload: payload as never, userID: 4, name: 'Jean Dupont' })

    expect(id).toBe(99)
    expect(payload.find).toHaveBeenCalledTimes(2)
    expect(payload.find.mock.calls[0]?.[0]).toMatchObject({
      where: { user: { equals: 4 } },
      locale: 'all',
    })
    expect(payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'authors',
        data: { name: 'Jean Dupont', slug: 'jean-dupont', user: 4 },
        locale: 'ar',
      }),
    )
    expect(payload.update).toHaveBeenCalledTimes(2)
    expect(payload.update.mock.calls[0]?.[0]).toMatchObject({ collection: 'authors', locale: 'fr', id: 99 })
    expect(payload.update.mock.calls[1]?.[0]).toMatchObject({
      collection: 'users',
      id: 4,
      data: { author: 99 },
    })
  })

  it('updates both locales of an explicitly supplied author without re-linking', async () => {
    const payload = createPayload()

    const id = await syncUserAuthor({
      req,
      payload: payload as never,
      userID: 4,
      name: '  Marie  ',
      authorID: 12,
    })

    expect(id).toBe(12)
    expect(payload.find).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
    expect(payload.update).toHaveBeenCalledTimes(2)
    for (const call of payload.update.mock.calls) {
      expect(call[0]).toMatchObject({ collection: 'authors', id: 12, data: { name: 'Marie' } })
    }
  })

  it('reuses an author found by user relationship and links it back', async () => {
    const payload = createPayload()
    payload.find.mockResolvedValueOnce({ docs: [{ id: 5 }] })

    const id = await syncUserAuthor({ req, payload: payload as never, userID: 4, name: 'Ali' })

    expect(id).toBe(5)
    expect(payload.create).not.toHaveBeenCalled()
    expect(payload.update).toHaveBeenCalledTimes(3)
    expect(payload.update.mock.calls[2]?.[0]).toMatchObject({
      collection: 'users',
      id: 4,
      data: { author: 5 },
    })
  })

  it('suffixes a slug until it is unique', async () => {
    const payload = createPayload()
    payload.find
      .mockResolvedValueOnce({ docs: [] })
      .mockResolvedValueOnce({ docs: [{ id: 1 }] })
      .mockResolvedValueOnce({ docs: [{ id: 2 }] })
      .mockResolvedValueOnce({ docs: [] })

    await syncUserAuthor({ req, payload: payload as never, userID: 4, name: 'Ali' })

    expect(payload.find).toHaveBeenCalledTimes(4)
    expect(payload.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ slug: 'ali-3' }) }),
    )
    expect(payload.find.mock.calls[3]?.[0]).toMatchObject({
      where: { slug: { equals: 'ali-3' } },
    })
  })

  it('falls back to a default name and slug for blank input', async () => {
    const payload = createPayload()
    payload.find.mockImplementation((args: { where?: { slug?: { equals?: string } } }) =>
      Promise.resolve({ docs: args.where?.slug ? [] : [] }),
    )

    await syncUserAuthor({ req, payload: payload as never, userID: 4, name: '   ' })

    expect(payload.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ name: 'Akarattv', slug: 'akarattv' }) }),
    )
  })
})

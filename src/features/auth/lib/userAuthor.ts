import type { Payload, PayloadRequest } from 'payload'

import { slugify } from '@/shared/lib/slugify'

type LocalPayload = Pick<Payload, 'create' | 'find' | 'update'>

type SyncUserAuthorArgs = {
  /** The active request is required so nested writes join its transaction. */
  req: PayloadRequest
  payload: LocalPayload
  userID: number | string
  name: string
  authorID?: number | string
}

/** Accepts both a raw relationship ID and a populated document. */
export const relationID = (relation: unknown): number | string | undefined => {
  if (relation === null || relation === undefined) return undefined
  if (typeof relation === 'object') return (relation as { id?: number | string }).id

  return relation as number | string
}

const authorSlugExists = async (
  payload: LocalPayload,
  req: PayloadRequest,
  slug: string,
  excludeID?: number | string,
): Promise<boolean> => {
  const { docs } = await payload.find({
    collection: 'authors',
    depth: 0,
    limit: 1,
    locale: 'all',
    overrideAccess: true,
    req,
    where: {
      slug: { equals: slug },
      ...(excludeID === undefined ? {} : { id: { not_equals: excludeID } }),
    },
  })

  return docs.length > 0
}

const uniqueAuthorSlug = async (
  payload: LocalPayload,
  req: PayloadRequest,
  name: string,
  excludeID?: number | string,
): Promise<string> => {
  const base = slugify(name) || 'author'
  let candidate = base
  let suffix = 2

  while (await authorSlugExists(payload, req, candidate, excludeID)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

/**
 * Every user gets one public author profile. The profile keeps its own
 * localized name, slug and bio so articles can still render it exactly as
 * before; the user relationship is hidden from the public API.
 */
export const syncUserAuthor = async ({
  req,
  payload,
  userID,
  name,
  authorID,
}: SyncUserAuthorArgs): Promise<number | string> => {
  const authorName = name.trim() || 'Akarattv'
  let existingID = authorID

  if (existingID === undefined) {
    const linked = await payload.find({
      collection: 'authors',
      depth: 0,
      limit: 1,
      locale: 'all',
      overrideAccess: true,
      req,
      where: { user: { equals: userID } },
    })

    existingID = linked.docs[0]?.id
  }

  if (existingID !== undefined) {
    // Localized fields are written one locale at a time, matching the seed
    // script and the admin's normal save flow.
    await payload.update({
      collection: 'authors',
      data: { name: authorName } as never,
      id: existingID,
      locale: 'ar',
      overrideAccess: true,
      req,
    })
    await payload.update({
      collection: 'authors',
      data: { name: authorName } as never,
      id: existingID,
      locale: 'fr',
      overrideAccess: true,
      req,
    })

    if (authorID === undefined) {
      await payload.update({
        collection: 'users',
        data: { author: existingID } as never,
        id: userID,
        overrideAccess: true,
        req,
      })
    }

    return existingID
  }

  const slug = await uniqueAuthorSlug(payload, req, authorName)
  const created = await payload.create({
    collection: 'authors',
    data: { name: authorName, slug, user: userID } as never,
    locale: 'ar',
    overrideAccess: true,
    req,
  })

  await payload.update({
    collection: 'authors',
    data: { name: authorName, slug, user: userID } as never,
    id: created.id,
    locale: 'fr',
    overrideAccess: true,
    req,
  })
  await payload.update({
    collection: 'users',
    data: { author: created.id } as never,
    id: userID,
    overrideAccess: true,
    req,
  })

  return created.id
}

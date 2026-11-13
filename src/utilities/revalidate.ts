/**
 * On-demand revalidation for content edited in Payload.
 *
 * `revalidateTag` is what invalidates the `unstable_cache` entries created by
 * `src/utilities/content.ts`. `revalidatePath('/', 'layout')` also drops the
 * rendered route cache, because Payload is not calling this from a Server
 * Action where Next would refresh the UI itself.
 *
 * `next/cache` is imported lazily: Payload CLI commands (`payload run`,
 * migrations, the seed script) load the collection configs outside a Next.js
 * request, where these functions have no request store to work with.
 */
export async function revalidateContent(tags: readonly string[] = []): Promise<void> {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')

    for (const tag of new Set(tags)) {
      // `expire: 0` means the next visitor waits for fresh data instead of
      // being served the stale entry while a background refresh runs. Editors
      // expect a save in the admin to show up immediately.
      revalidateTag(tag, { expire: 0 })
    }

    revalidatePath('/', 'layout')
  } catch {
    // Outside a Next.js request (seed scripts, migrations) there is nothing to
    // invalidate. The next request will read from the database as usual.
  }
}

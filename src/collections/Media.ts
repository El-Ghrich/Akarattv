import type { CollectionConfig, ImageUploadFormatOptions } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { revalidationTags } from '@/utilities/cacheTags'
import { l } from '@/utilities/labels'
import { revalidateContent } from '@/utilities/revalidate'

/**
 * Every generated derivative is WebP.
 *
 * Quality 82 is the point where gradients and skin tones stay clean while a
 * typical press photo lands at roughly a tenth of its JPEG weight. Switching a
 * size to AVIF is a one-word change (`format: 'avif'`), at the cost of a much
 * slower upload: sharp needs several times longer to encode AVIF.
 */
const webp = (quality = 82): ImageUploadFormatOptions => ({
  format: 'webp',
  options: { quality },
})

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: l('Media', 'Média', 'وسيط'),
    plural: l('Media', 'Médias', 'الوسائط'),
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize'],
    group: l('Content', 'Contenu', 'المحتوى'),
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  // Media is embedded in the cached article/home/category/region documents.
  hooks: {
    afterChange: [() => revalidateContent(revalidationTags.media)],
    afterDelete: [() => revalidateContent(revalidationTags.media)],
  },
  upload: {
    /**
     * With a string `adminThumbnail`, Payload only selects the size's filename
     * and rebuilds a `/api/media/file/...` URL for the admin list. That route
     * does not exist when the S3 adapter has `disablePayloadAccessControl`
     * enabled, so the thumbnail request 404s on Vercel. A function receives the
     * selected document, so it can return the R2 URL produced by the storage
     * adapter's `afterRead` hook instead.
     */
    adminThumbnail: ({ doc }) => {
      const sizes = doc.sizes as
        | null
        | Record<string, { url?: null | string } | undefined>
        | undefined

      for (const name of ['thumbnail', 'small', 'medium', 'large']) {
        const url = sizes?.[name]?.url
        if (url) return url
      }

      return (doc.url as null | string | undefined) ?? null
    },
    // Raster formats only. SVG is excluded because sharp cannot rasterise it,
    // so it would skip resizing and reach the CDN unprocessed.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    /**
     * The original is stored exactly as uploaded. Admin uploads go straight
     * from the browser to R2 (`clientUploads`), so the server never receives
     * the bytes and cannot re-encode them. Setting `formatOptions` or
     * `resizeOptions` here would make Payload download the file, do that work,
     * then discard the result — and it would rewrite `doc.filename` to an
     * extension that does not exist in the bucket. The 12 MB upload limit in
     * `payload.config.ts` is what bounds the original instead.
     *
     * All display derivatives below are generated server-side, in WebP.
     */
    // Payload calls sharp's `.rotate()` on every derivative (auto-orient from
    // EXIF) and only re-attaches metadata when this is true. Keeping it false
    // is what strips EXIF, including GPS coordinates, from what readers get.
    withMetadata: false,
    // `focalPoint` is enabled by default; stated here because the hero crop
    // relies on it.
    focalPoint: true,
    /**
     * These widths mirror what the frontend actually requests through
     * `next/image` (`deviceSizes` in next.config.ts is 400/800/1200/1600).
     * Uploading a 2000px photo produces exactly these files and nothing else.
     *
     * Width only, so heights stay proportional. Payload does not upscale: an
     * upload narrower than a size simply omits that size.
     */
    imageSizes: [
      // 400 — admin list thumbnail, and 1x for small cards.
      { name: 'thumbnail', width: 400, formatOptions: webp() },
      // 800 — the widest the article column renders at 1x.
      { name: 'small', width: 800, formatOptions: webp() },
      // 1200 — 1.5x of the article column.
      { name: 'medium', width: 1200, formatOptions: webp() },
      // 1600 — 2x of the 800px column, i.e. the largest sensible hero.
      { name: 'large', width: 1600, formatOptions: webp() },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      label: l('Alt text', 'Texte alternatif', 'النص البديل'),
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: l('Caption', 'Légende', 'التسمية التوضيحية'),
    },
  ],
}

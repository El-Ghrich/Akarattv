import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  defaultColors,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  TextStateFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { s3Storage } from '@payloadcms/storage-s3'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Regions } from './collections/Regions'
import { Articles } from './collections/Articles'
import { Videos } from './collections/Videos'
import { ImageBlock } from './blocks/ImageBlock'
import { PullQuoteBlock } from './blocks/PullQuoteBlock'
import { RelatedArticleBlock } from './blocks/RelatedArticleBlock'
import { YouTubeBlock } from './blocks/YouTubeBlock'
import { InfoBoxBlock } from './blocks/InfoBoxBlock'
import { isAdmin, isAdminOrEditor } from './access'
import { revalidationTags } from './utilities/cacheTags'
import { l } from './utilities/labels'
import { revalidateContent } from './utilities/revalidate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Cloudflare R2 speaks the S3 API with three quirks that are not optional:
 *
 * - `region: 'auto'` — any other region string is rejected.
 * - `forcePathStyle: true` — R2 has no virtual-hosted-style buckets, so the
 *   request must be `endpoint/bucket/key`, not `bucket.endpoint/key`.
 * - the endpoint is per account, never per bucket.
 *
 * Files are uploaded through the private S3 host and read back through the
 * public `*.r2.dev` origin. Those are two different hostnames: the S3 host
 * refuses anonymous reads, which is exactly why `generateFileURL` below exists.
 */
const r2PublicURL = (process.env.R2_PUBLIC_URL ?? '').replace(/\/+$/, '')

const r2 = {
  accountID: process.env.R2_ACCOUNT_ID ?? '',
  accessKeyID: process.env.R2_ACCESS_KEY_ID ?? '',
  bucket: process.env.R2_BUCKET ?? '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
}

/**
 * Storage is switched off when the credentials are absent, so `npm run dev`
 * still boots on a fresh clone with no Cloudflare account.
 */
const r2Enabled = Boolean(
  r2.accountID && r2.accessKeyID && r2.bucket && r2.secretAccessKey && r2PublicURL,
)

/** 12 MB. Enforced before sharp ever buffers the file. */
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Authors, Categories, Regions, Articles, Videos],
  editor: lexicalEditor({
    admin: {
      // No hover "+" add-block handle and no bottom "+" paragraph button:
      // pressing Enter is enough to keep writing.
      hideAddBlockButton: true,
      hideInsertParagraphAtEnd: true,
    },
    features: [
      // Structure. H1 is reserved for the article title, so it is not
      // available inside the rich text body.
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5'] }),
      // Inline formatting
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      // Alignment + indentation
      AlignFeature(),
      IndentFeature(),
      // Lists
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      // Quotes, links, inline images, dividers
      BlockquoteFeature(),
      LinkFeature(),
      UploadFeature({ enabledCollections: ['media'] }),
      HorizontalRuleFeature(),
      // Custom content blocks, inserted from the slash (/) menu.
      BlocksFeature({
        blocks: [ImageBlock, PullQuoteBlock, RelatedArticleBlock, YouTubeBlock, InfoBoxBlock],
      }),
      // WordPress-style toolbar that stays visible while scrolling.
      FixedToolbarFeature(),
      // Text colour picker in the toolbar.
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
          },
        },
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  /**
   * Scheduled publishing is Payload's job queue: a save in the admin writes a
   * `schedulePublish` job row, and a worker applies it when its date arrives.
   * Something therefore has to pick jobs up:
   *
   * - Vercel: `vercel.json` calls `/api/payload-jobs/run` every minute.
   * - Long-lived Node host (Docker/VPS): set `PAYLOAD_JOBS_AUTORUN=true` and
   *   Payload runs the queue on its own timer.
   *
   * `autoRun` is opt-in because starting timers during `next build` would hang
   * the build.
   */
  jobs: {
    access: {
      cancel: isAdminOrEditor,
      queue: isAdminOrEditor,
      // A cron request carries no session, so it authenticates with the
      // CRON_SECRET bearer token instead. Editors can also trigger a run
      // manually while logged into the admin.
      run: ({ req }) => {
        if (isAdminOrEditor({ req })) return true

        const secret = process.env.CRON_SECRET

        return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
      },
    },
    ...(process.env.PAYLOAD_JOBS_AUTORUN === 'true' ? { autoRun: [{ cron: '* * * * *' }] } : {}),
  },
  sharp,
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      bucket: r2.bucket,
      /**
       * Vercel caps a serverless request body at 4.5 MB, which is smaller than
       * the 12 MB we accept. With client uploads the browser asks Payload for a
       * presigned URL, then PUTs the bytes straight to R2, so the function only
       * ever sees a few hundred bytes of JSON. The bucket needs a CORS rule
       * that allows PUT from the admin's origin (see README).
       */
      clientUploads: true,
      collections: {
        media: {
          // Every object lands under `media/`, which keeps the bucket tidy and
          // gives Cloudflare a single path to scope cache rules to later.
          prefix: 'media',
          // Stop Payload from proxying reads through /api/media/file/*. The
          // browser talks to R2 directly, so the CDN can cache the bytes.
          disablePayloadAccessControl: true,
          // Without this the adapter would hand out
          // `https://<account>.r2.cloudflarestorage.com/<bucket>/<key>` —
          // the private S3 host, which 403s for anonymous visitors.
          // `prefix` here is the object's folder, including `_objectKey`.
          generateFileURL: ({ filename, prefix }) =>
            `${r2PublicURL}/${[prefix, encodeURIComponent(filename)].filter(Boolean).join('/')}`,
        },
      },
      config: {
        endpoint: `https://${r2.accountID}.r2.cloudflarestorage.com`,
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: r2.accessKeyID,
          secretAccessKey: r2.secretAccessKey,
        },
      },
    }),
    /**
     * Editors keep old URLs working after a slug change. The `from` value is
     * matched verbatim against the request path, so it includes the language
     * prefix (`/ar/articles/old-slug`). The proxy resolves these rows before
     * next-intl touches the URL and answers with a real 301.
     */
    redirectsPlugin({
      collections: ['articles', 'categories', 'regions'],
      redirectTypes: ['301', '302', '308'],
      overrides: {
        labels: {
          singular: l('Redirect', 'Redirection', 'تحويل'),
          plural: l('Redirects', 'Redirections', 'التحويلات'),
        },
        admin: {
          useAsTitle: 'from',
          defaultColumns: ['from', 'to.type', 'type', 'updatedAt'],
          group: l('Content', 'Contenu', 'المحتوى'),
          description: l(
            'Enter the full old path, including the language prefix, for example /ar/articles/old-slug.',
            'Saisissez l’ancien chemin complet, préfixe de langue compris, par exemple /fr/articles/ancien-slug.',
            'أدخل المسار القديم كاملاً مع بادئة اللغة، مثال: /ar/articles/الرابط-القديم.',
          ),
        },
        access: {
          // The proxy reads this collection anonymously through the REST API.
          read: () => true,
          create: isAdminOrEditor,
          update: isAdminOrEditor,
          delete: isAdmin,
        },
        hooks: {
          afterChange: [() => revalidateContent(revalidationTags.redirect)],
          afterDelete: [() => revalidateContent(revalidationTags.redirect)],
        },
      },
    }),
  ],
  upload: {
    // Payload-wide cap, applied to every upload collection before resizing.
    limits: {
      fileSize: MAX_UPLOAD_BYTES,
    },
  },
  i18n: {
    // Admin UI languages. Arabic is the default when the browser does not
    // send a supported Accept-Language value and no language cookie is set.
    supportedLanguages: { ar, en, fr },
    fallbackLanguage: 'ar',
  },
  localization: {
    locales: [
      { code: 'ar', label: 'العربية', rtl: true },
      { code: 'fr', label: 'Français' },
    ],
    defaultLocale: 'ar',
    fallback: true,
  }
})

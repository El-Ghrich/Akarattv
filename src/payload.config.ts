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
import { ImageBlock } from './blocks/ImageBlock'
import { PullQuoteBlock } from './blocks/PullQuoteBlock'
import { RelatedArticleBlock } from './blocks/RelatedArticleBlock'
import { YouTubeBlock } from './blocks/YouTubeBlock'
import { InfoBoxBlock } from './blocks/InfoBoxBlock'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Authors, Categories, Regions, Articles],
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
  sharp,
  plugins: [],
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

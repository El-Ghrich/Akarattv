import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { slugify } from '@/utilities/slugify'
import { l } from '@/utilities/labels'

/**
 * Returns the id of a relationship value, whether it was submitted as a raw id
 * or as a populated document.
 */
const getRelationID = (relation: unknown): number | string | undefined => {
  if (relation === null || relation === undefined) return undefined
  if (typeof relation === 'object') return (relation as { id?: number | string }).id

  return relation as number | string
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: l('Article', 'Article', 'مقال'),
    plural: l('Articles', 'Articles', 'المقالات'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', '_status', 'publishedAt', 'updatedAt'],
    group: l('Content', 'Contenu', 'المحتوى'),
    livePreview: {
      openByDefault: true,
      breakpoints: [
        {
          name: 'mobile',
          label: 'Mobile',
          width: 390,
          height: 844,
        },
        {
          name: 'tablet',
          label: 'Tablet',
          width: 768,
          height: 1024,
        },
        {
          name: 'desktop',
          label: 'Desktop',
          width: 1440,
          height: 900,
        },
      ],
      url: ({ data, locale, req }) => {
        if (typeof data.slug !== 'string' || !data.slug) return undefined

        const host = req.headers.get('host')
        const protocol = req.headers.get('x-forwarded-proto') ?? 'http'
        const serverURL =
          process.env.NEXT_PUBLIC_SERVER_URL ||
          (host ? `${protocol}://${host}` : 'http://localhost:3000')

        return `${serverURL}/articles/${encodeURIComponent(data.slug)}?locale=${locale.code}&preview=1`
      },
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    // Logged-in admin/editor can read everything (including drafts).
    // Anonymous visitors only ever see published articles.
    read: ({ req: { user } }) => {
      if (isAdminOrEditor({ req: { user } })) return true

      return {
        _status: {
          equals: 'published',
        },
      }
    },
    readVersions: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        // Auto-generate the slug from the title when it is left empty.
        // Slugs are localized, so this runs for the locale being edited.
        if (!data.slug && typeof data.title === 'string') {
          const generated = slugify(data.title)
          if (generated) data.slug = generated
        }

        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        // Auto-set publishedAt the first time an article is published.
        if (data._status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        // Never allow an article to reference itself in relatedArticles.
        const selfID = originalDoc?.id
        if (selfID !== undefined && Array.isArray(data.relatedArticles)) {
          data.relatedArticles = data.relatedArticles.filter(
            (relation: unknown) => String(getRelationID(relation)) !== String(selfID),
          )
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: l('Title', 'Titre', 'العنوان'),
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
      index: true,
      label: l('Slug', 'Identifiant URL', 'المُعرِّف'),
      admin: {
        position: 'sidebar',
        description: l(
          'Auto-generated from the title. You can edit it.',
          'Généré automatiquement depuis le titre. Modifiable.',
          'يُولَّد تلقائياً من العنوان ويمكن تعديله.',
        ),
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      required: true,
      label: l('Excerpt', 'Extrait', 'المقتطف'),
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      required: true,
      label: l('Content', 'Contenu', 'المحتوى'),
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: l('Hero image', 'Image principale', 'الصورة الرئيسية'),
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: l('Category', 'Catégorie', 'التصنيف'),
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      label: l('Region', 'Région', 'الجهة'),
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      label: l('Author', 'Auteur', 'المؤلف'),
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: l('Published at', 'Date de publication', 'تاريخ النشر'),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: l('Featured', 'À la une', 'مقال مميز'),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      label: l('Related articles', 'Articles liés', 'مقالات ذات صلة'),
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
}

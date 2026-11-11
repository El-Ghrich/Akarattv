import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { slugify } from '@/utilities/slugify'

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
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', '_status', 'publishedAt', 'updatedAt'],
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
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from the title. You can edit it.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
}

import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { revalidationTags } from '@/utilities/cacheTags'
import { l } from '@/utilities/labels'
import { revalidateContent } from '@/utilities/revalidate'

export const Regions: CollectionConfig = {
  slug: 'regions',
  labels: {
    singular: l('Region', 'Région', 'جهة'),
    plural: l('Regions', 'Régions', 'الجهات'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: l('Content', 'Contenu', 'المحتوى'),
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  // Regions are cached aggressively, so an edit must clear the tag explicitly.
  hooks: {
    afterChange: [() => revalidateContent(revalidationTags.region)],
    afterDelete: [() => revalidateContent(revalidationTags.region)],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      label: l('Name', 'Nom', 'الاسم'),
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
      },
    },
  ],
}

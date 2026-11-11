import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { l } from '@/utilities/labels'

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

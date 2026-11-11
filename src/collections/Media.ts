import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { l } from '@/utilities/labels'

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
  upload: {
    // Phase 2: images only. R2 storage and image sizes arrive in Phase 3.
    mimeTypes: ['image/*'],
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

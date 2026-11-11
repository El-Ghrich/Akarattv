import type { Block } from 'payload'
import { l } from '@/utilities/labels'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  labels: {
    singular: l('Image', 'Image', 'صورة'),
    plural: l('Images', 'Images', 'صور'),
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: l('Image', 'Image', 'الصورة'),
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: l('Alt text', 'Texte alternatif', 'النص البديل'),
      admin: {
        description: l(
          'Describe the image for screen readers and search engines.',
          'Décrivez l’image pour les lecteurs d’écran et les moteurs de recherche.',
          'صف الصورة لقارئات الشاشة ومحركات البحث.',
        ),
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: l('Caption', 'Légende', 'التسمية التوضيحية'),
    },
  ],
}

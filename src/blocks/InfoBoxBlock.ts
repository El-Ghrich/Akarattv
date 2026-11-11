import type { Block } from 'payload'
import { l } from '@/utilities/labels'

export const InfoBoxBlock: Block = {
  slug: 'infoBox',
  labels: {
    singular: l('Info box', 'Encadré', 'صندوق معلومات'),
    plural: l('Info boxes', 'Encadrés', 'صناديق معلومات'),
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'info',
      label: l('Style', 'Style', 'النمط'),
      options: [
        { label: l('Information', 'Information', 'معلومة'), value: 'info' },
        { label: l('Tip', 'Conseil', 'نصيحة'), value: 'tip' },
        { label: l('Warning', 'Avertissement', 'تحذير'), value: 'warning' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: l('Title', 'Titre', 'العنوان'),
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: l('Content', 'Contenu', 'المحتوى'),
    },
  ],
}

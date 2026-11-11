import type { Block } from 'payload'
import { l } from '@/utilities/labels'

export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: {
    singular: l('Pull quote', 'Citation', 'اقتباس'),
    plural: l('Pull quotes', 'Citations', 'اقتباسات'),
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: l('Quote', 'Citation', 'الاقتباس'),
    },
    {
      name: 'attribution',
      type: 'text',
      label: l('Attribution', 'Attribution', 'نسبة الاقتباس'),
      admin: {
        description: l(
          'Who said it. Leave empty for an unattributed quote.',
          'Qui l’a dit. Laissez vide pour une citation sans attribution.',
          'صاحب الاقتباس. اتركه فارغاً لاقتباس دون نسبة.',
        ),
      },
    },
  ],
}

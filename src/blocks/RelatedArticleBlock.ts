import type { Block } from 'payload'
import { l } from '@/utilities/labels'

export const RelatedArticleBlock: Block = {
  slug: 'relatedArticle',
  labels: {
    singular: l('Related article', 'Article lié', 'مقال ذو صلة'),
    plural: l('Related articles', 'Articles liés', 'مقالات ذات صلة'),
  },
  admin: {
    disableBlockName: true,
  },
  fields: [
    {
      name: 'article',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
      label: l('Article', 'Article', 'المقال'),
      admin: {
        description: l(
          'Displayed as a link card inside the article body.',
          'Affiché sous forme de carte de lien dans le corps de l’article.',
          'يُعرض كبطاقة رابط داخل نص المقال.',
        ),
      },
    },
  ],
}

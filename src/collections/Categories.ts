import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { l } from '@/utilities/labels'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: l('Category', 'Catégorie', 'تصنيف'),
    plural: l('Categories', 'Catégories', 'التصنيفات'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'showOnHomepage', 'homepageOrder', 'updatedAt'],
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
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: l('Description', 'Description', 'الوصف'),
    },
    {
      name: 'showOnHomepage',
      type: 'checkbox',
      defaultValue: false,
      label: l('Show on homepage', 'Afficher sur la page d’accueil', 'إظهار في الصفحة الرئيسية'),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'homepageOrder',
      type: 'number',
      label: l('Homepage order', 'Ordre sur la page d’accueil', 'ترتيب الصفحة الرئيسية'),
      admin: {
        position: 'sidebar',
        description: l(
          'Order of the blocks on the home page.',
          'Ordre des blocs sur la page d’accueil.',
          'ترتيب الكتل في الصفحة الرئيسية.',
        ),
      },
    },
  ],
}

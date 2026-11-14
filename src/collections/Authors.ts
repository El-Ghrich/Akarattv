import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/access'
import { revalidationTags } from '@/utilities/cacheTags'
import { l } from '@/utilities/labels'
import { revalidateContent } from '@/utilities/revalidate'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: {
    singular: l('Author', 'Auteur', 'مؤلف'),
    plural: l('Authors', 'Auteurs', 'المؤلفون'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'jobTitle', 'updatedAt'],
    group: l('Content', 'Contenu', 'المحتوى'),
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  // Author name and photo are embedded in the cached article documents.
  hooks: {
    afterChange: [() => revalidateContent(revalidationTags.author)],
    afterDelete: [() => revalidateContent(revalidationTags.author)],
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
      required: true,
      unique: true,
      index: true,
      label: l('Slug', 'Identifiant URL', 'المُعرِّف'),
      admin: {
        position: 'sidebar',
        description: l(
          'Latin characters, used in the author URL.',
          'Caractères latins, utilisés dans l’URL de l’auteur.',
          'أحرف لاتينية تُستخدم في رابط المؤلف.',
        ),
      },
    },
    {
      name: 'jobTitle',
      type: 'text',
      localized: true,
      label: l('Job title', 'Fonction', 'المسمى الوظيفي'),
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
      label: l('Bio', 'Biographie', 'نبذة'),
    },
    {
      name: 'photo',
      type: 'relationship',
      relationTo: 'media',
      label: l('Photo', 'Photo', 'الصورة'),
    },
    {
      name: 'socials',
      type: 'group',
      label: l('Socials', 'Réseaux sociaux', 'الشبكات الاجتماعية'),
      fields: [
        {
          name: 'website',
          type: 'text',
          label: l('Website', 'Site web', 'الموقع الإلكتروني'),
        },
        {
          name: 'x',
          type: 'text',
          label: l('X (Twitter)', 'X (Twitter)', 'X (تويتر)'),
        },
        {
          name: 'linkedin',
          type: 'text',
          label: l('LinkedIn', 'LinkedIn', 'لينكدإن'),
        },
        {
          name: 'facebook',
          type: 'text',
          label: l('Facebook', 'Facebook', 'فيسبوك'),
        },
        {
          name: 'instagram',
          type: 'text',
          label: l('Instagram', 'Instagram', 'إنستغرام'),
        },
      ],
    },
  ],
}

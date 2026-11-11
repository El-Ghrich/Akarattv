import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrEditor, isAdminOrSelf } from '@/access'
import { l } from '@/utilities/labels'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: l('User', 'Utilisateur', 'مستخدم'),
    plural: l('Users', 'Utilisateurs', 'المستخدمون'),
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'createdAt'],
    group: l('Settings', 'Paramètres', 'الإعدادات'),
  },
  auth: true,
  access: {
    // Only admins and editors can access the admin panel
    admin: isAdminOrEditor,
    // Only admins can create new users
    create: isAdmin,
    // Admins can read all users; editors can only read their own user document
    read: isAdminOrSelf,
    // Admins can update any user; editors can only update their own profile
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        // Automatically make the very first user created an admin
        if (operation === 'create') {
          const existingUsers = await req.payload.find({
            collection: 'users',
            limit: 1,
          })

          if (existingUsers.totalDocs === 0) {
            return {
              ...data,
              roles: ['admin'],
            }
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      label: l('Roles', 'Rôles', 'الأدوار'),
      options: [
        {
          label: l('Admin', 'Administrateur', 'مدير'),
          value: 'admin',
        },
        {
          label: l('Editor', 'Éditeur', 'محرر'),
          value: 'editor',
        },
      ],
      saveToJWT: true,
      // Only admins can create users (enforced collection-wide) and only
      // admins can set/change a user's role.
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAdminOrEditor, isAdminOrSelf } from '@/access'
import { l } from '@/shared/lib/labels'
import { CHALLENGE_COOKIE } from '@/features/auth/lib/loginCookies'
import {
  clearChallengeCookies,
  clearLoginRateLimit,
  createChallenge,
  enforceLoginProtection,
  isLoginRequest,
  serializeCookie,
} from '@/features/auth/lib/loginSecurity'
import { relationID, syncUserAuthor } from '@/features/auth/lib/userAuthor'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: l('User', 'Utilisateur', 'مستخدم'),
    plural: l('Users', 'Utilisateurs', 'المستخدمون'),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles', 'author', 'createdAt'],
    group: l('Settings', 'Paramètres', 'الإعدادات'),
  },
  auth: {
    // Per-account lockout in addition to the per-IP KV limiter below.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  endpoints: [
    {
      method: 'get',
      path: '/login-challenge',
      handler: async (req) => {
        const { maxAge, question, token } = createChallenge(req)
        const headers = new Headers({ 'Cache-Control': 'no-store' })

        headers.append('Set-Cookie', serializeCookie(CHALLENGE_COOKIE, token, maxAge, true))

        return Response.json({ question }, { headers })
      },
    },
  ],
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
    beforeOperation: [
      async ({ args, operation, req }) => {
        // Runs before password verification, so bad challenges and flooded IPs
        // never reach the authentication operation. First-register calls
        // payload.login internally and is exempt via its request path.
        if (operation === 'login' && isLoginRequest(req)) {
          await enforceLoginProtection(req)
        }

        return args
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        // The first-register endpoint posts to `/users`, not to the generic
        // create handler. Keeping the name optional at the API boundary avoids
        // a validation failure before the author profile can be created.
        if (typeof data.name !== 'string' || !data.name.trim()) {
          const email = typeof data.email === 'string' ? data.email : ''
          data.name = email ? email.split('@')[0] : 'Akarattv'
        }

        return data
      },
    ],
    beforeChange: [
      async ({ req, operation, data }) => {
        // Automatically make the very first user created an admin
        if (operation === 'create') {
          const existingUsers = await req.payload.find({
            collection: 'users',
            limit: 1,
            req,
          })

          if (existingUsers.totalDocs === 0) {
            return {
              ...data,
              roles: 'admin',
            }
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        // The hook that links the profile updates this same collection. Skip
        // that follow-up save when nothing visible to the author changed.
        const authorID = relationID(doc.author)
        const nameChanged =
          operation === 'create' || previousDoc?.name !== doc.name || authorID === undefined

        if (!nameChanged) return

        await syncUserAuthor({
          req,
          payload: req.payload,
          userID: doc.id,
          name: typeof doc.name === 'string' ? doc.name : '',
          authorID,
        })
      },
    ],
    afterLogin: [
      async ({ req }) => {
        // A solved challenge and the IP counter are single-use.
        await clearLoginRateLimit(req)
        clearChallengeCookies(req)
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: l('Name', 'Nom', 'الاسم'),
      admin: {
        description: l(
          'Used as the author name on articles written by this user.',
          'Utilisé comme nom d’auteur sur les articles écrits par cet utilisateur.',
          'يُستخدم كاسم المؤلف في المقالات التي يكتبها هذا المستخدم.',
        ),
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      unique: true,
      label: l('Author profile', 'Profil auteur', 'ملف المؤلف'),
      admin: {
        position: 'sidebar',
        description: l(
          'Created automatically for every user. Editors can update the public profile from Content → Authors.',
          'Créé automatiquement pour chaque utilisateur. Les éditeurs peuvent modifier le profil public dans Contenu → Auteurs.',
          'يُنشأ تلقائياً لكل مستخدم. يمكن للمحررين تعديل الملف العام من المحتوى ← المؤلفون.',
        ),
      },
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'roles',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      label: l('Role', 'Rôle', 'الدور'),
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

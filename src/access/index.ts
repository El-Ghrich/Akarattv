import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

/**
 * Checks if a user has any of the specified roles.
 *
 * A user without roles has no privileges. Never treat an empty/missing `roles`
 * array as admin — that would let anyone who clears their roles escalate to
 * full access.
 */
export const checkRole = (roles: ('admin' | 'editor')[], user?: User | null): boolean => {
  if (!user || !user.roles || user.roles.length === 0) return false

  return roles.some((role) => user.roles?.includes(role))
}

/**
 * Allows access only to users with the 'admin' role.
 */
export const isAdmin = ({ req: { user } }: { req: { user?: User | null } }): boolean => {
  return checkRole(['admin'], user)
}

/**
 * Allows access to users with either 'admin' or 'editor' roles.
 */
export const isAdminOrEditor = ({ req: { user } }: { req: { user?: User | null } }): boolean => {
  return checkRole(['admin', 'editor'], user)
}

/**
 * Admins can access all documents.
 * Non-admins can only access their own document (where id matches).
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkRole(['admin'], user as User)) return true

  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Field-level access helper: only admins can update/access this field.
 */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return checkRole(['admin'], user as User)
}

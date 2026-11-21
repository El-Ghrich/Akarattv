import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

type Role = 'admin' | 'editor'

/**
 * Roles are single-valued now. Older JWTs can still contain an array from
 * before the migration, so both shapes are accepted until those sessions are
 * renewed.
 */
const hasRole = (roles: User['roles'] | Role[] | null | undefined, role: Role): boolean => {
  if (!roles) return false
  if (Array.isArray(roles)) return roles.includes(role)

  return roles === role
}

export const checkRole = (role: Role, user?: User | null): boolean => hasRole(user?.roles, role)

/**
 * Allows access only to users with the 'admin' role.
 */
export const isAdmin = ({ req: { user } }: { req: { user?: User | null } }): boolean => {
  return checkRole('admin', user)
}

/**
 * Allows access to users with either 'admin' or 'editor' roles.
 */
export const isAdminOrEditor = ({ req: { user } }: { req: { user?: User | null } }): boolean => {
  return checkRole('admin', user) || checkRole('editor', user)
}

/**
 * Admins can access all documents.
 * Non-admins can only access their own document (where id matches).
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (checkRole('admin', user as User)) return true

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
  return checkRole('admin', user as User)
}

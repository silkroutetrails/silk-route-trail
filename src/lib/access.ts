import type { Access, FieldHook } from 'payload'

type MaybeUser = { roles?: string[] } | null | undefined

export const hasRole = (user: unknown, role: string): boolean =>
  Array.isArray((user as MaybeUser)?.roles) && ((user as MaybeUser)?.roles as string[]).includes(role)

/** Any signed-in staff member (super-admin or editor). */
export const isStaff: Access = ({ req }) => Boolean(req.user)

/** Only the Super Admin. */
export const isSuperAdmin: Access = ({ req }) => hasRole(req.user, 'super-admin')

/** Anyone. */
export const anyone: Access = () => true

/** Public sees published items only; staff see everything. */
export const publishedOrStaff: Access = ({ req }) =>
  req.user ? true : { published: { equals: true } }

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** Fills the slug from a source field when the slug is left empty. */
export const slugFrom =
  (source: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value)
    const src = data?.[source]
    return typeof src === 'string' ? slugify(src) : value
  }

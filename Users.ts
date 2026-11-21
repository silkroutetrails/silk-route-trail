import type { CollectionConfig } from 'payload'
import { hasRole, isStaff, isSuperAdmin } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'roles'], group: 'Settings' },
  auth: {
    tokenExpiration: 60 * 60 * 12, // 12 hours
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
  },
  access: {
    // The first account is created from the admin sign-up screen; after that only the Super Admin adds staff.
    create: isSuperAdmin,
    read: isStaff,
    update: ({ req, id }) => hasRole(req.user, 'super-admin') || (Boolean(req.user) && req.user?.id === id),
    delete: isSuperAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) data.roles = ['super-admin'] // the very first user is always the Super Admin
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: [
        { label: 'Super Admin (full access)', value: 'super-admin' },
        { label: 'Editor (content and enquiries)', value: 'editor' },
      ],
      access: {
        // Only a Super Admin may change who is a Super Admin.
        update: ({ req }) => hasRole(req.user, 'super-admin'),
        create: ({ req }) => hasRole(req.user, 'super-admin') || !req.user,
      },
    },
  ],
}

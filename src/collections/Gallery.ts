import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery photo', plural: 'Gallery' },
  admin: { useAsTitle: 'caption', defaultColumns: ['caption', 'destination', 'order'], group: 'Content' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', required: true },
    { name: 'destination', type: 'relationship', relationTo: 'destinations' },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Smaller numbers appear first.' } },
  ],
}

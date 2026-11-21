import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', description: 'Photos used across the website. Add a short description of each photo.' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined },
    ],
    adminThumbnail: 'card',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Description (for accessibility and search)',
      admin: { description: 'Example: "Passu Cones above the Karakoram Highway at sunrise".' },
    },
  ],
}

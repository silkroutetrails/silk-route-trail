import type { CollectionConfig } from 'payload'
import { publishedOrStaff, isStaff, slugFrom } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks'

export const REGIONS = [
  { label: 'Gilgit-Baltistan', value: 'gilgit-baltistan' },
  { label: 'Chitral', value: 'chitral' },
  { label: 'Khyber Pakhtunkhwa', value: 'khyber-pakhtunkhwa' },
  { label: 'Punjab / Islamabad', value: 'punjab-islamabad' },
  { label: 'Azad Kashmir', value: 'azad-kashmir' },
  { label: 'Other', value: 'other' },
]

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'region', 'featured', 'published'], group: 'Content' },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Web address part. Leave empty to create it from the name.' },
      hooks: { beforeValidate: [slugFrom('name')] },
    },
    { name: 'region', type: 'select', options: REGIONS, required: true, defaultValue: 'gilgit-baltistan' },
    { name: 'location', type: 'text', label: 'Location line', admin: { description: 'Example: "Upper Hunza, Gilgit-Baltistan".' } },
    { name: 'summary', type: 'textarea', required: true, label: 'Short description (shown on cards)' },
    { name: 'description', type: 'textarea', label: 'Full description (shown on the destination page)' },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'photos',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Additional photos' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on the home page.' } },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Smaller numbers appear first.' } },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}

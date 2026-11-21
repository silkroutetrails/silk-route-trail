import type { CollectionConfig } from 'payload'
import { anyone, isStaff } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks'

export const PermitInfo: CollectionConfig = {
  slug: 'permit-info',
  labels: { singular: 'Permit or requirement', plural: 'Permits & Requirements' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'audience', 'order'], group: 'Content' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'permits',
      options: [
        { label: 'Permits and permissions', value: 'permits' },
        { label: 'Documents', value: 'documents' },
        { label: 'Health and fitness', value: 'health' },
        { label: 'Safety', value: 'safety' },
        { label: 'Packing', value: 'packing' },
      ],
    },
    {
      name: 'audience',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'Everyone', value: 'all' },
        { label: 'Foreign visitors', value: 'foreign' },
        { label: 'Pakistani nationals', value: 'local' },
      ],
    },
    { name: 'body', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'category', 'order'], group: 'Content' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Booking and payment', value: 'booking' },
        { label: 'Permits and safety', value: 'safety' },
        { label: 'Planning', value: 'planning' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}

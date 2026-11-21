import type { CollectionConfig, Field } from 'payload'
import { anyone, isStaff } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks'

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const LEVELS = [
  { label: 'Not recommended / closed', value: '0' },
  { label: 'Possible', value: '1' },
  { label: 'Good', value: '2' },
  { label: 'Best', value: '3' },
]

const monthFields: Field[] = SHORT.map((m, i) => ({
  name: `m${i + 1}`,
  type: 'select',
  label: m,
  defaultValue: '0',
  options: LEVELS,
  admin: { width: '25%' },
}))

export const Seasons: CollectionConfig = {
  slug: 'seasons',
  labels: { singular: 'Season row', plural: 'Seasonal Calendar' },
  admin: {
    useAsTitle: 'place',
    defaultColumns: ['place', 'region', 'order'],
    group: 'Content',
    description: 'One row per place or journey type in the Seasonal Calendar page.',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'place', type: 'text', required: true, label: 'Place or journey type' },
    { name: 'region', type: 'text', label: 'Region' },
    { name: 'note', type: 'text', label: 'Short note (optional)' },
    { type: 'row', fields: monthFields.slice(0, 4) },
    { type: 'row', fields: monthFields.slice(4, 8) },
    { type: 'row', fields: monthFields.slice(8, 12) },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}

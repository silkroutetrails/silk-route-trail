import type { CollectionConfig } from 'payload'
import { publishedOrStaff, isStaff, slugFrom } from '@/lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks'

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((label, i) => ({ label, value: String(i + 1) }))

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'durationDays', 'destination', 'featured', 'published'],
    group: 'Content',
  },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Web address part. Leave empty to create it from the title.' },
      hooks: { beforeValidate: [slugFrom('title')] },
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'getaway',
      options: [
        { label: 'Getaway (3 to 7 days)', value: 'getaway' },
        { label: 'Expedition (10 to 20 days)', value: 'expedition' },
      ],
    },
    { name: 'destination', type: 'relationship', relationTo: 'destinations' },
    { name: 'summary', type: 'textarea', required: true, label: 'Short description (shown on cards)' },
    { name: 'description', type: 'textarea', label: 'Full description' },
    { name: 'durationDays', type: 'number', required: true, min: 1, label: 'Duration (days)' },
    {
      name: 'difficulty',
      type: 'select',
      defaultValue: 'easy',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Challenging', value: 'challenging' },
        { label: 'Demanding', value: 'demanding' },
      ],
    },
    {
      name: 'months',
      type: 'select',
      hasMany: true,
      options: MONTHS,
      label: 'Best travel months',
      admin: { description: 'Used for the season filter and calendar.' },
    },
    { name: 'seasonNote', type: 'text', label: 'Travel period note', admin: { description: 'Example: "Late June to early September".' } },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'itinerary',
      type: 'array',
      labels: { singular: 'Day / stage', plural: 'Itinerary' },
      fields: [
        { name: 'title', type: 'text', required: true, admin: { description: 'Example: "Day 1: Islamabad to Chilas".' } },
        { name: 'description', type: 'textarea' },
      ],
    },
    { name: 'inclusions', type: 'array', labels: { singular: 'Item', plural: 'Included' }, fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'exclusions', type: 'array', labels: { singular: 'Item', plural: 'Not included' }, fields: [{ name: 'text', type: 'text', required: true }] },
    {
      type: 'row',
      fields: [
        { name: 'priceOnRequest', type: 'checkbox', defaultValue: true, label: 'Price on request (hide the price)' },
        {
          name: 'priceFrom',
          type: 'number',
          min: 0,
          label: 'Price from (per person)',
          admin: { condition: (_, s) => !s?.priceOnRequest },
        },
        {
          name: 'priceCurrency',
          type: 'select',
          defaultValue: 'PKR',
          options: [
            { label: 'PKR', value: 'PKR' },
            { label: 'USD', value: 'USD' },
          ],
          admin: { condition: (_, s) => !s?.priceOnRequest },
        },
      ],
    },
    { name: 'priceNote', type: 'text', label: 'Price note', admin: { description: 'Example: "Based on a group of 4. Private departures available."' } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show on the home page.' } },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Smaller numbers appear first.' } },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Untick to hide from the public site.' } },
  ],
}

import type { CollectionConfig, Field } from 'payload'
import { anyone, isStaff } from '@/lib/access'
import { makeNotifyHook } from '@/hooks'

const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'new',
  options: [
    { label: 'New', value: 'new' },
    { label: 'In conversation', value: 'in-progress' },
    { label: 'Booked', value: 'booked' },
    { label: 'Closed', value: 'closed' },
  ],
  admin: { position: 'sidebar' },
}

const notesField: Field = {
  name: 'internalNotes',
  type: 'textarea',
  label: 'Internal notes (never shown to the visitor)',
  admin: { position: 'sidebar' },
}

/** Visitors can create a record (through the website forms); only staff can read or change them. */
const requestAccess = { create: anyone, read: isStaff, update: isStaff, delete: isStaff }

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'enquiryType', 'tour', 'status', 'createdAt'], group: 'Inbox' },
  access: requestAccess,
  defaultSort: '-createdAt',
  hooks: { afterChange: [makeNotifyHook('enquiry')] },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', label: 'Phone / WhatsApp', maxLength: 40 },
    { name: 'country', type: 'text', label: 'Country / city', maxLength: 80 },
    {
      name: 'enquiryType',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'About a journey', value: 'tour' },
        { label: 'Corporate retreat', value: 'corporate' },
      ],
    },
    { name: 'tour', type: 'relationship', relationTo: 'tours' },
    { name: 'message', type: 'textarea', required: true, maxLength: 4000 },
    statusField,
    notesField,
  ],
}

export const TripRequests: CollectionConfig = {
  slug: 'trip-requests',
  labels: { singular: 'Custom trip request', plural: 'Custom Trip Requests' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'preferredStart', 'groupSize', 'status', 'createdAt'], group: 'Inbox' },
  access: requestAccess,
  defaultSort: '-createdAt',
  hooks: { afterChange: [makeNotifyHook('trip request')] },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', label: 'Phone / WhatsApp', maxLength: 40 },
    { name: 'country', type: 'text', label: 'Travelling from', maxLength: 80 },
    { name: 'preferredStart', type: 'text', label: 'Preferred start (month or date)', maxLength: 60 },
    { name: 'preferredEnd', type: 'text', label: 'End date or flexibility', maxLength: 120 },
    { name: 'groupSize', type: 'number', min: 1, max: 200 },
    {
      name: 'interests',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Trekking', value: 'trekking' },
        { label: 'Heritage and culture', value: 'heritage' },
        { label: 'Photography', value: 'photography' },
        { label: 'Lakes and valleys', value: 'valleys' },
        { label: 'Family trip', value: 'family' },
        { label: 'Corporate retreat', value: 'corporate' },
      ],
    },
    {
      name: 'fitnessLevel',
      type: 'select',
      options: [
        { label: 'Relaxed (easy walks only)', value: 'relaxed' },
        { label: 'Active (a few hours of walking a day)', value: 'active' },
        { label: 'Strong (multi-day treks)', value: 'strong' },
        { label: 'Expedition ready (high altitude experience)', value: 'expedition' },
      ],
    },
    { name: 'budget', type: 'text', label: 'Budget (optional)', maxLength: 80 },
    { name: 'notes', type: 'textarea', label: 'Anything else we should know', maxLength: 4000 },
    statusField,
    notesField,
  ],
}

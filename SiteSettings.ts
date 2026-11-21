import type { GlobalConfig } from 'payload'
import { anyone, isStaff } from '@/lib/access'
import { revalidateGlobal } from '@/hooks'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings', description: 'Contact details and licence information shown across the website.' },
  access: { read: anyone, update: isStaff },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp number (digits only, with country code)',
      admin: { description: 'Example: 923001234567. The WhatsApp button stays hidden until this is filled in.' },
    },
    { name: 'contactEmail', type: 'email', label: 'Public contact email' },
    {
      name: 'notificationEmail',
      type: 'email',
      label: 'Email that receives new enquiries',
      admin: { description: 'Falls back to the NOTIFY_EMAIL setting if left empty.' },
    },
    { name: 'phone', type: 'text', label: 'Phone number' },
    { name: 'officeAddress', type: 'textarea', label: 'Office address' },
    { name: 'officeHours', type: 'text', label: 'Office hours' },
    {
      name: 'licences',
      type: 'array',
      label: 'Licences and registrations shown in the footer',
      admin: { description: 'Add only what has actually been issued. Example: label "Tour operator licence", value "your licence number".' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'instagram', type: 'text', label: 'Instagram link' },
    { name: 'facebook', type: 'text', label: 'Facebook link' },
    { name: 'youtube', type: 'text', label: 'YouTube link' },
  ],
}

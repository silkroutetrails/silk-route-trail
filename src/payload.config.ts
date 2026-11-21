import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Destinations } from './collections/Destinations'
import { Tours } from './collections/Tours'
import { Gallery } from './collections/Gallery'
import { Seasons } from './collections/Seasons'
import { PermitInfo, Faqs } from './collections/Info'
import { Enquiries, TripRequests } from './collections/Requests'
import { SiteSettings } from './globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.EMAIL_FROM_ADDRESS)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' | Silk Route Trails Admin' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Destinations, Tours, Gallery, Seasons, PermitInfo, Faqs, Media, Enquiries, TripRequests, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-me-before-going-live',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  // Without SMTP settings Payload prints emails to the server log instead of sending them.
  email: smtpConfigured
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS as string,
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Silk Route Trails',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
        },
      })
    : undefined,
  plugins: [
    // Photos are stored in Vercel Blob when a token is present; otherwise on local disk (fine for development only).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  sharp,
})

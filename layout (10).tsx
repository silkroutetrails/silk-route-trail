import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getSettings, isPreview } from '@/lib/data'

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: 'Silk Route Trails | Adventure & Heritage Tours in Pakistan', template: '%s | Silk Route Trails' },
  description:
    'Adventure and heritage journeys in Gilgit-Baltistan and Chitral for Pakistani and international travellers. Getaways of 3 to 7 days and Expeditions of 10 to 20 days.',
  openGraph: { type: 'website', siteName: 'Silk Route Trails' },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#101A2E' }

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings()
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Josefin+Sans:wght@300;400;600;700&display=swap"
        />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-amber focus:px-3 focus:py-2">
          Skip to content
        </a>
        {isPreview && (
          <div className="bg-amber px-4 py-2 text-center text-xs font-semibold text-night">
            Preview mode: sample content, no database connected. Forms will not save.
          </div>
        )}
        <Header />
        <main id="main">{children}</main>
        <Footer s={settings} />
        <WhatsAppButton number={settings.whatsappNumber} />
      </body>
    </html>
  )
}

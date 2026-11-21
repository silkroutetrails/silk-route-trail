import type { MetadataRoute } from 'next'
import { getDestinations, getTours } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const [tours, dests] = await Promise.all([getTours(), getDestinations()])
  const pages = ['', '/about', '/destinations', '/tours', '/gallery', '/plan-your-trip', '/seasonal-calendar', '/permits-and-requirements', '/corporate-retreats', '/faqs', '/contact']
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...dests.map((d) => ({ url: `${base}/destinations/${d.slug}` })),
    ...tours.map((t) => ({ url: `${base}/tours/${t.slug}` })),
  ]
}

import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  sampleDestinations, sampleFaqs, sampleGallery, sampleInfo, sampleSeasons, sampleSettings, sampleTours,
} from './sample'
import type { Destination, Faq, GalleryItem, Img, InfoItem, SeasonRow, Settings, Tour } from './types'

/** Preview mode = no database configured. The site shows sample content so you can see the design. */
export const isPreview = !process.env.DATABASE_URI

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>

const getClient = cache(async () => getPayload({ config }))

const img = (m: unknown): Img | null => {
  const o = m as Doc | null
  if (o && typeof o === 'object' && typeof o.url === 'string') {
    return { url: (o.sizes?.hero?.url as string) || o.url, alt: (o.alt as string) || '' }
  }
  return null
}
const imgs = (rows: unknown): Img[] =>
  Array.isArray(rows) ? rows.map((r) => img((r as Doc)?.image)).filter((x): x is Img => Boolean(x)) : []
const texts = (rows: unknown): string[] =>
  Array.isArray(rows) ? rows.map((r) => String((r as Doc)?.text ?? '')).filter(Boolean) : []
const rel = (v: unknown): Doc | null => (v && typeof v === 'object' ? (v as Doc) : null)

const toDestination = (x: Doc): Destination => ({
  slug: x.slug,
  name: x.name,
  region: x.region ?? 'other',
  location: x.location ?? '',
  summary: x.summary ?? '',
  description: x.description ?? '',
  highlights: texts(x.highlights),
  cover: img(x.coverImage),
  photos: imgs(x.photos),
  featured: Boolean(x.featured),
})

const toTour = (x: Doc): Tour => {
  const dest = rel(x.destination)
  return {
    slug: x.slug,
    title: x.title,
    kind: x.kind === 'expedition' ? 'expedition' : 'getaway',
    destinationSlug: dest?.slug ?? null,
    destinationName: dest?.name ?? null,
    summary: x.summary ?? '',
    description: x.description ?? '',
    durationDays: Number(x.durationDays) || 0,
    difficulty: x.difficulty ?? 'easy',
    months: Array.isArray(x.months) ? x.months.map(Number) : [],
    seasonNote: x.seasonNote ?? '',
    highlights: texts(x.highlights),
    itinerary: Array.isArray(x.itinerary)
      ? x.itinerary.map((i: Doc) => ({ title: i.title ?? '', description: i.description ?? '' }))
      : [],
    inclusions: texts(x.inclusions),
    exclusions: texts(x.exclusions),
    priceOnRequest: x.priceOnRequest !== false,
    priceFrom: typeof x.priceFrom === 'number' ? x.priceFrom : null,
    priceCurrency: x.priceCurrency ?? 'PKR',
    priceNote: x.priceNote ?? '',
    cover: img(x.coverImage),
    photos: imgs(x.photos),
    featured: Boolean(x.featured),
  }
}

export const getDestinations = cache(async (): Promise<Destination[]> => {
  if (isPreview) return sampleDestinations
  const payload = await getClient()
  const r = await payload.find({ collection: 'destinations', limit: 200, depth: 1, sort: 'order', where: { published: { equals: true } } })
  return r.docs.map(toDestination)
})

export const getDestination = async (slug: string) => (await getDestinations()).find((d) => d.slug === slug) ?? null

export const getTours = cache(async (): Promise<Tour[]> => {
  if (isPreview) return sampleTours
  const payload = await getClient()
  const r = await payload.find({ collection: 'tours', limit: 500, depth: 2, sort: 'order', where: { published: { equals: true } } })
  return r.docs.map(toTour)
})

export const getTour = async (slug: string) => (await getTours()).find((t) => t.slug === slug) ?? null

export const getGallery = cache(async (): Promise<GalleryItem[]> => {
  if (isPreview) return sampleGallery
  const payload = await getClient()
  const r = await payload.find({ collection: 'gallery', limit: 500, depth: 2, sort: 'order' })
  return r.docs
    .map((x: Doc) => {
      const image = img(x.image)
      return image
        ? { id: String(x.id), image, caption: x.caption ?? '', destinationName: rel(x.destination)?.name ?? null }
        : null
    })
    .filter((x): x is GalleryItem => Boolean(x))
})

export const getSeasons = cache(async (): Promise<SeasonRow[]> => {
  if (isPreview) return sampleSeasons
  const payload = await getClient()
  const r = await payload.find({ collection: 'seasons', limit: 200, depth: 0, sort: 'order' })
  return r.docs.map((x: Doc) => ({
    place: x.place,
    region: x.region ?? '',
    note: x.note ?? '',
    levels: Array.from({ length: 12 }, (_, i) => Number(x[`m${i + 1}`] ?? 0)),
  }))
})

export const getInfo = cache(async (): Promise<InfoItem[]> => {
  if (isPreview) return sampleInfo
  const payload = await getClient()
  const r = await payload.find({ collection: 'permit-info', limit: 200, depth: 0, sort: 'order' })
  return r.docs.map((x: Doc) => ({
    title: x.title, category: x.category ?? 'permits', audience: x.audience ?? 'all', body: x.body ?? '',
  }))
})

export const getFaqs = cache(async (): Promise<Faq[]> => {
  if (isPreview) return sampleFaqs
  const payload = await getClient()
  const r = await payload.find({ collection: 'faqs', limit: 200, depth: 0, sort: 'order' })
  return r.docs.map((x: Doc) => ({ question: x.question, answer: x.answer, category: x.category ?? 'general' }))
})

export const getSettings = cache(async (): Promise<Settings> => {
  if (isPreview) return sampleSettings
  const payload = await getClient()
  const x: Doc = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  return {
    whatsappNumber: String(x.whatsappNumber ?? '').replace(/\D/g, ''),
    contactEmail: x.contactEmail ?? '',
    phone: x.phone ?? '',
    officeAddress: x.officeAddress ?? '',
    officeHours: x.officeHours ?? '',
    licences: Array.isArray(x.licences)
      ? x.licences.map((l: Doc) => ({ label: l.label ?? '', value: l.value ?? '' }))
      : [],
    instagram: x.instagram ?? '',
    facebook: x.facebook ?? '',
    youtube: x.youtube ?? '',
  }
})

export { getClient }

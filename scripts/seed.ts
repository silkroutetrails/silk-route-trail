/**
 * Loads the SAMPLE content into your database so the admin panel and site have something to start from.
 * Run once after setting DATABASE_URI:   npm run seed
 * It does nothing if destinations already exist, so it can never overwrite your real content.
 */
try {
  process.loadEnvFile('.env')
} catch {
  // No .env file: use the variables already in the environment.
}

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { sampleDestinations, sampleFaqs, sampleInfo, sampleSeasons, sampleTours } from '../src/lib/sample'

async function main() {
  if (!process.env.DATABASE_URI) throw new Error('Set DATABASE_URI first (see .env.example).')
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'destinations' })
  if (existing.totalDocs > 0) {
    console.log('Destinations already exist. Nothing seeded.')
    process.exit(0)
  }

  const destIds = new Map<string, string | number>()
  let order = 10
  for (const d of sampleDestinations) {
    const doc = await payload.create({
      collection: 'destinations',
      data: {
        name: d.name, slug: d.slug, region: d.region, location: d.location, summary: d.summary,
        description: d.description, highlights: d.highlights.map((text) => ({ text })),
        featured: d.featured, order: (order += 10), published: true,
      },
    })
    destIds.set(d.slug, doc.id)
  }

  order = 10
  for (const t of sampleTours) {
    await payload.create({
      collection: 'tours',
      data: {
        title: t.title, slug: t.slug, kind: t.kind,
        destination: t.destinationSlug ? destIds.get(t.destinationSlug) : undefined,
        summary: t.summary, description: t.description, durationDays: t.durationDays, difficulty: t.difficulty,
        months: t.months.map(String), seasonNote: t.seasonNote,
        highlights: t.highlights.map((text) => ({ text })),
        itinerary: t.itinerary, inclusions: t.inclusions.map((text) => ({ text })),
        exclusions: t.exclusions.map((text) => ({ text })),
        priceOnRequest: true, priceCurrency: t.priceCurrency, priceNote: t.priceNote,
        featured: t.featured, order: (order += 10), published: true,
      },
    })
  }

  order = 10
  for (const s of sampleSeasons) {
    const levels = Object.fromEntries(s.levels.map((l, i) => [`m${i + 1}`, String(l)]))
    await payload.create({
      collection: 'seasons',
      data: { place: s.place, region: s.region, note: s.note, order: (order += 10), ...levels },
    })
  }
  order = 10
  for (const i of sampleInfo) await payload.create({ collection: 'permit-info', data: { ...i, order: (order += 10) } })
  order = 10
  for (const f of sampleFaqs) await payload.create({ collection: 'faqs', data: { ...f, order: (order += 10) } })

  console.log('Sample content loaded. Open /admin to edit it.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

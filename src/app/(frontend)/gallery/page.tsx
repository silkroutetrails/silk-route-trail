import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/Cards'
import { getGallery } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = { title: 'Gallery' }

export default async function Gallery() {
  const items = await getGallery()
  return (
    <>
      <PageHero eyebrow="Gallery" title="Landscapes and moments from the trail." />
      <section className="container-x mt-12">
        {items.length ? (
          <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((g) => (
              <li key={g.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-snow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.image.url} alt={g.image.alt || g.caption} loading="lazy" className="w-full" />
                <p className="p-3 text-sm text-muted">{g.caption}{g.destinationName ? ` · ${g.destinationName}` : ''}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl bg-snow p-10 text-center">
            <p className="text-lg font-semibold text-night">Photos are on their way.</p>
            <p className="mt-2 text-muted">We are building the gallery from our first scouting trips. In the meantime, browse the journeys.</p>
            <Link href="/tours" className="btn btn-primary mt-6">See journeys</Link>
          </div>
        )}
      </section>
    </>
  )
}

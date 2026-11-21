import type { Metadata } from 'next'
import { DestinationCard, PageHero } from '@/components/Cards'
import { getDestinations } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = { title: 'Destinations' }

export default async function Destinations() {
  const list = await getDestinations()
  return (
    <>
      <PageHero eyebrow="Destinations" title="Valleys, lakes, forts and high passes." intro="Where we run journeys, and what makes each place worth the trip." />
      <section className="container-x mt-12">
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DestinationCard key={d.slug} d={d} />)}</div>
        ) : (
          <p className="text-muted">Destinations are being added. Please check back soon.</p>
        )}
      </section>
    </>
  )
}

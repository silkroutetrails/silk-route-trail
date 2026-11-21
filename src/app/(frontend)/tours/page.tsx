import type { Metadata } from 'next'
import { PageHero } from '@/components/Cards'
import { ToursExplorer } from '@/components/ToursExplorer'
import { getTours } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = { title: 'Tours & Expeditions' }

export default async function Tours() {
  const tours = await getTours()
  return (
    <>
      <PageHero eyebrow="Tours & Expeditions" title="Getaways of 3 to 7 days. Expeditions of 10 to 20." intro="Pick a journey as it is, or use it as a starting point and we will adjust it for your group." />
      <section className="container-x mt-10">
        {tours.length ? <ToursExplorer tours={tours} /> : <p className="text-muted">Journeys are being added. Please check back soon.</p>}
      </section>
    </>
  )
}

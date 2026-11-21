import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Cover, PageHero, TourCard } from '@/components/Cards'
import { getDestination, getTours } from '@/lib/data'
import { REGION_LABELS } from '@/lib/types'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await getDestination((await params).slug)
  return d ? { title: d.name, description: d.summary } : {}
}

export default async function DestinationPage({ params }: Props) {
  const slug = (await params).slug
  const [d, tours] = await Promise.all([getDestination(slug), getTours()])
  if (!d) notFound()
  const related = tours.filter((t) => t.destinationSlug === d.slug)
  return (
    <>
      <PageHero eyebrow={REGION_LABELS[d.region] ?? d.region} title={d.name} intro={d.location || d.summary} />
      <section className="container-x mt-12 grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {d.cover && <Cover img={d.cover} seed={d.slug} className="aspect-[16/9] rounded-2xl" />}
          <p className="text-lg text-ink/90">{d.description || d.summary}</p>
          {d.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {d.photos.map((p, i) => <Cover key={i} img={p} seed={`${d.slug}-${i}`} className="aspect-[4/3] rounded-xl" />)}
            </div>
          )}
        </div>
        <aside className="rounded-2xl border border-line bg-snow p-6">
          <h2 className="text-xl font-semibold text-night">Highlights</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/90">{d.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
          <Link href="/plan-your-trip" className="btn btn-primary mt-6 w-full">Plan a trip here</Link>
        </aside>
      </section>
      {related.length > 0 && (
        <section className="container-x mt-16">
          <h2 className="text-3xl font-semibold text-night">Journeys in {d.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((t) => <TourCard key={t.slug} t={t} />)}</div>
        </section>
      )}
    </>
  )
}

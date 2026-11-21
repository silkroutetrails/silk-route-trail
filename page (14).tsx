import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Cover, PageHero, monthRange, priceText } from '@/components/Cards'
import { EnquiryForm } from '@/components/Forms'
import { getTour, getTours } from '@/lib/data'
import { DIFFICULTY_LABELS } from '@/lib/types'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTour((await params).slug)
  return t ? { title: t.title, description: t.summary } : {}
}

export default async function TourPage({ params }: Props) {
  const slug = (await params).slug
  const t = await getTour(slug)
  if (!t) notFound()
  const all = await getTours()
  const similar = all.filter((x) => x.slug !== t.slug && x.kind === t.kind).slice(0, 2)
  const facts: [string, string][] = [
    ['Duration', `${t.durationDays} days`],
    ['Difficulty', DIFFICULTY_LABELS[t.difficulty]],
    ['Best months', t.seasonNote || monthRange(t.months) || 'Ask us'],
    ['Destination', t.destinationName ?? 'Several'],
    ['Price', priceText(t)],
  ]
  return (
    <>
      <PageHero eyebrow={t.kind === 'expedition' ? 'Expedition' : 'Getaway'} title={t.title} intro={t.summary} />
      <section className="container-x mt-12 grid gap-10 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {t.cover && <Cover img={t.cover} seed={t.slug} className="aspect-[16/9] rounded-2xl" />}
          {t.description && <p className="text-lg text-ink/90">{t.description}</p>}
          {t.highlights.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-night">Highlights</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {t.highlights.map((h) => <li key={h} className="rounded-xl bg-snow px-4 py-3 text-sm font-semibold text-night">{h}</li>)}
              </ul>
            </div>
          )}
          {t.itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-night">Itinerary</h2>
              <ol className="mt-4 space-y-4 border-l-2 border-teal-bright/50 pl-6">
                {t.itinerary.map((s, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-amber" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-night">{s.title}</h3>
                    {s.description && <p className="text-sm text-muted">{s.description}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {(t.inclusions.length > 0 || t.exclusions.length > 0) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {t.inclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-night">Included</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">{t.inclusions.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              )}
              {t.exclusions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-night">Not included</h2>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">{t.exclusions.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              )}
            </div>
          )}
          {t.photos.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {t.photos.map((p, i) => <Cover key={i} img={p} seed={`${t.slug}-${i}`} className="aspect-[4/3] rounded-xl" />)}
            </div>
          )}
          <p className="text-sm text-muted">
            Before you book, read <Link href="/permits-and-requirements" className="font-semibold text-teal underline">permits &amp; requirements</Link>.
          </p>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <dl className="rounded-2xl border border-line bg-snow p-6">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-semibold text-night">{v}</dd>
              </div>
            ))}
            {t.priceNote && <p className="mt-3 text-xs text-muted">{t.priceNote}</p>}
          </dl>
          <div id="enquire" className="rounded-2xl border border-line p-6">
            <h2 className="text-xl font-semibold text-night">Enquire about this journey</h2>
            <div className="mt-4"><EnquiryForm tourSlug={t.slug} tourTitle={t.title} /></div>
          </div>
        </aside>
      </section>
      {similar.length > 0 && (
        <section className="container-x mt-16">
          <h2 className="text-2xl font-semibold text-night">You may also like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {similar.map((s) => (
              <Link key={s.slug} href={`/tours/${s.slug}`} className="card block p-5 hover:text-teal">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

import Link from 'next/link'
import { PeakArt } from './PeakArt'
import { DIFFICULTY_LABELS, MONTH_SHORT, REGION_LABELS, type Destination, type Img, type Tour } from '@/lib/types'

export function Cover({ img, seed, className = 'aspect-[4/3]' }: { img: Img | null; seed: string; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-night ${className}`}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.url} alt={img.alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <PeakArt seed={seed} className="h-full w-full" />
      )}
    </div>
  )
}

export const monthRange = (m: number[]) => {
  if (!m.length) return ''
  const s = [...m].sort((a, b) => a - b)
  return s.length === 1 ? MONTH_SHORT[s[0] - 1] : `${MONTH_SHORT[s[0] - 1]} to ${MONTH_SHORT[s[s.length - 1] - 1]}`
}

export const priceText = (t: Tour) =>
  t.priceOnRequest || t.priceFrom == null
    ? 'Price on request'
    : `From ${t.priceCurrency} ${t.priceFrom.toLocaleString('en-US')} per person`

export function TourCard({ t }: { t: Tour }) {
  return (
    <Link href={`/tours/${t.slug}`} className="card group flex h-full flex-col">
      <div className="relative">
        <Cover img={t.cover} seed={t.slug} />
        <span className="absolute left-3 top-3 rounded-full bg-night/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber">
          {t.kind === 'expedition' ? 'Expedition' : 'Getaway'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold leading-snug text-night group-hover:text-teal">{t.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{t.summary}</p>
        <dl className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="chip">{t.durationDays} days</span>
          <span className="chip">{DIFFICULTY_LABELS[t.difficulty]}</span>
          {t.destinationName && <span className="chip">{t.destinationName}</span>}
        </dl>
        <p className="mt-4 text-sm font-semibold text-teal">{priceText(t)}</p>
      </div>
    </Link>
  )
}

export function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link href={`/destinations/${d.slug}`} className="card group block h-full">
      <Cover img={d.cover} seed={d.slug} />
      <div className="p-5">
        <p className="eyebrow">{REGION_LABELS[d.region] ?? d.region}</p>
        <h3 className="mt-1 text-xl font-semibold text-night group-hover:text-teal">{d.name}</h3>
        <p className="mt-2 text-sm text-muted">{d.summary}</p>
      </div>
    </Link>
  )
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-night text-snow">
      <PeakArt seed={title} className="absolute inset-0 h-full w-full opacity-40" />
      <div className="container-x relative py-16 sm:py-20">
        <p className="eyebrow !text-amber">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-snow/80">{intro}</p>}
      </div>
    </section>
  )
}

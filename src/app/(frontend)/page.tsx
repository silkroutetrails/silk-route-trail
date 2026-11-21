import Link from 'next/link'
import { DestinationCard, TourCard, Cover } from '@/components/Cards'
import { PeakArt } from '@/components/PeakArt'
import { getDestinations, getFaqs, getGallery, getSeasons, getTours } from '@/lib/data'
import { MONTH_SHORT } from '@/lib/types'

export const revalidate = 60

export default async function Home() {
  const [tours, destinations, gallery, seasons, faqs] = await Promise.all([
    getTours(), getDestinations(), getGallery(), getSeasons(), getFaqs(),
  ])
  const featuredTours = (tours.filter((t) => t.featured).length ? tours.filter((t) => t.featured) : tours).slice(0, 6)
  const featuredDest = (destinations.filter((d) => d.featured).length ? destinations.filter((d) => d.featured) : destinations).slice(0, 3)
  const best = (levels: number[]) =>
    levels.map((l, i) => (l === 3 ? MONTH_SHORT[i] : null)).filter(Boolean)
  return (
    <>
      <section className="relative overflow-hidden bg-night text-snow">
        <PeakArt seed="hero-karakoram" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/20 to-night/80" />
        <div className="container-x relative py-24 sm:py-32 lg:py-40">
          <p className="eyebrow !text-amber">Adventure &amp; heritage tours</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            Follow the old Silk Route into the Karakoram.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-snow/85">
            Small-group and private journeys through Gilgit-Baltistan and Chitral, planned around your dates, your pace and your fitness.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tours" className="btn btn-amber">Explore journeys</Link>
            <Link href="/plan-your-trip" className="btn btn-ghost-dark">Plan your trip</Link>
          </div>
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Getaways', '3 to 7 days. Valleys, lakes, forts and easy walks.'],
            ['Expeditions', '10 to 20 days. Treks and heritage circuits.'],
            ['Made to measure', 'Tell us your dates and we shape the trip around you.'],
          ].map(([h, p]) => (
            <div key={h} className="rounded-2xl border border-line bg-snow p-6">
              <h2 className="text-xl font-semibold text-night">{h}</h2>
              <p className="mt-2 text-sm text-muted">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-20">
        <p className="eyebrow">Featured destinations</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-night sm:text-4xl">Where we take you</h2>
          <Link href="/destinations" className="text-sm font-semibold text-teal hover:underline">All destinations</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDest.map((d) => <DestinationCard key={d.slug} d={d} />)}
        </div>
      </section>

      <section className="container-x mt-20">
        <p className="eyebrow">Popular tours and expeditions</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-night sm:text-4xl">Journeys for summer 2027</h2>
          <Link href="/tours" className="text-sm font-semibold text-teal hover:underline">All journeys</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((t) => <TourCard key={t.slug} t={t} />)}
        </div>
      </section>

      <section className="mt-20 bg-snow py-16">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Seasonal opportunities</p>
            <h2 className="mt-2 text-3xl font-semibold text-night sm:text-4xl">Know when to go</h2>
            <p className="mt-4 text-muted">The high valleys open late and close early. Our first season runs through summer 2027. These are the best months, as we currently see them.</p>
            <Link href="/seasonal-calendar" className="btn btn-primary mt-6">See the full calendar</Link>
          </div>
          <ul className="space-y-3">
            {seasons.slice(0, 5).map((s) => (
              <li key={s.place} className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 text-sm">
                <span className="font-semibold text-night">{s.place}</span>
                <span className="text-muted">{best(s.levels).join(', ') || 'Ask us'}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="container-x mt-20">
          <p className="eyebrow">From the trail</p>
          <h2 className="mt-2 text-3xl font-semibold text-night sm:text-4xl">Gallery</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.slice(0, 8).map((g) => (
              <div key={g.id} className="overflow-hidden rounded-xl">
                <Cover img={g.image} seed={g.id} className="aspect-square" />
              </div>
            ))}
          </div>
          <Link href="/gallery" className="mt-6 inline-block text-sm font-semibold text-teal hover:underline">See the full gallery</Link>
        </section>
      )}

      <section className="container-x mt-20">
        <div className="grid items-center gap-8 rounded-3xl bg-night p-8 text-snow sm:p-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-amber">Corporate retreats</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Take the team somewhere that resets them.</h2>
            <p className="mt-4 text-snow/80">Group journeys and retreats in the mountains, planned around your goals, your people and your budget.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/corporate-retreats" className="btn btn-amber">Corporate retreats</Link>
            <Link href="/contact" className="btn btn-ghost-dark">Talk to us</Link>
          </div>
        </div>
      </section>

      <section className="container-x mt-20">
        <h2 className="text-3xl font-semibold text-night sm:text-4xl">Questions, answered</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
          {faqs.slice(0, 4).map((f) => (
            <details key={f.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-night">
                {f.question}<span aria-hidden="true" className="text-teal transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
        <Link href="/faqs" className="mt-4 inline-block text-sm font-semibold text-teal hover:underline">All FAQs</Link>
      </section>

      <section className="container-x mt-20 text-center">
        <h2 className="text-3xl font-semibold text-night sm:text-4xl">Ready to start planning?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Tell us when you want to go and what you love doing. We will reply personally.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/plan-your-trip" className="btn btn-primary">Plan your trip</Link>
          <Link href="/contact" className="btn btn-ghost">Contact us</Link>
        </div>
      </section>
    </>
  )
}

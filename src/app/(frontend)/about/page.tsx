import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/Cards'

export const metadata: Metadata = { title: 'About us' }

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Slow, respectful journeys along the old Silk Route." intro="Silk Route Trails is a new tour operator for adventure and heritage travel in Gilgit-Baltistan and Chitral." />
      <section className="container-x mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5 text-lg text-ink/90">
          <p>The Silk Route was never one road. It was a web of valleys, passes and market towns, and many of its oldest stretches run through the Karakoram. We design journeys that follow those threads, with enough time to look properly.</p>
          <p>We serve both Pakistani and international travellers. That means honest advice on what each route is really like, clear information on permits and preparation, and itineraries that give you room to rest, wander and talk to people.</p>
          <p>Our first season is summer 2027. We keep groups small, work with local guides and communities, and plan every journey around fitness, altitude and weather rather than a fixed script.</p>
        </div>
        <aside className="space-y-4">
          {[
            ['Heritage first', 'Forts, rock carvings, villages and the stories attached to them.'],
            ['Honest planning', 'Clear, current information on permits, fitness and what to expect.'],
            ['Respect for people and place', 'Small groups, local guides, and consent before photographing people.'],
          ].map(([h, p]) => (
            <div key={h} className="rounded-2xl border border-line bg-snow p-5">
              <h2 className="text-lg font-semibold text-night">{h}</h2>
              <p className="mt-1 text-sm text-muted">{p}</p>
            </div>
          ))}
        </aside>
      </section>
      <section className="container-x mt-14">
        <Link href="/plan-your-trip" className="btn btn-primary">Plan your trip</Link>
      </section>
    </>
  )
}

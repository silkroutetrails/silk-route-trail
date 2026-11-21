import type { Metadata } from 'next'
import { PageHero } from '@/components/Cards'
import { TripRequestForm } from '@/components/Forms'

export const metadata: Metadata = { title: 'Plan your trip' }

export default function Plan() {
  return (
    <>
      <PageHero eyebrow="Plan your trip" title="Tell us what you have in mind." intro="Share your dates, group and interests. We will come back with a suggested route and the practical details." />
      <section className="container-x mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2"><TripRequestForm /></div>
        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-snow p-6 text-sm">
          <h2 className="text-lg font-semibold text-night">What happens next</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted">
            <li>You receive an email confirming we have your request.</li>
            <li>A member of our team reads it and replies personally.</li>
            <li>We suggest a route, timing and an indicative budget.</li>
            <li>You decide. There is no obligation.</li>
          </ol>
        </aside>
      </section>
    </>
  )
}

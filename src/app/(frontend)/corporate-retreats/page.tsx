import type { Metadata } from 'next'
import { PageHero } from '@/components/Cards'
import { EnquiryForm } from '@/components/Forms'

export const metadata: Metadata = { title: 'Corporate retreats' }

export default function Corporate() {
  return (
    <>
      <PageHero eyebrow="Corporate retreats" title="Take the team somewhere that resets them." intro="Group journeys and retreats in the mountains, shaped around your goals, your people and your budget." />
      <section className="container-x mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Leadership offsites', 'Quiet settings, room to think, and time to talk away from the office.'],
              ['Team journeys', 'Shared challenge and shared views, matched to the fitness of the whole group.'],
              ['Incentive trips', 'Reward a team with an experience they will describe for years.'],
              ['Custom programmes', 'Workshops, cultural visits and downtime, balanced your way.'],
            ].map(([h, p]) => (
              <div key={h} className="rounded-2xl border border-line bg-snow p-5">
                <h2 className="text-lg font-semibold text-night">{h}</h2>
                <p className="mt-1 text-sm text-muted">{p}</p>
              </div>
            ))}
          </div>
          <p className="text-muted">Tell us your group size, preferred season and goals. We will propose an itinerary, logistics and an indicative budget.</p>
        </div>
        <div className="rounded-2xl border border-line p-6">
          <h2 className="text-xl font-semibold text-night">Talk to us about a retreat</h2>
          <div className="mt-4">
            <EnquiryForm enquiryType="corporate" messagePlaceholder="Company, group size, preferred dates, and what you want the retreat to achieve." />
          </div>
        </div>
      </section>
    </>
  )
}

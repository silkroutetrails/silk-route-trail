import type { Metadata } from 'next'
import { PageHero } from '@/components/Cards'
import { EnquiryForm } from '@/components/Forms'
import { getSettings } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = { title: 'Contact us' }

export default async function Contact() {
  const s = await getSettings()
  const hasDetails = s.contactEmail || s.phone || s.officeAddress || s.whatsappNumber
  return (
    <>
      <PageHero eyebrow="Contact us" title="Let's talk about your journey." intro="Send an enquiry and a member of our team will reply personally." />
      <section className="container-x mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2"><EnquiryForm /></div>
        <aside className="h-fit space-y-4 rounded-2xl border border-line bg-snow p-6 text-sm">
          <h2 className="text-lg font-semibold text-night">Other ways to reach us</h2>
          {hasDetails ? (
            <ul className="space-y-3">
              {s.whatsappNumber && <li><span className="block text-muted">WhatsApp</span><a className="font-semibold text-teal" href={`https://wa.me/${s.whatsappNumber}`} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></li>}
              {s.contactEmail && <li><span className="block text-muted">Email</span><a className="font-semibold text-teal" href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></li>}
              {s.phone && <li><span className="block text-muted">Phone</span><span className="font-semibold">{s.phone}</span></li>}
              {s.officeAddress && <li><span className="block text-muted">Office</span><span className="whitespace-pre-line font-semibold">{s.officeAddress}</span></li>}
              {s.officeHours && <li><span className="block text-muted">Hours</span><span className="font-semibold">{s.officeHours}</span></li>}
            </ul>
          ) : (
            <p className="text-muted">Direct contact details will appear here soon. For now, the enquiry form is the quickest way to reach us.</p>
          )}
        </aside>
      </section>
    </>
  )
}

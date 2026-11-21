import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/Cards'
import { getFaqs } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = { title: 'FAQs' }

export default async function Faqs() {
  const faqs = await getFaqs()
  return (
    <>
      <PageHero eyebrow="FAQs" title="Frequently asked questions." />
      <section className="container-x mt-12 max-w-3xl">
        <div className="divide-y divide-line rounded-2xl border border-line">
          {faqs.map((f) => (
            <details key={f.question} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-night">
                {f.question}<span aria-hidden="true" className="text-teal transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-muted">Still have a question? <Link href="/contact" className="font-semibold text-teal underline">Send us an enquiry</Link>.</p>
      </section>
    </>
  )
}

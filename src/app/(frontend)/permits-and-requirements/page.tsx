import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/Cards'
import { getInfo } from '@/lib/data'

export const revalidate = 60
export const metadata: Metadata = { title: 'Permits & requirements' }

const CATS: Record<string, string> = {
  permits: 'Permits and permissions',
  documents: 'Documents',
  health: 'Health and fitness',
  safety: 'Safety',
  packing: 'Packing',
}
const AUD: Record<string, string> = { foreign: 'Foreign visitors', local: 'Pakistani nationals' }

export default async function Permits() {
  const items = await getInfo()
  const groups = Object.keys(CATS).map((k) => [k, items.filter((i) => i.category === k)] as const).filter(([, v]) => v.length)
  return (
    <>
      <PageHero eyebrow="Permits & requirements" title="What you need before you travel." intro="Requirements change, so we confirm the current rules for your nationality, route and dates before you book." />
      <section className="container-x mt-12 space-y-12">
        {groups.map(([k, list]) => (
          <div key={k}>
            <h2 className="text-2xl font-semibold text-night">{CATS[k]}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {list.map((i) => (
                <article key={i.title} className="rounded-2xl border border-line p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-night">{i.title}</h3>
                    {AUD[i.audience] && <span className="chip shrink-0">{AUD[i.audience]}</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted">{i.body}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
        <p className="rounded-2xl bg-snow p-6 text-sm text-muted">
          This page is general guidance, not a substitute for the current official requirements. Not sure what applies to you?{' '}
          <Link href="/contact" className="font-semibold text-teal underline">Ask us</Link>.
        </p>
      </section>
    </>
  )
}

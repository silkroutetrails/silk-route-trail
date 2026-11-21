import type { Metadata } from 'next'
import { PageHero } from '@/components/Cards'
import { getSeasons } from '@/lib/data'
import { MONTH_SHORT } from '@/lib/types'

export const revalidate = 60
export const metadata: Metadata = { title: 'Seasonal calendar' }

const LEVEL = [
  { label: 'Not recommended or closed', cls: 'bg-snow text-muted' },
  { label: 'Possible', cls: 'bg-amber/25 text-night' },
  { label: 'Good', cls: 'bg-teal-bright/45 text-night' },
  { label: 'Best', cls: 'bg-teal text-white' },
]

export default async function Seasons() {
  const rows = await getSeasons()
  return (
    <>
      <PageHero eyebrow="Seasonal calendar" title="When each place is at its best." intro="Our first season is summer 2027. Conditions change from year to year, so we confirm timing with you before booking." />
      <section className="container-x mt-12">
        <ul className="flex flex-wrap gap-3 text-xs font-semibold" aria-label="Key">
          {LEVEL.map((l) => <li key={l.label} className={`rounded-full px-3 py-1 ${l.cls}`}>{l.label}</li>)}
        </ul>
        <div className="relative mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <caption className="sr-only">Best travel months for each place</caption>
            <thead>
              <tr className="bg-snow text-left">
                <th scope="col" className="p-3">Place</th>
                {MONTH_SHORT.map((m) => <th key={m} scope="col" className="p-2 text-center font-semibold">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.place} className="border-t border-line">
                  <th scope="row" className="p-3 text-left font-semibold text-night">
                    {r.place}
                    {r.note && <span className="block text-xs font-normal text-muted">{r.note}</span>}
                  </th>
                  {r.levels.map((l, i) => (
                    <td key={i} className="p-1">
                      <span className={`block rounded-md py-2 text-center text-xs font-semibold ${LEVEL[l]?.cls ?? LEVEL[0].cls}`} title={`${MONTH_SHORT[i]}: ${LEVEL[l]?.label}`}>
                        <span className="sr-only">{LEVEL[l]?.label}</span>
                        <span aria-hidden="true">{l === 3 ? '●' : l === 2 ? '◐' : l === 1 ? '○' : '·'}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">Indicative guide only. Snow, road and river conditions decide what is possible on the day.</p>
      </section>
    </>
  )
}

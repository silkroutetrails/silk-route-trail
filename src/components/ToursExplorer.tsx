'use client'
import { useMemo, useState } from 'react'
import { TourCard } from './Cards'
import { MONTH_LONG, type Tour } from '@/lib/types'

export function ToursExplorer({ tours, initialKind = 'all' }: { tours: Tour[]; initialKind?: 'all' | 'getaway' | 'expedition' }) {
  const [kind, setKind] = useState<'all' | 'getaway' | 'expedition'>(initialKind)
  const [dest, setDest] = useState('')
  const [month, setMonth] = useState('')
  const destinations = useMemo(
    () => Array.from(new Map(tours.filter((t) => t.destinationSlug).map((t) => [t.destinationSlug as string, t.destinationName as string]))),
    [tours],
  )
  const shown = tours.filter(
    (t) => (kind === 'all' || t.kind === kind) && (!dest || t.destinationSlug === dest) && (!month || t.months.includes(Number(month))),
  )
  return (
    <div>
      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-line bg-snow p-4">
        <div role="group" aria-label="Journey type" className="flex gap-2">
          {([['all', 'All'], ['getaway', 'Getaways'], ['expedition', 'Expeditions']] as const).map(([v, l]) => (
            <button
              key={v} type="button" aria-pressed={kind === v} onClick={() => setKind(v)}
              className={`btn !px-5 !py-2 ${kind === v ? 'btn-primary' : 'btn-ghost'}`}
            >{l}</button>
          ))}
        </div>
        <div>
          <label htmlFor="f-dest" className="label !mb-1 !text-xs">Destination</label>
          <select id="f-dest" className="field !py-2" value={dest} onChange={(e) => setDest(e.target.value)}>
            <option value="">All destinations</option>
            {destinations.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="f-month" className="label !mb-1 !text-xs">Travel month</label>
          <select id="f-month" className="field !py-2" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Any month</option>
            {MONTH_LONG.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted" aria-live="polite">{shown.length} {shown.length === 1 ? 'journey' : 'journeys'}</p>
      {shown.length ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((t) => <TourCard key={t.slug} t={t} />)}</div>
      ) : (
        <p className="mt-8 rounded-2xl bg-snow p-8 text-center text-muted">Nothing matches those filters. Try another month, or <a className="font-semibold text-teal underline" href="/plan-your-trip">tell us what you are after</a>.</p>
      )}
    </div>
  )
}

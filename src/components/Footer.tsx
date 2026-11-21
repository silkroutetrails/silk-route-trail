import Link from 'next/link'
import { Wordmark } from './Logo'
import type { Settings } from '@/lib/types'

export function Footer({ s }: { s: Settings }) {
  const social = [
    { label: 'Instagram', href: s.instagram },
    { label: 'Facebook', href: s.facebook },
    { label: 'YouTube', href: s.youtube },
  ].filter((x) => x.href)
  return (
    <footer className="mt-24 bg-night text-snow/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Wordmark dark />
          <p className="mt-4 max-w-sm text-sm">
            Adventure and heritage journeys in Gilgit-Baltistan and Chitral, for Pakistani and international travellers.
          </p>
          {s.licences.length > 0 && (
            <ul className="mt-5 space-y-1 text-xs text-snow/70">
              {s.licences.map((l) => (
                <li key={l.label}>
                  {l.label}: <span className="font-semibold text-snow">{l.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-amber">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ['/destinations', 'Destinations'],
              ['/tours', 'Tours & Expeditions'],
              ['/gallery', 'Gallery'],
              ['/seasonal-calendar', 'Seasonal calendar'],
              ['/permits-and-requirements', 'Permits & requirements'],
              ['/corporate-retreats', 'Corporate retreats'],
              ['/faqs', 'FAQs'],
            ].map(([h, l]) => (
              <li key={h}><Link href={h} className="hover:text-amber">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-amber">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s.contactEmail && <li><a className="hover:text-amber" href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a></li>}
            {s.phone && <li>{s.phone}</li>}
            {s.officeAddress && <li className="whitespace-pre-line">{s.officeAddress}</li>}
            <li><Link href="/contact" className="hover:text-amber">Send an enquiry</Link></li>
            <li><Link href="/plan-your-trip" className="hover:text-amber">Plan your trip</Link></li>
            {social.map((x) => (
              <li key={x.label}><a href={x.href} className="hover:text-amber" rel="noopener noreferrer" target="_blank">{x.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-snow/60">
        &copy; {new Date().getFullYear()} Silk Route Trails. All rights reserved.
      </div>
    </footer>
  )
}

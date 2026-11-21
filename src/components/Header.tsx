'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Wordmark } from './Logo'

const NAV = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/tours', label: 'Tours & Expeditions' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/seasonal-calendar', label: 'Seasons' },
  { href: '/permits-and-requirements', label: 'Permits' },
  { href: '/corporate-retreats', label: 'Corporate' },
  { href: '/about', label: 'About' },
  { href: '/faqs', label: 'FAQs' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="Silk Route Trails home" onClick={() => setOpen(false)}>
          <Wordmark dark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-5 xl:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-semibold text-snow/85 hover:text-amber">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/plan-your-trip" className="btn btn-amber hidden sm:inline-flex">
            Plan your trip
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-snow xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/10 bg-night xl:hidden">
          <div className="container-x flex flex-col py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-white/5 py-3 text-base font-semibold text-snow">
                {n.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="py-3 text-base font-semibold text-snow">
              Contact
            </Link>
            <Link href="/plan-your-trip" onClick={() => setOpen(false)} className="btn btn-amber mt-3">
              Plan your trip
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Silk Route Trails mark">
      <path d="M8 78 L34 40 L50 62 L74 26 L100 66 L112 66" fill="none" stroke="#2BB3A3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="94" cy="28" r="6" fill="#F2B544" />
      <path d="M8 100 C28 88 46 112 68 100 S98 90 112 100" fill="none" stroke="#F2B544" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 10" />
    </svg>
  )
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="flex flex-col leading-[0.95]">
        <span className={`font-display text-xl font-light ${dark ? 'text-snow' : 'text-night'}`}>silk route</span>
        <span className="font-display text-xl font-semibold text-teal-bright">trails</span>
      </span>
    </span>
  )
}

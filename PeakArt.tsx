/**
 * Generated mountain ridgelines used wherever a photo has not been uploaded yet.
 * Deterministic per `seed`, so the same journey always gets the same picture.
 */
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function ridge(rand: () => number, base: number, amp: number, width: number) {
  const n = 64
  let pts = [base + (rand() - 0.5) * amp, base + (rand() - 0.5) * amp]
  let rough = amp
  while (pts.length < n + 1) {
    const next: number[] = []
    for (let i = 0; i < pts.length - 1; i++) {
      next.push(pts[i], (pts[i] + pts[i + 1]) / 2 + (rand() - 0.5) * rough)
    }
    next.push(pts[pts.length - 1])
    pts = next
    rough *= 0.52
  }
  const step = width / (pts.length - 1)
  const d = pts.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return `${d} L${width} 400 L0 400 Z`
}

export function PeakArt({ seed, className = '' }: { seed: string; className?: string }) {
  const rand = rng(hash(seed))
  const hue = 195 + Math.floor(rand() * 30)
  const layers = [
    { y: 150, amp: 150, fill: `hsl(${hue} 35% 38%)`, o: 0.55 },
    { y: 215, amp: 120, fill: `hsl(${hue} 40% 26%)`, o: 0.8 },
    { y: 290, amp: 70, fill: `hsl(${hue + 10} 45% 16%)`, o: 1 },
  ]
  const sunX = 80 + rand() * 640
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${hash(seed)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#101A2E" />
          <stop offset="0.7" stopColor={`hsl(${hue} 45% 45%)`} />
          <stop offset="1" stopColor="#F2B544" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill={`url(#sky-${hash(seed)})`} />
      <circle cx={sunX} cy={96} r={22} fill="#F2B544" opacity="0.9" />
      {layers.map((l, i) => (
        <path key={i} d={ridge(rand, l.y, l.amp, 800)} fill={l.fill} opacity={l.o} />
      ))}
    </svg>
  )
}

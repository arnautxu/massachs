import { useRef } from 'react'
import { useElementScrollProgress } from '@/hooks/useScrollProgress'

interface ScrollMarqueeProps {
  text: string
  /** number of repetitions in the band (so the line is wide enough to translate) */
  repeats?: number
  /** translate-X range driven by scroll, in viewport-width units. e.g. 0.6 = ±60vw */
  range?: number
  className?: string
  tone?: 'light' | 'dark' | 'mid'
  bgClass?: 'section--light' | 'section--mid' | 'section--dark'
}

/**
 * A massive horizontal text band that translates based on the section's
 * vertical scroll position through the viewport.
 */
export function ScrollMarquee({
  text,
  repeats = 4,
  range = 0.6,
  className,
  bgClass = 'section--light',
}: ScrollMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const p = useElementScrollProgress(ref) // -1 → 1
  const translatePct = -p * range * 100 // in vw
  const items = Array.from({ length: repeats }, (_, i) => i)

  return (
    <div
      ref={ref}
      className={`scroll-marquee ${bgClass} ${className ?? ''}`}
      aria-hidden="true"
    >
      <div
        className="scroll-marquee-track"
        style={{ transform: `translate3d(${translatePct}vw, 0, 0)` }}
      >
        {items.map((i) => (
          <span key={i} className="scroll-marquee-item t-display-xl">
            {text}
            <span className="scroll-marquee-dot" aria-hidden="true">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * A continuously auto-scrolling marquee (CSS keyframe).
 * Used for the hero ticker and contact footer band.
 */
export function AutoMarquee({
  items,
  speed = 'slow',
  tone = 'inherit',
  className,
}: {
  items: string[]
  speed?: 'slow' | 'mid' | 'fast'
  tone?: 'inherit' | 'muted'
  className?: string
}) {
  const dur = speed === 'slow' ? '60s' : speed === 'mid' ? '36s' : '20s'
  // Repeat the items so the loop is seamless
  const repeated = [...items, ...items, ...items, ...items]
  return (
    <div
      className={`auto-marquee ${className ?? ''}`}
      aria-hidden="true"
      style={{ ['--marquee-dur' as never]: dur }}
    >
      <div className="auto-marquee-track">
        {repeated.map((it, i) => (
          <span
            key={i}
            className="t-micro auto-marquee-item"
            style={{ opacity: tone === 'muted' ? 0.5 : 1 }}
          >
            <span aria-hidden="true" style={{ marginRight: 14, opacity: 0.55 }}>—</span>
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}

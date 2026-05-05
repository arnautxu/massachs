import { useEffect, useRef } from 'react'

interface ScrollMarqueeProps {
  text: string
  repeats?: number
  /** translate-X range in vw units driven by element scroll position */
  range?: number
  className?: string
  bgClass?: 'section--light' | 'section--mid' | 'section--dark'
}

/**
 * Scroll-driven horizontal marquee. Uses a RAF loop + lerp to bypass React
 * state — no re-renders on scroll, silky direct style mutation.
 */
export function ScrollMarquee({
  text,
  repeats = 4,
  range = 0.6,
  className,
  bgClass = 'section--light',
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const items = Array.from({ length: repeats }, (_, i) => i)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    let current = 0    // lerped position (vw equivalent)
    let target = 0     // raw computed position
    let rafId: number

    const computeTarget = () => {
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const mid = rect.top + rect.height / 2
      const norm = Math.max(-1, Math.min(1, (mid - vh / 2) / (vh / 2 + rect.height / 2)))
      return -norm * range * 100   // vw
    }

    const tick = () => {
      target = computeTarget()
      current += (target - current) * 0.072   // lerp — controls inertia drag
      track.style.transform = `translate3d(${current}vw, 0, 0)`
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [range])

  return (
    <div
      ref={containerRef}
      className={`scroll-marquee ${bgClass} ${className ?? ''}`}
      aria-hidden="true"
    >
      <div ref={trackRef} className="scroll-marquee-track">
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
 * Continuously auto-scrolling marquee (CSS keyframe, already smooth).
 * Used for the contact footer band.
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

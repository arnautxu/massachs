import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section IDs is currently most prominent in the viewport.
 * Returns the ID, or null while above the first section.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const compute = () => {
      const vh = window.innerHeight || 1
      const center = vh * 0.4
      let best: { id: string; dist: number } | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > vh) continue
        const sectionCenter = rect.top + rect.height / 2
        const dist = Math.abs(sectionCenter - center)
        if (!best || dist < best.dist) best = { id, dist }
      }
      setActive(best?.id ?? null)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ids])
  return active
}

import { useEffect, useState } from 'react'

/**
 * Returns scroll progress 0..1 of the document (whole-page).
 */
export function useDocumentScrollProgress(): number {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return p
}

/**
 * Returns -1..1 progress of an element through the viewport.
 * 0 means centered, -1 means just entering, 1 means just leaving.
 */
export function useElementScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [p, setP] = useState(0)
  useEffect(() => {
    const update = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const center = rect.top + rect.height / 2
      const norm = (center - vh / 2) / (vh / 2 + rect.height / 2)
      setP(Math.max(-1, Math.min(1, norm)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])
  return p
}

import { useEffect, useRef, useState } from 'react'

export interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Observes an element and reports whether it has entered the viewport.
 * `once: true` (default) freezes the value at `true` after first reveal.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {},
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}

import { useEffect, useState } from 'react'

/**
 * Animates a number from 0 to `target` once `active` becomes true.
 * Uses requestAnimationFrame; respects prefers-reduced-motion (snaps).
 */
export function useCountUp(target: number, active: boolean, duration = 1400): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out-quart
      const eased = 1 - Math.pow(1 - t, 4)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])

  return value
}

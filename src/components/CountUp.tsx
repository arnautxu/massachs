import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'

interface Props {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  format?: (n: number) => string
  className?: string
  style?: React.CSSProperties
  decimals?: number
}

export default function CountUp({
  value,
  duration = 1400,
  suffix = '',
  prefix = '',
  format,
  className,
  style,
  decimals = 0,
}: Props) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const v = useCountUp(value, inView, duration)
  const display = format ? format(v) : v.toFixed(decimals)
  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{display}{suffix}
    </span>
  )
}

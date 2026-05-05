import { useDocumentScrollProgress } from '@/hooks/useScrollProgress'

export default function ProgressBar() {
  const p = useDocumentScrollProgress()
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'transparent',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${p * 100}%`,
          background: 'var(--color-accent)',
          transition: 'width 80ms linear',
        }}
      />
    </div>
  )
}

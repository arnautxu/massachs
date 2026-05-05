import { useActiveSection } from '@/hooks/useActiveSection'

const SECTIONS = [
  { id: 'hero',    label: 'Inici' },
  { id: 'lab',     label: 'Mostra' },
  { id: 'tech',    label: 'Dades' },
  { id: 'story',   label: 'Història' },
  { id: 'contact', label: 'Contacte' },
] as const

export default function SectionNav() {
  const active = useActiveSection(SECTIONS.map((s) => s.id))

  return (
    <nav
      aria-label="Navegació de secció"
      className="section-nav"
      style={{
        position: 'fixed',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '12px 8px',
        pointerEvents: 'none',
        opacity: active && active !== 'hero' ? 1 : 0,
        transition: 'opacity 280ms var(--ease-out)',
      }}
    >
      {SECTIONS.map((s, i) => {
        const isActive = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Anar a ${s.label}`}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: 'currentColor',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <span
              className="t-micro t-mono-num"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateX(0)' : 'translateX(8px)',
                transition: 'opacity 240ms var(--ease-out), transform 240ms var(--ease-out)',
                fontSize: '0.65rem',
              }}
            >
              {String(i + 1).padStart(2, '0')} · {s.label}
            </span>
            <span
              aria-hidden="true"
              style={{
                width: isActive ? 26 : 14,
                height: 1,
                background: 'currentColor',
                opacity: isActive ? 1 : 0.35,
                transition: 'width 240ms var(--ease-out), opacity 240ms var(--ease-out)',
              }}
            />
          </a>
        )
      })}
    </nav>
  )
}

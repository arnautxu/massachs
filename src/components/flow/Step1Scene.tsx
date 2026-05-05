import { useConfiguratorStore } from '@/stores/configuratorStore'
import { SCENES } from '@/types/scene'
import type { SceneId } from '@/types/product'

/* ── Scene icons ─────────────────────────────────────────────────────────── */
function SceneIcon({ id }: { id: SceneId }) {
  const s = 'rgba(255,255,255,0.75)'
  const f = 'rgba(255,255,255,0.75)'
  const sw = 1.5

  switch (id) {
    case 'vorera-urbana':
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
          {/* Two buildings */}
          <rect x="2" y="6" width="8" height="28" rx="0.5" />
          <rect x="30" y="6" width="8" height="28" rx="0.5" />
          {/* Windows */}
          <rect x="3.5" y="9" width="2" height="3" fill={f} stroke="none" opacity="0.5" />
          <rect x="6.5" y="9" width="2" height="3" fill={f} stroke="none" opacity="0.5" />
          <rect x="3.5" y="15" width="2" height="3" fill={f} stroke="none" opacity="0.5" />
          <rect x="6.5" y="15" width="2" height="3" fill={f} stroke="none" opacity="0.5" />
          <rect x="31.5" y="9" width="2" height="3" fill={f} stroke="none" opacity="0.5" />
          <rect x="34.5" y="9" width="2" height="3" fill={f} stroke="none" opacity="0.5" />
          {/* Pavement strip */}
          <rect x="12" y="30" width="16" height="3" rx="0.5" fill={f} stroke="none" opacity="0.6" />
          {/* Person */}
          <circle cx="20" cy="20" r="2" fill={f} stroke="none" />
          <line x1="20" y1="22" x2="20" y2="28" />
          <line x1="17" y1="25" x2="23" y2="25" />
        </svg>
      )

    case 'placa-publica':
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
          {/* Plaza perimeter */}
          <rect x="4" y="4" width="32" height="32" rx="1" />
          {/* Pavement tiles */}
          <line x1="4" y1="20" x2="36" y2="20" opacity="0.5" />
          <line x1="20" y1="4" x2="20" y2="36" opacity="0.5" />
          {/* Tree/fountain in center */}
          <circle cx="20" cy="20" r="4" />
          <circle cx="20" cy="20" r="1.5" fill={f} stroke="none" />
          {/* Corner benches */}
          <rect x="6" y="6" width="4" height="1.5" rx="0.5" fill={f} stroke="none" opacity="0.5" />
          <rect x="30" y="6" width="4" height="1.5" rx="0.5" fill={f} stroke="none" opacity="0.5" />
        </svg>
      )

    case 'parc-cami':
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
          {/* Winding path */}
          <path d="M4 36 C8 28 14 30 18 24 C22 18 28 20 34 8" />
          {/* Trees */}
          <circle cx="10" cy="16" r="5" />
          <line x1="10" y1="21" x2="10" y2="32" />
          <circle cx="30" cy="26" r="4" />
          <line x1="30" y1="30" x2="30" y2="36" />
        </svg>
      )

    case 'pati-escolar':
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
          {/* Outer perimeter */}
          <rect x="4" y="4" width="32" height="32" rx="1" />
          {/* Center lines (court markings) */}
          <line x1="4" y1="20" x2="36" y2="20" strokeDasharray="2.5 2" />
          {/* Center circle */}
          <circle cx="20" cy="20" r="5" />
          {/* Goal areas */}
          <rect x="14" y="4" width="12" height="5" rx="0.5" opacity="0.6" />
          <rect x="14" y="31" width="12" height="5" rx="0.5" opacity="0.6" />
        </svg>
      )

    case 'acces-rodat':
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
          {/* Road tracks */}
          <line x1="12" y1="4" x2="12" y2="36" />
          <line x1="28" y1="4" x2="28" y2="36" />
          {/* Center dashes */}
          <line x1="20" y1="6" x2="20" y2="11" strokeDasharray="0" />
          <line x1="20" y1="15" x2="20" y2="20" strokeDasharray="0" />
          <line x1="20" y1="24" x2="20" y2="29" strokeDasharray="0" />
          <line x1="20" y1="33" x2="20" y2="36" strokeDasharray="0" />
          {/* Car silhouette */}
          <rect x="13.5" y="17" width="13" height="8" rx="1" />
          <rect x="16" y="15" width="8" height="3" rx="0.5" />
          <circle cx="16" cy="25.5" r="1.5" fill={f} stroke="none" />
          <circle cx="24" cy="25.5" r="1.5" fill={f} stroke="none" />
        </svg>
      )

    case 'jardi-privat':
      return (
        <svg viewBox="0 0 40 40" fill="none" stroke={s} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
          {/* Hedge/fence perimeter */}
          <rect x="4" y="4" width="32" height="32" rx="2" strokeDasharray="3 2" />
          {/* Plant clusters */}
          <circle cx="12" cy="12" r="5" />
          <circle cx="22" cy="10" r="4" />
          <circle cx="30" cy="18" r="5" />
          <circle cx="16" cy="24" r="4" />
          {/* Garden path */}
          <path d="M4 36 C10 30 18 32 24 28 C30 24 34 26 36 20" opacity="0.8" />
        </svg>
      )

    default:
      return null
  }
}

/* ── Scene card ──────────────────────────────────────────────────────────── */
function SceneCard({ scene }: { scene: typeof SCENES[number] }) {
  const selectScene = useConfiguratorStore((s) => s.selectScene)

  return (
    <button
      onClick={() => selectScene(scene.id)}
      aria-label={`Seleccionar: ${scene.label}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
        padding: 0,
        transition: 'border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out), transform 200ms var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--color-accent)'
        el.style.boxShadow = 'var(--shadow-lg)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--color-border)'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
    >
      {/* Preview area */}
      <div
        style={{
          height: 140,
          background: scene.previewBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* Subtle radial vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 100%)',
          }}
        />
        <div style={{ width: 72, height: 72, position: 'relative', zIndex: 1 }}>
          <SceneIcon id={scene.id} />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 20px 20px' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: 'var(--color-text)',
            marginBottom: 4,
          }}
        >
          {scene.label}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
          }}
        >
          {scene.description}
        </p>
      </div>
    </button>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function Step1Scene() {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-8)',
        paddingTop: 'var(--space-12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-8)',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          On vols aplicar el paviment?
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}
        >
          Selecciona l'entorn per veure quins paviments naturals Massachs s'hi adapten millor.
        </p>
      </div>

      {/* Scene grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
          width: '100%',
          maxWidth: 900,
        }}
        role="list"
        aria-label="Escenes disponibles"
      >
        {SCENES.map((scene) => (
          <div key={scene.id} role="listitem">
            <SceneCard scene={scene} />
          </div>
        ))}
      </div>
    </div>
  )
}

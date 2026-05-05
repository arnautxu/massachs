import { Suspense, lazy, useState } from 'react'
import { useConfiguratorStore } from '@/stores/configuratorStore'

const DummyScene = lazy(() => import('@/components/three/DummyScene'))

const PRODUCT_COLORS: Record<string, string> = {
  'terra-solida': '#B8956A',
  'saulo-solid': '#C4A87A',
  'saulo-conglomerat': '#B8A882',
  'saulo-parc': '#C8B88E',
  'terrapref': '#A8906A',
}

function SceneLoader() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        backgroundColor: 'var(--color-surface-2)',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
      }}
      role="status"
      aria-label="Carregant escena 3D"
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Carregant escena...
    </div>
  )
}

export default function ConfiguratorPage() {
  const productId = useConfiguratorStore((s) => s.productId)
  const step = useConfiguratorStore((s) => s.step)
  const setStep = useConfiguratorStore((s) => s.setStep)
  const setProductId = useConfiguratorStore((s) => s.setProductId)

  const [showScene] = useState(true)
  const activeColor = productId
    ? (PRODUCT_COLORS[productId] ?? '#C4A87A')
    : '#C4A87A'

  const products = [
    { id: 'terra-solida', label: 'Terra Sòlida' },
    { id: 'saulo-solid', label: 'Sauló Sòlid' },
    { id: 'saulo-conglomerat', label: 'Sauló Conglomerat' },
    { id: 'saulo-parc', label: 'Sauló Parc' },
    { id: 'terrapref', label: 'TerraPref' },
  ]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* ── Canvas 3D ── */}
      {showScene && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
          }}
        >
          <Suspense fallback={<SceneLoader />}>
            <DummyScene productColor={activeColor} />
          </Suspense>
        </div>
      )}

      {/* ── Header ── */}
      <header
        className="panel-glass"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10,
        }}
        role="banner"
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
          }}
          aria-label="Grup Massachs"
        >
          MASSACHS
        </div>

        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {productId
            ? products.find((p) => p.id === productId)?.label
            : 'Configurador de paviments'}
        </div>

        <nav aria-label="Passos del configurador">
          <ol
            style={{
              display: 'flex',
              gap: 8,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {[1, 2, 3, 4].map((s) => (
              <li key={s}>
                <button
                  onClick={() => setStep(s as 1 | 2 | 3 | 4)}
                  aria-current={step === s ? 'step' : undefined}
                  aria-label={`Pas ${s}`}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '1.5px solid',
                    borderColor:
                      step === s
                        ? 'var(--color-accent)'
                        : 'var(--color-border)',
                    backgroundColor:
                      step === s
                        ? 'var(--color-accent)'
                        : 'transparent',
                    color: step === s ? '#fff' : 'var(--color-text-muted)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: `background-color 200ms var(--ease-out), border-color 200ms var(--ease-out), color 200ms var(--ease-out)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {/* ── Left panel: product selector (demo for task 2) ── */}
      <aside
        className="panel-glass"
        style={{
          position: 'absolute',
          top: 72,
          left: 16,
          bottom: 72,
          width: 240,
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          zIndex: 10,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        aria-label="Selector de paviment"
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: 4,
          }}
        >
          Paviment
        </p>

        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => setProductId(p.id)}
            aria-pressed={productId === p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius)',
              border: '1.5px solid',
              borderColor:
                productId === p.id
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
              backgroundColor:
                productId === p.id
                  ? 'var(--color-accent-bg)'
                  : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: `all 200ms var(--ease-out)`,
            }}
          >
            {/* Color swatch */}
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: PRODUCT_COLORS[p.id],
                border: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: productId === p.id ? 500 : 400,
                color: productId === p.id
                  ? 'var(--color-text)'
                  : 'var(--color-text-2)',
              }}
            >
              {p.label}
            </span>
          </button>
        ))}

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 12,
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
          }}
        >
          Textura sintètica — placeholder fins a integrar KTX2
        </div>
      </aside>

      {/* ── Bottom bar ── */}
      <div
        className="panel-glass"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          zIndex: 10,
          padding: '0 24px',
        }}
        role="navigation"
        aria-label="Pas actual"
      >
        {[
          { num: 1, label: 'On l\'aplicaràs?' },
          { num: 2, label: 'Quin ús tindrà?' },
          { num: 3, label: 'Configura el paviment' },
          { num: 4, label: 'Resum i acció' },
        ].map(({ num, label }) => (
          <button
            key={num}
            onClick={() => setStep(num as 1 | 2 | 3 | 4)}
            aria-current={step === num ? 'step' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              transition: 'opacity 150ms',
              opacity: step === num ? 1 : 0.5,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.7rem',
                color: step === num ? 'var(--color-accent)' : 'var(--color-text-muted)',
                letterSpacing: '0.05em',
              }}
            >
              {num}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: step === num ? 'var(--color-text)' : 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

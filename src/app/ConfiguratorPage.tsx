import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useProducts } from '@/hooks/useProducts'
import { parseShareUrl } from '@/lib/products'
import { SCENES } from '@/types/scene'
import type { SceneId } from '@/types/product'
import Step1Scene from '@/components/flow/Step1Scene'
import Step2Product from '@/components/flow/Step2Product'
import Step3Viewer from '@/components/flow/Step3Viewer'
import Step4Form from '@/components/flow/Step4Form'

/* ── Header ──────────────────────────────────────────────────────────────── */
function ConfiguratorHeader() {
  const step = useConfiguratorStore((s) => s.step)
  const scene = useConfiguratorStore((s) => s.scene)
  const productId = useConfiguratorStore((s) => s.productId)
  const goToStep = useConfiguratorStore((s) => s.goToStep)
  const reset = useConfiguratorStore((s) => s.reset)

  const sceneDef = SCENES.find((sc) => sc.id === scene)

  const stepTitles: Record<number, string> = {
    1: 'Configurador de paviments',
    2: sceneDef ? sceneDef.label : 'Selecciona el paviment',
    3: productId ? '' : 'Visualització 3D',
    4: 'Sol·licitar mostra',
  }

  function handleBack() {
    if (step === 2) { reset(); goToStep(1) }
    else if (step === 3) goToStep(2)
    else if (step === 4) goToStep(3)
  }

  const showBack = step > 1

  return (
    <header
      className="panel-glass"
      style={{
        position: 'relative',
        zIndex: 20,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: 16,
        flexShrink: 0,
      }}
      role="banner"
    >
      {/* Left: back + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {showBack && (
          <button
            onClick={handleBack}
            aria-label="Tornar al pas anterior"
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              flexShrink: 0,
              transition: 'color 150ms, border-color 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-border-2)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          onClick={() => { reset(); goToStep(1) }}
          aria-label="Inici del configurador Massachs"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          MASSACHS
        </button>
      </div>

      {/* Center: step title */}
      <div
        style={{
          flex: 1,
          textAlign: 'center',
          overflow: 'hidden',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {stepTitles[step]}
        </p>
      </div>

      {/* Right: step indicators */}
      <nav aria-label="Passos del configurador" style={{ flexShrink: 0 }}>
        <ol
          style={{
            display: 'flex',
            gap: 6,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {([1, 2, 3, 4] as const).map((s) => {
            const isActive = step === s
            const isPast = step > s
            return (
              <li key={s}>
                <button
                  onClick={() => {
                    if (s < step) goToStep(s)
                  }}
                  disabled={s > step}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`Pas ${s}`}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    border: '1.5px solid',
                    borderColor: isActive
                      ? 'var(--color-accent)'
                      : isPast
                      ? 'var(--color-accent-3)'
                      : 'var(--color-border)',
                    backgroundColor: isActive
                      ? 'var(--color-accent)'
                      : isPast
                      ? 'transparent'
                      : 'transparent',
                    color: isActive
                      ? '#fff'
                      : isPast
                      ? 'var(--color-accent-3)'
                      : 'var(--color-text-muted)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: s < step ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 200ms var(--ease-out), border-color 200ms var(--ease-out), color 200ms var(--ease-out)',
                  }}
                >
                  {s}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </header>
  )
}

/* ── Products loader skeleton ─────────────────────────────────────────────── */
function ProductsSkeleton() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        gap: 12,
      }}
      role="status"
      aria-label="Carregant catàleg de productes"
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Carregant catàleg...
    </div>
  )
}

/* ── URL restoration ──────────────────────────────────────────────────────── */
function useUrlRestore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const restoreState = useConfiguratorStore((s) => s.restoreState)

  useEffect(() => {
    const parsed = parseShareUrl(searchParams)
    if (!parsed) return

    // Validate scene ID
    const validSceneIds = SCENES.map((sc) => sc.id)
    if (!validSceneIds.includes(parsed.scene as SceneId)) return

    if ('productId' in parsed) {
      restoreState({
        scene: parsed.scene as SceneId,
        productId: parsed.productId,
        finishIndex: parsed.finishIndex,
        granulometryIndex: parsed.granulometryIndex,
        step: 3,
      })
    } else {
      restoreState({
        scene: parsed.scene as SceneId,
        step: 2,
      })
    }

    // Clear params from URL after restoring (keeps URL clean)
    setSearchParams({}, { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function ConfiguratorPage() {
  useUrlRestore()

  const step = useConfiguratorStore((s) => s.step)
  const { products, loading } = useProducts()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <ConfiguratorHeader />

      {/* ── Step content ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          minHeight: 0,
        }}
        aria-label={`Pas ${step} de 4`}
      >
        {step === 1 && <Step1Scene />}

        {step === 2 && (
          loading ? <ProductsSkeleton /> : <Step2Product products={products} />
        )}

        {(step === 3 || step === 4) && (
          loading ? (
            <ProductsSkeleton />
          ) : (
            <>
              <Step3Viewer products={products} />
              {step === 4 && <Step4Form products={products} />}
            </>
          )
        )}
      </main>
    </div>
  )
}

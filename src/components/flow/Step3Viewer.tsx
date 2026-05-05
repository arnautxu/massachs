import { Suspense, lazy, useState } from 'react'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { SCENES } from '@/types/scene'
import { buildShareUrl } from '@/lib/products'
import type { Product } from '@/types/product'

const DummyScene = lazy(() => import('@/components/three/DummyScene'))

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
        gap: 16,
        backgroundColor: 'var(--color-surface-2)',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
      }}
      role="status"
      aria-label="Carregant escena 3D"
    >
      <div
        style={{
          width: 36,
          height: 36,
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

/* ── Share button ─────────────────────────────────────────────────────────── */
function ShareButton({
  scene,
  productId,
  finishIndex,
  granulometryIndex,
}: {
  scene: string
  productId: string
  finishIndex: number
  granulometryIndex: number
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = buildShareUrl({ scene, productId, finishIndex, granulometryIndex })
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      // Fallback: select the URL in a prompt
      window.prompt('Copia aquest URL per compartir:', url)
    })
  }

  return (
    <button
      onClick={handleShare}
      aria-label={copied ? 'URL copiada!' : 'Compartir configuració'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--color-border)',
        backgroundColor: copied ? 'var(--color-accent-bg)' : 'oklch(99% 0.004 72 / 0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: copied ? 'var(--color-accent)' : 'var(--color-text-2)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'background-color 200ms var(--ease-out), color 200ms var(--ease-out)',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7l3 3 7-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copiada!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 1H5a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V4L9 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 4H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Compartir
        </>
      )}
    </button>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function Step3Viewer({ products }: { products: Product[] }) {
  const scene = useConfiguratorStore((s) => s.scene)
  const productId = useConfiguratorStore((s) => s.productId)
  const finishIndex = useConfiguratorStore((s) => s.finishIndex)
  const granulometryIndex = useConfiguratorStore((s) => s.granulometryIndex)
  const goToStep = useConfiguratorStore((s) => s.goToStep)

  const selectedProduct = products.find((p) => p.id === productId)
  const sceneDef = SCENES.find((sc) => sc.id === scene)
  const colorHex = selectedProduct?.colors[0]?.hex_approx ?? '#C4A87A'

  const finishes = selectedProduct?.finishes ?? []
  const granulos = (selectedProduct?.granulometries ?? []).filter(
    (g) => !g._pending && g.size !== '_pending',
  )

  const selectedFinish = finishes[finishIndex]
  const selectedGranulo = granulos.length > 0 ? granulos[granulometryIndex] : null

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      {/* ── 3D Canvas ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={<SceneLoader />}>
          <DummyScene productColor={colorHex} />
        </Suspense>
      </div>

      {/* ── Left info panel ── */}
      <aside
        className="panel-glass"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          bottom: 16,
          width: 240,
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflowY: 'auto',
        }}
        aria-label="Informació del paviment seleccionat"
      >
        {/* Scene context */}
        {sceneDef && (
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: 2,
              }}
            >
              Escena
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-2)' }}>
              {sceneDef.label}
            </p>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        {/* Product info */}
        {selectedProduct ? (
          <>
            {/* Color swatch + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: colorHex,
                  border: '1px solid var(--color-border)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text)',
                    lineHeight: 1.1,
                  }}
                >
                  {selectedProduct.brand}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {selectedProduct.colors[0]?.name}
                </p>
              </div>
            </div>

            {/* Finish */}
            {selectedFinish && (
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginBottom: 3,
                  }}
                >
                  Acabat
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-2)', lineHeight: 1.4 }}>
                  {selectedFinish.name}
                </p>
              </div>
            )}

            {/* Granulometry */}
            {selectedGranulo && (
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    marginBottom: 3,
                  }}
                >
                  Granulometria
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-2)' }}>
                  {selectedGranulo.size}
                </p>
              </div>
            )}

            {/* Tech note */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {selectedProduct.technical.eco}
              </p>
            </div>
          </>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Cap producte seleccionat
          </p>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Share */}
          {scene && productId && (
            <ShareButton
              scene={scene}
              productId={productId}
              finishIndex={finishIndex}
              granulometryIndex={granulometryIndex}
            />
          )}

          {/* Back */}
          <button
            onClick={() => goToStep(2)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'color 150ms',
            }}
            aria-label="Tornar a la selecció de producte"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Canviar producte
          </button>
        </div>
      </aside>

      {/* ── Bottom-right CTA ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => goToStep(4)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 28px',
            borderRadius: 'var(--radius)',
            border: 'none',
            backgroundColor: 'var(--color-accent)',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-lg)',
            transition: 'transform 160ms var(--ease-out)',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          aria-label="Sol·licitar mostra de paviment"
        >
          Sol·licitar mostra
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Texture note ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 272,
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.55)',
            fontStyle: 'italic',
          }}
        >
          Textura sintètica — representació aproximada
        </p>
      </div>
    </div>
  )
}

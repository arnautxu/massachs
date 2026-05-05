import { Suspense, lazy, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import type { Product } from '@/types/product'

interface FlipProps {
  children: React.ReactNode
  flipKey: string | number
}
function Flip({ children, flipKey }: FlipProps) {
  return (
    <span key={flipKey} className="spec-flip">
      {children}
    </span>
  )
}

const PavementViewer = lazy(() => import('@/components/three/PavementViewer'))

function ViewerFallback() {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'oklch(88% 0.012 72)',
      }}
      role="status"
      aria-label="Carregant visor 3D"
    >
      <span className="t-micro text-muted-light">Carregant visor</span>
    </div>
  )
}

interface Props {
  products: Product[]
}

export default function MaterialLab({ products }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 })
  const [activeId, setActiveId] = useState<string | null>(products[0]?.id ?? null)

  const active = products.find((p) => p.id === activeId) ?? products[0]
  const colorHex = active?.colors[0]?.hex_approx ?? '#C4A87A'

  return (
    <section
      id="lab"
      ref={ref}
      className="section section--light"
      data-reveal
      data-revealed={inView}
      aria-label="Mostra interactiva de paviments"
    >
      {/* Section opener */}
      <div style={{ marginBottom: 64, display: 'grid', gap: 12 }}>
        <span className="t-micro text-muted-light">— Mostra interactiva</span>
        <h2 className="t-display-l" style={{ maxWidth: '14ch' }}>
          Toca el material<br />
          <span className="text-accent">abans de l'obra.</span>
        </h2>
        <p className="t-body text-muted-light" style={{ maxWidth: '60ch', marginTop: 8 }}>
          Cinc compostos diferents, cinc cromes, cinc usos. Selecciona'n un per
          veure'n la textura simulada en temps real i les dades tècniques.
        </p>
      </div>

      {/* Lab grid */}
      <div className="lab-grid">
        {/* Product list */}
        <div className="lab-list" role="listbox" aria-label="Llista de productes">
          {products.map((p, i) => (
            <button
              key={p.id}
              role="option"
              aria-selected={activeId === p.id}
              data-active={activeId === p.id}
              className="product-line"
              onClick={() => setActiveId(p.id)}
              onMouseEnter={() => setActiveId(p.id)}
            >
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="t-display-l" style={{ flex: 1, textAlign: 'left', fontSize: 'clamp(1.4rem, 3.6vw, 3.2rem)' }}>
                {p.brand}
              </span>
            </button>
          ))}
        </div>

        {/* 3D viewer */}
        <div className="lab-canvas">
          <div className="lab-canvas-inner">
            <Suspense fallback={<ViewerFallback />}>
              <PavementViewer colorHex={colorHex} />
            </Suspense>
            <div className="lab-corner-badge t-micro">3D · Drag</div>
            <div className="viewer-hint">
              <span className="viewer-hint-dot" aria-hidden="true" />
              <span className="t-micro" style={{ fontSize: '0.65rem' }}>Drag per orbitar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active product details strip */}
      {active && (
        <div className="lab-detail">
          <hr className="hr-light" />
          <div className="lab-detail-grid">
            <div>
              <div className="t-micro text-muted-light" style={{ marginBottom: 6 }}>Color · Acabat</div>
              <div className="t-body" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 14, height: 14,
                    background: colorHex,
                    border: '1px solid var(--line-on-light)',
                    flexShrink: 0,
                    transition: 'background 360ms var(--ease-out)',
                  }}
                />
                <Flip flipKey={active.id + ':color'}>
                  <span>
                    {active.colors[0]?.name}
                    {active.finishes[0] && ` · ${active.finishes[0].name}`}
                  </span>
                </Flip>
              </div>
            </div>

            <div>
              <div className="t-micro text-muted-light" style={{ marginBottom: 6 }}>Granulometria</div>
              <div className="t-body t-mono-num">
                <Flip flipKey={active.id + ':gran'}>
                  {(active.granulometries.filter((g) => !g._pending && g.size !== '_pending')[0]?.size) || '—'}
                </Flip>
              </div>
            </div>

            <div>
              <div className="t-micro text-muted-light" style={{ marginBottom: 6 }}>Drenatge</div>
              <div className="t-body">
                <Flip flipKey={active.id + ':drain'}>
                  {typeof active.technical.drainage === 'string'
                    ? active.technical.drainage.split('.')[0]
                    : '—'}
                </Flip>
              </div>
            </div>

            <div className="lab-diff">
              <div className="t-micro text-muted-light" style={{ marginBottom: 6 }}>Diferencial</div>
              <div className="t-body">
                <Flip flipKey={active.id + ':diff'}>
                  {active.key_differentiator}
                </Flip>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .lab-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 48px;
          align-items: stretch;
        }
        .lab-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--line-on-light);
        }
        .lab-canvas {
          position: relative;
          min-height: 480px;
        }
        .lab-canvas-inner {
          position: sticky;
          top: 24px;
          width: 100%;
          aspect-ratio: 4/5;
          background: oklch(88% 0.012 72);
          border: 1px solid var(--line-on-light);
          overflow: hidden;
        }
        .lab-corner-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: var(--color-bg-light);
          padding: 6px 10px;
          color: var(--color-text-light-2);
          border: 1px solid var(--line-on-light);
        }
        .lab-detail {
          margin-top: 56px;
        }
        .lab-detail-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          padding-top: 24px;
        }
        .lab-diff { grid-column: span 1; }

        @media (max-width: 900px) {
          .lab-grid { grid-template-columns: 1fr; gap: 28px; }
          .lab-canvas-inner { aspect-ratio: 1/1; position: relative; top: auto; }
          .lab-detail-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .lab-diff { grid-column: span 2; }
        }
        @media (max-width: 520px) {
          .lab-detail-grid { grid-template-columns: 1fr; }
          .lab-diff { grid-column: span 1; }
        }
      `}</style>
    </section>
  )
}

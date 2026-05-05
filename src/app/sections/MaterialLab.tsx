import { Suspense, lazy, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import type { Product } from '@/types/product'

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

function fmtDrainage(d: Product['technical']['drainage']): string {
  if (!d || d === '_pending') return '—'
  return typeof d === 'string' ? d.split('.')[0].trim() : '—'
}

function fmtSlope(s: Product['technical']['max_slope_pct']): string {
  if (!s || s === '_pending') return '—'
  return typeof s === 'number' ? `${s}%` : String(s)
}

function fmtCerts(c: string[]): string {
  const real = c.filter((x) => x !== '_pending')
  return real.length ? real.join(' · ') : '—'
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="t-micro text-muted-light" style={{ marginBottom: 6 }}>{label}</div>
      <div className="t-body t-mono-num" style={{ fontSize: '0.88rem' }}>{value}</div>
    </div>
  )
}

export default function MaterialLab({ products }: Props) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 })
  const [activeId, setActiveId] = useState<string>(products[0]?.id ?? '')

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
      {/* Section opener — Ogilvy: specific origin + concrete offer */}
      <div style={{ marginBottom: 64, display: 'grid', gap: 12 }}>
        <span className="t-micro text-muted-light">— Mostra interactiva</span>
        <h2 className="t-display-l" style={{ maxWidth: '18ch' }}>
          Cinc fórmules.<br />
          <span className="text-accent">Un sol origen.</span>
        </h2>
        <p className="t-body text-muted-light" style={{ maxWidth: '58ch', marginTop: 8 }}>
          Sauló de la pedrera Mas Patxot, la Garrotxa. La mateixa terra processada
          de cinc maneres: més sòlida, més drenant, més resistent al trànsit pesat.
          Selecciona un producte, veu-ne la textura en 3D i comprova les dades tècniques.
          Mostres físiques disponibles per a estudis d'arquitectura i ajuntaments.
        </p>
      </div>

      {/* Lab grid: accordion left, viewer right */}
      <div className="lab-grid">
        {/* Accordion product list */}
        <div className="lab-list" role="listbox" aria-label="Productes">
          {products.map((p, i) => {
            const isOpen = activeId === p.id
            return (
              <div key={p.id} className="accordion-item">
                <button
                  role="option"
                  aria-selected={isOpen}
                  aria-expanded={isOpen}
                  data-active={isOpen}
                  className="accordion-trigger"
                  onClick={() => setActiveId(p.id)}
                >
                  <span className="accordion-num t-mono-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="accordion-name t-display-l">
                    {p.brand}
                  </span>
                  <span className="accordion-indicator" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {/* Expandable body: grid-template-rows trick for smooth height */}
                <div className="accordion-body" data-open={isOpen}>
                  <div className="accordion-body-inner">
                    <div className="accordion-content">

                      {/* Lead — what it is and why it matters */}
                      <p className="t-body text-muted-light" style={{ maxWidth: '52ch' }}>
                        {p.short_description}
                      </p>

                      {/* 3 key specs */}
                      <div className="accordion-specs">
                        <SpecCell label="Drenatge" value={fmtDrainage(p.technical.drainage)} />
                        <SpecCell label="Pendent màx." value={fmtSlope(p.technical.max_slope_pct)} />
                        <SpecCell label="Certificació" value={fmtCerts(p.technical.certifications)} />
                      </div>

                      {/* Application tags */}
                      <div className="app-tags">
                        {p.applications.slice(0, 5).map((a) => (
                          <span key={a} className="app-tag t-micro">{a}</span>
                        ))}
                      </div>

                      {/* Differentiator — the USP */}
                      <div className="accordion-diff">
                        <span className="t-micro text-muted-light" style={{ display: 'block', marginBottom: 6 }}>
                          Per què aquest material
                        </span>
                        <p className="t-body" style={{ color: 'var(--color-accent)', maxWidth: '52ch' }}>
                          {p.key_differentiator}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sticky 3D viewer */}
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

      <style>{`
        /* ─── Grid ───────────────────────────────────────────────── */
        .lab-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 56px;
          align-items: start;
        }
        .lab-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--line-on-light);
        }

        /* ─── Accordion item ─────────────────────────────────────── */
        .accordion-item {
          border-bottom: 1px solid var(--line-on-light);
        }

        /* trigger row */
        .accordion-trigger {
          display: flex;
          align-items: baseline;
          gap: 16px;
          width: 100%;
          padding-block: 18px;
          cursor: pointer;
          text-align: left;
          color: var(--color-text-light-2);
          transition: color 200ms var(--ease-out);
        }
        .accordion-trigger:hover { color: var(--color-text-light); }
        .accordion-trigger[data-active="true"] { color: var(--color-text-light); }

        .accordion-num {
          flex-shrink: 0;
          font-family: var(--font-body);
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          font-weight: 600;
          align-self: flex-start;
          margin-top: 0.6em;
          color: inherit;
        }
        .accordion-name {
          flex: 1;
          font-size: clamp(1.4rem, 3.6vw, 3.2rem);
          line-height: 1;
          transition: color 200ms var(--ease-out);
        }
        .accordion-trigger[data-active="true"] .accordion-name {
          color: var(--color-accent);
        }
        .accordion-indicator {
          font-family: var(--font-body);
          font-size: 1.3rem;
          font-weight: 300;
          flex-shrink: 0;
          line-height: 1;
          align-self: center;
          transition: color 200ms var(--ease-out);
        }
        .accordion-trigger[data-active="true"] .accordion-indicator {
          color: var(--color-accent);
        }

        /* ─── Accordion body — smooth height via grid-template-rows ─ */
        .accordion-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 420ms var(--ease-out);
        }
        .accordion-body[data-open="true"] {
          grid-template-rows: 1fr;
        }
        .accordion-body-inner {
          overflow: hidden;
        }
        .accordion-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 28px;
          padding-right: 24px;
        }

        /* ─── Specs row ──────────────────────────────────────────── */
        .accordion-specs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--line-on-light);
        }

        /* ─── Application tags ───────────────────────────────────── */
        .app-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .app-tag {
          padding: 5px 10px;
          border: 1px solid var(--line-on-light);
          font-size: 0.63rem;
          color: var(--color-text-light-2);
          letter-spacing: 0.10em;
        }

        /* ─── Differentiator block ───────────────────────────────── */
        .accordion-diff {
          padding-top: 16px;
          border-top: 1px solid var(--line-on-light);
        }

        /* ─── 3D Viewer ──────────────────────────────────────────── */
        .lab-canvas { position: relative; }
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

        /* ─── Responsive ─────────────────────────────────────────── */
        @media (max-width: 900px) {
          .lab-grid { grid-template-columns: 1fr; gap: 32px; }
          .lab-canvas-inner { aspect-ratio: 1/1; position: relative; top: auto; }
          .accordion-content { padding-right: 0; }
        }
        @media (max-width: 520px) {
          .accordion-specs { grid-template-columns: 1fr 1fr; }
          .accordion-name { font-size: clamp(1.3rem, 6vw, 2rem); }
        }
      `}</style>
    </section>
  )
}

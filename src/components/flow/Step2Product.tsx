import { useConfiguratorStore } from '@/stores/configuratorStore'
import { SCENES } from '@/types/scene'
import type { Product } from '@/types/product'

/* ── Selector button ─────────────────────────────────────────────────────── */
function SelectorBtn({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      style={{
        padding: '6px 14px',
        borderRadius: 'var(--radius)',
        border: '1.5px solid',
        borderColor: selected ? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: selected ? 'var(--color-accent-bg)' : 'transparent',
        color: selected ? 'var(--color-text)' : 'var(--color-text-2)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.82rem',
        fontWeight: selected ? 500 : 400,
        cursor: 'pointer',
        transition: 'border-color 150ms var(--ease-out), background-color 150ms var(--ease-out)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

/* ── Product list item ──────────────────────────────────────────────────── */
function ProductListItem({
  product,
  selected,
  onSelect,
}: {
  product: Product
  selected: boolean
  onSelect: () => void
}) {
  const colorHex = product.colors[0]?.hex_approx ?? '#C4A87A'

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius)',
        border: '1.5px solid',
        borderColor: selected ? 'var(--color-accent)' : 'transparent',
        backgroundColor: selected ? 'var(--color-accent-bg)' : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'border-color 150ms var(--ease-out), background-color 150ms var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          backgroundColor: colorHex,
          border: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          fontWeight: selected ? 500 : 400,
          color: selected ? 'var(--color-text)' : 'var(--color-text-2)',
          lineHeight: 1.3,
        }}
      >
        {product.brand}
      </span>
    </button>
  )
}

/* ── Product detail panel ────────────────────────────────────────────────── */
function ProductDetail({
  product,
  finishIndex,
  granulometryIndex,
  setFinishIndex,
  setGranulometryIndex,
  onVisualize,
}: {
  product: Product
  finishIndex: number
  granulometryIndex: number
  setFinishIndex: (i: number) => void
  setGranulometryIndex: (i: number) => void
  onVisualize: () => void
}) {
  const colorHex = product.colors[0]?.hex_approx ?? '#C4A87A'
  const finishes = product.finishes
  const granulos = product.granulometries.filter((g) => !g._pending && g.size !== '_pending')
  const hasGranuloChoice = granulos.length > 1

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        height: '100%',
        overflowY: 'auto',
        padding: 'var(--space-8)',
      }}
    >
      {/* Product header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            backgroundColor: colorHex,
            border: '1px solid var(--color-border)',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: 'var(--color-text)',
              marginBottom: 4,
            }}
          >
            {product.brand}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
              maxWidth: '55ch',
            }}
          >
            {product.key_differentiator}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* Finish selector */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: 8,
          }}
        >
          Acabat
        </p>
        {finishes.length === 1 ? (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-text-2)',
            }}
          >
            {finishes[0].name}
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {finishes.map((f, i) => (
              <SelectorBtn
                key={i}
                label={f.name}
                selected={finishIndex === i}
                onClick={() => setFinishIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Granulometry selector */}
      {hasGranuloChoice && (
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: 8,
            }}
          >
            Granulometria
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {granulos.map((g, i) => (
              <SelectorBtn
                key={i}
                label={g.size}
                selected={granulometryIndex === i}
                onClick={() => setGranulometryIndex(i)}
              />
            ))}
          </div>
          {granulos[granulometryIndex]?.applications && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)',
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {granulos[granulometryIndex].applications?.join(' · ')}
            </p>
          )}
        </div>
      )}

      {/* Technical highlights */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: 8,
          }}
        >
          Dades tècniques
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 16px',
          }}
        >
          {product.technical.drainage && product.technical.drainage !== '_pending' && (
            <div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Drenatge</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-2)', lineHeight: 1.4 }}>
                {typeof product.technical.drainage === 'string' && product.technical.drainage.split('.')[0]}
              </p>
            </div>
          )}
          {product.technical.max_slope_pct && product.technical.max_slope_pct !== '_pending' && (
            <div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pendent màx.</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-2)' }}>{product.technical.max_slope_pct}%</p>
            </div>
          )}
          {product.technical.certifications?.filter(c => c !== '_pending').length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Certificacions</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-2)' }}>
                {product.technical.certifications.filter(c => c !== '_pending').join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* CTA */}
      <button
        onClick={onVisualize}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '14px 24px',
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
          transition: 'transform 160ms var(--ease-out), background-color 150ms',
          width: '100%',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        aria-label={`Visualitzar ${product.brand} en 3D`}
      >
        Visualitzar en 3D
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function Step2Product({ products }: { products: Product[] }) {
  const scene = useConfiguratorStore((s) => s.scene)
  const productId = useConfiguratorStore((s) => s.productId)
  const finishIndex = useConfiguratorStore((s) => s.finishIndex)
  const granulometryIndex = useConfiguratorStore((s) => s.granulometryIndex)
  const setProductId = useConfiguratorStore((s) => s.setProductId)
  const setFinishIndex = useConfiguratorStore((s) => s.setFinishIndex)
  const setGranulometryIndex = useConfiguratorStore((s) => s.setGranulometryIndex)
  const goToStep = useConfiguratorStore((s) => s.goToStep)

  const sceneDef = SCENES.find((sc) => sc.id === scene)
  const compatible = products.filter((p) =>
    sceneDef ? sceneDef.useTypes.some((ut) => p.use_types.includes(ut)) : true,
  )

  const selectedProduct = compatible.find((p) => p.id === productId) ?? null

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      {/* ── Left: product list ── */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: 'var(--space-6)',
          gap: 'var(--space-2)',
        }}
        aria-label="Llista de paviments compatibles"
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
            paddingLeft: 12,
          }}
        >
          {compatible.length} productes compatibles
        </p>

        {compatible.map((p) => (
          <ProductListItem
            key={p.id}
            product={p}
            selected={productId === p.id}
            onSelect={() => setProductId(p.id)}
          />
        ))}
      </aside>

      {/* ── Right: product detail ── */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            finishIndex={finishIndex}
            granulometryIndex={granulometryIndex}
            setFinishIndex={setFinishIndex}
            setGranulometryIndex={setGranulometryIndex}
            onVisualize={() => goToStep(3)}
          />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="6" y="6" width="36" height="36" rx="4" stroke="var(--color-border)" strokeWidth="1.5" />
              <path d="M16 24h16M24 16v16" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: '0.875rem' }}>Selecciona un producte per veure'n els detalls</p>
          </div>
        )}
      </div>
    </div>
  )
}

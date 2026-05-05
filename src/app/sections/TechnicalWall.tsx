import { useInView } from '@/hooks/useInView'
import { useCountUp } from '@/hooks/useCountUp'
import type { Product } from '@/types/product'

function SlopeCell({ slope, active }: { slope: Product['technical']['max_slope_pct']; active: boolean }) {
  const numeric = typeof slope === 'number' ? slope : 0
  const v = useCountUp(numeric, active && numeric > 0, 1300)
  if (!slope || slope === '_pending') return <>—</>
  if (typeof slope === 'string') return <>{slope}</>
  return <>{Math.round(v)}%</>
}

interface Props {
  products: Product[]
}

function fmtDrainage(d: Product['technical']['drainage']): string {
  if (!d || d === '_pending') return '—'
  return typeof d === 'string' ? d.split('.')[0].trim() : '—'
}

function fmtCerts(c: string[]): string {
  const real = c.filter((x) => x !== '_pending')
  return real.length ? real.join(' · ') : '—'
}

function fmtMaintenance(m: string): string {
  if (!m || m === '_pending') return '—'
  return m.split('.')[0].trim()
}

function fmtInstall(arr: string[]): string {
  const real = arr.filter((x) => x !== '_pending')
  return real.length ? real.join(' · ') : '—'
}

export default function TechnicalWall({ products }: Props) {
  const [ref, inView] = useInView<HTMLElement>()

  return (
    <section
      id="tech"
      ref={ref}
      className="section section--mid"
      data-reveal
      data-revealed={inView}
      aria-label="Comparativa tècnica de productes"
    >
      <div style={{ marginBottom: 48, display: 'grid', gap: 12 }}>
        <span className="t-micro" style={{ color: 'oklch(40% 0.020 62)' }}>— Dades tècniques</span>
        <h2 className="t-display-l" style={{ maxWidth: '16ch', color: 'var(--color-text-mid)' }}>
          Comparativa<br />directa.
        </h2>
      </div>

      <div className="tech-table-scroll">
        <table className="tech-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Producte</th>
              <th>Drenatge</th>
              <th>Pendent màx.</th>
              <th>Manteniment</th>
              <th>Instal·lació</th>
              <th>Certificacions</th>
              <th>Eco</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} data-stagger={Math.min(i + 1, 5)} data-reveal data-revealed={inView}>
                <td className="product-cell">{p.brand}</td>
                <td>{fmtDrainage(p.technical.drainage)}</td>
                <td className="t-mono-num"><SlopeCell slope={p.technical.max_slope_pct} active={inView} /></td>
                <td>{fmtMaintenance(p.technical.maintenance)}</td>
                <td>{fmtInstall(p.technical.installation_methods)}</td>
                <td>{fmtCerts(p.technical.certifications)}</td>
                <td>{p.technical.eco?.split('.')[0] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

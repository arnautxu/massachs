import { useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { useElementScrollProgress } from '@/hooks/useScrollProgress'
import { AutoMarquee } from '@/components/Marquee'
import CountUp from '@/components/CountUp'

const TICKER_ITEMS = [
  'Girona',
  'Pedrera pròpia · La Garrotxa',
  '4 generacions',
  'Sauló natural',
  'Certificacions ISO',
  'Des de 1957',
  'Catàleg de 5 productes',
  'Sense pigments artificials',
]

function Word({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="word-reveal" style={{ marginRight: '0.18em' }}>
      <span style={{ ['--word-delay' as never]: `${delay}ms` }}>{text}</span>
    </span>
  )
}

export default function Hero() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 })
  const heroRef = useRef<HTMLDivElement>(null)
  const p = useElementScrollProgress(heroRef) // -1..1
  const lift = -Math.max(0, p) * 60 // px upward as user scrolls past

  return (
    <section
      id="hero"
      ref={ref}
      className="section section--light"
      data-reveal
      data-revealed={inView}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        paddingTop: 0,
      }}
      aria-label="Introducció"
    >
      {/* Top ticker (auto-marquee) */}
      <div className="hero-ticker">
        <AutoMarquee items={TICKER_ITEMS} speed="slow" tone="muted" />
      </div>

      {/* Top metadata strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 20,
          flexWrap: 'wrap',
          paddingTop: 32,
          paddingBottom: 16,
        }}
      >
        <div className="t-micro">Massachs · Girona · 41.97°N 2.82°E</div>
        <div className="t-micro text-muted-light">Paviments naturals · 5 productes</div>
      </div>

      {/* Main grid (flex-grow) */}
      <div
        ref={heroRef}
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 40,
          alignItems: 'end',
          paddingBlock: 24,
          transform: `translate3d(0, ${lift}px, 0)`,
          willChange: 'transform',
        }}
      >
        <div>
          <h1 className="t-display-xl" style={{ marginBottom: 24 }}>
            <span style={{ display: 'block' }}>
              <Word text="Paviments" delay={120} />
            </span>
            <span style={{ display: 'block', color: 'var(--color-accent)' }}>
              <Word text="de" delay={260} />
              <Word text="la" delay={340} />
              <Word text="terra" delay={420} />
            </span>
            <span style={{ display: 'block' }}>
              <Word text="de" delay={560} />
              <Word text="Girona." delay={640} />
            </span>
          </h1>
          <p
            data-stagger="3"
            data-reveal
            data-revealed={inView}
            className="t-body-lg text-muted-light"
            style={{ maxWidth: '52ch' }}
          >
            Sauló natural, conglomerats certificats i llambordes prefabricades.
            Material extret de les nostres pedreres a la Garrotxa, processat per
            quatre generacions de la mateixa família.
          </p>
        </div>

        {/* Side metadata column */}
        <aside
          data-stagger="4"
          data-reveal
          data-revealed={inView}
          className="hero-side"
          style={{
            display: 'grid',
            gap: 28,
            minWidth: 180,
            alignSelf: 'end',
            paddingBottom: 8,
          }}
        >
          <Stat label="Any de fundació" value={1957} animated />
          <Stat label="Generació" value={4} format={(n) => String(n).padStart(2, '0')} animated />
          <Stat label="Productes" value={5} format={(n) => String(n).padStart(2, '0')} animated />
          <Stat label="Pedrera" valueText="La Garrotxa" />
        </aside>
      </div>

      {/* Bottom: hairline + scroll cue */}
      <div style={{ paddingBlock: 20 }}>
        <hr className="hr-light" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 20,
            gap: 20,
          }}
        >
          <span className="t-micro text-muted-light">
            ↓ Mostra interactiva a continuació
          </span>
          <span className="t-micro text-muted-light scroll-cue">Scroll</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .hero-side { display: none !important; }
        }
      `}</style>
    </section>
  )
}

function Stat({
  label,
  value,
  valueText,
  format,
  animated,
}: {
  label: string
  value?: number
  valueText?: string
  format?: (n: number) => string
  animated?: boolean
}) {
  return (
    <div>
      <div className="t-micro text-muted-light" style={{ marginBottom: 4 }}>{label}</div>
      <div
        className="t-display-m t-mono-num"
        style={{ color: 'var(--color-text-light)' }}
      >
        {animated && value !== undefined ? (
          <CountUp value={value} duration={1600} format={format} />
        ) : (
          valueText ?? (value !== undefined ? (format ? format(value) : value) : '')
        )}
      </div>
    </div>
  )
}

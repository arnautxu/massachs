import { useInView } from '@/hooks/useInView'

export default function Hero() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 })

  return (
    <section
      ref={ref}
      className="section section--light"
      data-reveal
      data-revealed={inView}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 64,
      }}
      aria-label="Introducció"
    >
      {/* Top metadata strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div className="t-micro">Massachs · Girona · Des de 1957</div>
        <div className="t-micro text-muted-light">Paviments naturals · 5 productes</div>
      </div>

      {/* Main headline grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 40,
          alignItems: 'end',
        }}
      >
        <div data-stagger="1" data-reveal data-revealed={inView}>
          <h1 className="t-display-xl" style={{ marginBottom: 24 }}>
            Paviments<br />
            <span style={{ color: 'var(--color-accent)' }}>de la terra</span><br />
            de Girona.
          </h1>
          <p className="t-body-lg text-muted-light" style={{ maxWidth: '52ch' }}>
            Sauló natural, conglomerats certificats i llambordes prefabricades.
            Material extret de les nostres pedreres a la Garrotxa, processat per
            quatre generacions de la mateixa família.
          </p>
        </div>

        {/* Side metadata column — desktop only */}
        <aside
          data-stagger="2"
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
          <Stat label="Any de fundació" value="1957" />
          <Stat label="Generació" value="04" />
          <Stat label="Productes" value="05" />
          <Stat label="Pedrera" value="La Garrotxa" />
        </aside>
      </div>

      {/* Bottom: hairline + scroll cue */}
      <div>
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
          <span className="t-micro text-muted-light">↓ Mostra de material a continuació</span>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="t-micro text-muted-light" style={{ marginBottom: 4 }}>{label}</div>
      <div
        className="t-display-m t-mono-num"
        style={{ color: 'var(--color-text-light)' }}
      >
        {value}
      </div>
    </div>
  )
}

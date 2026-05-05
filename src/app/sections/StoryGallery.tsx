import { useInView } from '@/hooks/useInView'

const TILES = [
  { seed: 'massachs-quarry-9', w: 800, h: 600,  caption: 'Pedrera de la Garrotxa' },
  { seed: 'massachs-park-22',  w: 800, h: 1000, caption: 'Camí de parc, Olot' },
  { seed: 'massachs-plaza-7',  w: 800, h: 800,  caption: 'Plaça pública, Banyoles' },
  { seed: 'massachs-house-44', w: 800, h: 600,  caption: 'Accés rodat, Cassà' },
] as const

export default function StoryGallery() {
  const [ref, inView] = useInView<HTMLElement>()
  const [galRef, galInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section
      ref={ref}
      className="section section--dark"
      data-reveal
      data-revealed={inView}
      aria-label="Història i galeria"
    >
      {/* Story */}
      <div className="story-grid">
        <div data-stagger="1" data-reveal data-revealed={inView}>
          <span className="t-micro text-muted-dark">— Història</span>
          <h2 className="t-display-l" style={{ marginTop: 12, maxWidth: '16ch' }}>
            Quatre<br />generacions<br />
            <span className="text-accent">de pedra.</span>
          </h2>
        </div>

        <div
          data-stagger="2"
          data-reveal
          data-revealed={inView}
          style={{ display: 'grid', gap: 28 }}
        >
          <p className="t-body-lg" style={{ maxWidth: '52ch' }}>
            Massachs explota les pedreres de sauló de la Garrotxa des de 1957.
            Avui, la quarta generació combina extracció tradicional amb
            laboratori propi, certificacions ISO i col·laboracions amb estudis
            d'arquitectura del paisatge a tot Catalunya.
          </p>
          <p className="t-body text-muted-dark" style={{ maxWidth: '52ch' }}>
            Cada producte parteix de la mateixa matèria — sauló natural — i la
            transforma a través de processos diferents. Sense pigments, sense
            additius decoratius. Només la terra del lloc.
          </p>

          {/* Big numbers */}
          <div className="story-stats">
            <BigStat value="68" label="Anys d'experiència" />
            <BigStat value="200+" label="Projectes públics i privats" />
            <BigStat value="4" label="Generacions familiars" />
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div
        ref={galRef}
        data-revealed={galInView}
        className="gallery-grid"
        style={{ marginTop: 96 }}
      >
        {TILES.map((t, i) => (
          <figure
            key={t.seed}
            className="tile-wrap"
            style={{
              gridArea: `t${i + 1}`,
              transitionDelay: `${i * 80}ms`,
            }}
          >
            <img
              src={`https://picsum.photos/seed/${t.seed}/${t.w}/${t.h}`}
              alt={t.caption}
              className="tile"
              loading="lazy"
              width={t.w}
              height={t.h}
            />
            <figcaption
              className="t-micro"
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                color: 'var(--color-text-dark)',
                background: 'oklch(13% 0.012 70 / 0.8)',
                padding: '6px 10px',
                backdropFilter: 'blur(4px)',
              }}
            >
              {t.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <style>{`
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 64px;
          align-items: start;
        }
        .story-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 16px;
          padding-top: 32px;
          border-top: 1px solid var(--line-on-dark);
        }
        .gallery-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1.4fr 1fr 1fr;
          grid-template-rows: 320px 200px;
          grid-template-areas:
            "t1 t2 t3"
            "t1 t2 t4";
        }
        .gallery-grid > .tile-wrap { width: 100%; height: 100%; }

        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; gap: 32px; }
          .story-stats { grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
          .gallery-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 240px 240px 240px;
            grid-template-areas:
              "t1 t1"
              "t2 t3"
              "t2 t4";
          }
        }
        @media (max-width: 540px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 220px);
            grid-template-areas: "t1" "t2" "t3" "t4";
          }
          .story-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="t-display-l t-mono-num"
        style={{ color: 'var(--color-accent)', fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
      >
        {value}
      </div>
      <div className="t-micro text-muted-dark" style={{ marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

import { useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { useElementScrollProgress } from '@/hooks/useScrollProgress'
import CountUp from '@/components/CountUp'

/* Unsplash photo IDs — natural materials, paths, architecture, gardens */
const TILES = [
  {
    id: 'photo-1505842465776-3a4f0fa1ddc6', // stone path through park
    caption: 'Camí de parc · Olot',
    w: 800, h: 600,
  },
  {
    id: 'photo-1606744824163-985d376605aa', // stone gravel garden
    caption: 'Paviment privat · Cassà',
    w: 800, h: 1000,
  },
  {
    id: 'photo-1611077428540-0a4e69ad9be1', // architectural plaza
    caption: 'Plaça pública · Banyoles',
    w: 800, h: 800,
  },
  {
    id: 'photo-1518709268805-4e9042af2176', // raw stone / quarry texture
    caption: 'Pedrera · La Garrotxa',
    w: 800, h: 600,
  },
] as const

function unsplashUrl(id: string, w: number, h: number): string {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=70`
}

function ParallaxTile({
  id, caption, w, h, areaIndex,
}: { id: string; caption: string; w: number; h: number; areaIndex: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const p = useElementScrollProgress(ref) // -1..1
  const translate = -p * 24 // px

  return (
    <figure
      ref={ref}
      className="tile-wrap"
      style={{
        gridArea: `t${areaIndex + 1}`,
        transitionDelay: `${areaIndex * 80}ms`,
      }}
    >
      <div
        className="parallax-tile"
        style={{
          width: '100%',
          height: '100%',
          transform: `translate3d(0, ${translate}px, 0)`,
        }}
      >
        <img
          src={unsplashUrl(id, w, h)}
          alt={caption}
          className="tile"
          loading="lazy"
          width={w}
          height={h}
          referrerPolicy="no-referrer"
        />
      </div>
      <figcaption
        className="t-micro"
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          color: 'var(--color-text-dark)',
          background: 'oklch(13% 0.012 70 / 0.78)',
          padding: '6px 10px',
          backdropFilter: 'blur(4px)',
          zIndex: 2,
        }}
      >
        {caption}
      </figcaption>
    </figure>
  )
}

export default function StoryGallery() {
  const [ref, inView] = useInView<HTMLElement>()
  const [galRef, galInView] = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section
      id="story"
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
            <BigStat value={68} label="Anys d'experiència" />
            <BigStat value={200} label="Projectes públics i privats" suffix="+" />
            <BigStat value={4}   label="Generacions familiars" />
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
          <ParallaxTile
            key={t.id}
            id={t.id}
            caption={t.caption}
            w={t.w}
            h={t.h}
            areaIndex={i}
          />
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

function BigStat({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  return (
    <div>
      <div
        className="t-display-l t-mono-num"
        style={{ color: 'var(--color-accent)', fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
      >
        <CountUp value={value} duration={1700} suffix={suffix} />
      </div>
      <div className="t-micro text-muted-dark" style={{ marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

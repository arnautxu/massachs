import { useInView } from '@/hooks/useInView'

function HeroLine({
  children,
  delay,
  accent,
}: {
  children: React.ReactNode
  delay: number
  accent?: boolean
}) {
  return (
    <span className="hero-line-wrap">
      <span
        className="hero-line-inner"
        style={{
          ['--line-delay' as never]: `${delay}ms`,
          color: accent ? 'var(--color-accent)' : undefined,
        }}
      >
        {children}
      </span>
    </span>
  )
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="hero-meta-block">
      <span className="t-micro text-muted-light">{label}</span>
      <span className="hero-meta-value t-mono-num">{value}</span>
    </div>
  )
}

export default function Hero() {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.05 })

  return (
    <section
      id="hero"
      ref={ref}
      className="section--light"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
      aria-label="Introducció"
    >
      {/* Top identity bar */}
      <div className="hero-topbar">
        <span className="t-micro">Massachs · Paviments naturals</span>
        <span className="t-micro text-muted-light">Girona · Catalunya · Est.&nbsp;1957</span>
      </div>

      {/* Main body */}
      <div className="hero-body">
        {/* Left: headline + body + CTA */}
        <div className="hero-left">
          <h1 className="hero-headline" aria-label="Sauló de la Garrotxa">
            <HeroLine delay={60} accent>Sauló</HeroLine>
            <HeroLine delay={200}>de la</HeroLine>
            <HeroLine delay={340}>Garrotxa.</HeroLine>
          </h1>

          <p
            className="t-body-lg text-muted-light hero-sub"
            data-reveal
            data-revealed={inView}
            style={{ transitionDelay: '540ms' }}
          >
            Sauló natural, conglomerats certificats i llambordes prefabricades.
            Sense pigments. Extret de les nostres pedreres per quatre generacions
            de la mateixa família.
          </p>

          <a
            href="#contact"
            className="hero-cta"
            data-reveal
            data-revealed={inView}
            style={{ transitionDelay: '680ms' }}
          >
            <span className="t-micro">Demana una mostra</span>
            <span className="hero-cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        {/* Vertical divider */}
        <div className="hero-divider" aria-hidden="true" />

        {/* Right: metadata */}
        <aside
          className="hero-meta"
          aria-label="Dades de referència"
          data-reveal
          data-revealed={inView}
          style={{ transitionDelay: '300ms' }}
        >
          <MetaBlock label="Coordenades" value="41.97°N · 2.82°E" />
          <MetaBlock label="Fundació" value="1957" />
          <MetaBlock label="Generació" value="IV" />
          <MetaBlock label="Productes" value="05" />
          <MetaBlock label="Pedrera" value="La Garrotxa" />
        </aside>
      </div>

      {/* Bottom scroll cue */}
      <div className="hero-bottom">
        <span className="t-micro text-muted-light">↓ Mostra interactiva</span>
        <span className="t-micro text-muted-light scroll-cue">Scroll</span>
      </div>

      <style>{`
        .hero-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px clamp(20px, 5vw, 80px);
          border-bottom: 1px solid var(--line-on-light);
          flex-shrink: 0;
        }
        .hero-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1px clamp(200px, 22vw, 300px);
          padding-inline: clamp(20px, 5vw, 80px);
          padding-top: clamp(48px, 7vw, 88px);
          padding-bottom: clamp(32px, 5vw, 64px);
          align-items: start;
        }
        .hero-left {
          padding-right: clamp(32px, 5vw, 72px);
          display: flex;
          flex-direction: column;
          gap: 40px;
          align-items: flex-start;
        }
        .hero-divider {
          background: var(--line-on-light);
          align-self: stretch;
        }
        .hero-meta {
          padding-left: clamp(24px, 4vw, 52px);
          display: flex;
          flex-direction: column;
        }
        .hero-meta-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 20px 0;
          border-bottom: 1px solid var(--line-on-light);
        }
        .hero-meta-block:first-child { padding-top: 0; }
        .hero-meta-value {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.1rem, 2.2vw, 1.9rem);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          line-height: 1;
          color: var(--color-text-light);
        }

        /* Headline clip-reveal per line */
        .hero-headline {
          font-family: var(--font-display);
          font-weight: 900;
          line-height: 0.86;
          letter-spacing: -0.032em;
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
          margin: 0;
        }
        .hero-line-wrap {
          display: block;
          overflow: hidden;
        }
        .hero-line-inner {
          display: block;
          font-size: clamp(5.5rem, 15.5vw, 13rem);
          transform: translateY(108%);
          animation: hero-line-rise 820ms var(--ease-out) forwards;
          animation-delay: var(--line-delay, 0ms);
        }
        @keyframes hero-line-rise {
          to { transform: translateY(0); }
        }

        /* CTA button */
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 17px 30px;
          background: var(--color-text-light);
          color: var(--color-bg-light);
          text-decoration: none;
          cursor: pointer;
          transition: transform 160ms var(--ease-out), background 200ms var(--ease-out);
          flex-shrink: 0;
        }
        .hero-cta:hover { background: var(--color-accent); }
        .hero-cta:active { transform: scale(0.97); }
        .hero-cta-arrow {
          display: inline-block;
          font-size: 1rem;
          transition: transform 220ms var(--ease-out);
          letter-spacing: 0;
        }
        .hero-cta:hover .hero-cta-arrow { transform: translateX(5px); }

        .hero-sub { max-width: 52ch; }

        .hero-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px clamp(20px, 5vw, 80px);
          border-top: 1px solid var(--line-on-light);
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero-body {
            grid-template-columns: 1fr;
            gap: 44px;
          }
          .hero-divider { display: none; }
          .hero-meta {
            padding-left: 0;
            flex-direction: row;
            flex-wrap: wrap;
            border-top: 1px solid var(--line-on-light);
          }
          .hero-meta-block {
            flex: 1 0 120px;
            border-bottom: none;
            padding: 16px 20px 16px 0;
          }
          .hero-meta-block:first-child { padding-top: 16px; }
          .hero-meta-value { font-size: clamp(1rem, 3vw, 1.4rem); }
          .hero-line-inner { font-size: clamp(4.5rem, 14vw, 8rem); }
        }
        @media (max-width: 540px) {
          .hero-meta { display: none; }
          .hero-line-inner { font-size: clamp(3.8rem, 18vw, 7rem); }
          .hero-left { gap: 28px; }
        }
      `}</style>
    </section>
  )
}

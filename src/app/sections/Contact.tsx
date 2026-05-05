import { useInView } from '@/hooks/useInView'

export default function Contact() {
  const [ref, inView] = useInView<HTMLElement>()
  const year = new Date().getFullYear()

  return (
    <section
      ref={ref}
      className="section section--dark"
      data-reveal
      data-revealed={inView}
      aria-label="Contacte"
      style={{ paddingTop: 0, paddingBottom: 32 }}
    >
      <hr className="hr-dark" style={{ marginBottom: 80 }} />

      <div className="contact-grid">
        {/* Wordmark + manifesto */}
        <div data-stagger="1" data-reveal data-revealed={inView}>
          <h2 className="t-display-xl" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            Demanem<br />una <span className="text-accent">mostra.</span>
          </h2>
          <p className="t-body text-muted-dark" style={{ marginTop: 24, maxWidth: '40ch' }}>
            Enviem mostres físiques de qualsevol producte a estudis d'arquitectura,
            ajuntaments i clients privats de la península.
          </p>
        </div>

        {/* Contact details */}
        <div
          data-stagger="2"
          data-reveal
          data-revealed={inView}
          style={{ display: 'grid', gap: 32, alignContent: 'start' }}
        >
          <ContactRow label="Correu" value="info@massachs.cat" href="mailto:info@massachs.cat" />
          <ContactRow label="Telèfon" value="+34 972 00 00 00" href="tel:+34972000000" />
          <ContactRow label="Adreça" value={'Polígon Industrial\nLa Garrotxa, Girona'} />
          <ContactRow label="Horari" value={'Dl–Dv 8:00 – 17:00\nDs 8:00 – 13:00'} />
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ marginTop: 96 }}>
        <hr className="hr-dark" style={{ marginBottom: 24 }} />
        <div className="footer-row">
          <span className="t-micro">Massachs — Des de 1957</span>
          <span className="t-micro text-muted-dark">© {year} Grup Massachs · Girona</span>
          <a className="t-micro" href="https://massachs.cat" target="_blank" rel="noreferrer">
            massachs.cat ↗
          </a>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .footer-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        @media (max-width: 720px) {
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
        }
      `}</style>
    </section>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div>
      <div className="t-micro text-muted-dark" style={{ marginBottom: 6 }}>{label}</div>
      <div
        className="t-display-m"
        style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
          whiteSpace: 'pre-line',
          letterSpacing: '0.005em',
          textTransform: 'none',
        }}
      >
        {value}
      </div>
    </div>
  )
  if (href) {
    return (
      <a
        href={href}
        style={{
          display: 'block',
          paddingBottom: 20,
          borderBottom: '1px solid var(--line-on-dark)',
          transition: 'color 200ms var(--ease-out), border-color 200ms var(--ease-out)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
      >
        {content}
      </a>
    )
  }
  return (
    <div style={{ paddingBottom: 20, borderBottom: '1px solid var(--line-on-dark)' }}>
      {content}
    </div>
  )
}

import { useState } from 'react'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { SCENES } from '@/types/scene'
import type { Product } from '@/types/product'

interface FormState {
  nom: string
  email: string
  empresa: string
  missatge: string
}

interface FormErrors {
  nom?: string
  email?: string
}

/* ── Form input ───────────────────────────────────────────────────────────── */
function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required,
  error,
  placeholder,
  multiline,
}: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  error?: string
  placeholder?: string
  multiline?: boolean
}) {
  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid',
    borderColor: error ? '#C0392B' : 'var(--color-border)',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color 150ms var(--ease-out)',
    resize: multiline ? 'vertical' : undefined,
    boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: error ? '#C0392B' : 'var(--color-text-muted)',
        }}
      >
        {label}{required && <span aria-hidden="true" style={{ color: 'var(--color-accent)', marginLeft: 2 }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={baseInputStyle}
          aria-required={required}
          aria-invalid={!!error}
          onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={(e) => { if (!error) e.target.style.borderColor = 'var(--color-border)' }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={baseInputStyle}
          aria-required={required}
          aria-invalid={!!error}
          onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={(e) => { if (!error) e.target.style.borderColor = 'var(--color-border)' }}
        />
      )}
      {error && (
        <p
          role="alert"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#C0392B' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

/* ── Success state ───────────────────────────────────────────────────────── */
function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}
    >
      {/* Checkmark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent-bg)',
          border: '2px solid var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 14l6 6 12-12" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: 'var(--color-text)',
            marginBottom: 8,
          }}
        >
          Sol·licitud enviada
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '30ch' }}>
          L'equip de Massachs es posarà en contacte amb tu en breu per gestionar la mostra.
        </p>
      </div>

      <button
        onClick={onClose}
        style={{
          padding: '10px 24px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'transparent',
          color: 'var(--color-text-2)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        Tornar a la visualització
      </button>
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function Step4Form({ products }: { products: Product[] }) {
  const scene = useConfiguratorStore((s) => s.scene)
  const productId = useConfiguratorStore((s) => s.productId)
  const finishIndex = useConfiguratorStore((s) => s.finishIndex)
  const granulometryIndex = useConfiguratorStore((s) => s.granulometryIndex)
  const goToStep = useConfiguratorStore((s) => s.goToStep)

  const selectedProduct = products.find((p) => p.id === productId)
  const sceneDef = SCENES.find((sc) => sc.id === scene)
  const granulos = (selectedProduct?.granulometries ?? []).filter(
    (g) => !g._pending && g.size !== '_pending',
  )

  const [form, setForm] = useState<FormState>({ nom: '', email: '', empresa: '', missatge: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.nom.trim()) e.nom = 'El nom és obligatori'
    if (!form.email.trim()) {
      e.email = 'El correu és obligatori'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Format de correu no vàlid'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    // Build mailto
    const to = selectedProduct?.contact?.email ?? 'info@massachs.cat'
    const subject = encodeURIComponent(
      `Sol·licitud de mostra — ${selectedProduct?.brand ?? 'Paviment Massachs'}`,
    )
    const finish = selectedProduct?.finishes[finishIndex]?.name ?? ''
    const granulo = granulos[granulometryIndex]?.size ?? ''
    const body = encodeURIComponent(
      [
        `Nom: ${form.nom}`,
        `Empresa: ${form.empresa || '—'}`,
        `Correu: ${form.email}`,
        ``,
        `Escena: ${sceneDef?.label ?? '—'}`,
        `Producte: ${selectedProduct?.brand ?? '—'}`,
        `Acabat: ${finish}`,
        granulo ? `Granulometria: ${granulo}` : '',
        ``,
        form.missatge ? `Missatge:\n${form.missatge}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    /* Backdrop overlay */
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'oklch(97% 0.008 72 / 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Sol·licitar mostra de paviment"
    >
      {/* Card */}
      <div
        className="panel-glass"
        style={{
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: 440,
          maxHeight: '90dvh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {submitted ? (
          <SuccessState onClose={() => goToStep(3)} />
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              padding: 28,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--color-text)',
                    marginBottom: 2,
                  }}
                >
                  Sol·licitar mostra
                </h2>
                {selectedProduct && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {selectedProduct.brand}
                    {sceneDef ? ` · ${sceneDef.label}` : ''}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => goToStep(3)}
                aria-label="Tancar formulari"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)' }} />

            <FormField
              id="nom"
              label="Nom i cognoms"
              value={form.nom}
              onChange={(v) => { setForm((f) => ({ ...f, nom: v })); setErrors((e) => ({ ...e, nom: undefined })) }}
              required
              error={errors.nom}
              placeholder="Anna García"
            />

            <FormField
              id="email"
              label="Correu electrònic"
              type="email"
              value={form.email}
              onChange={(v) => { setForm((f) => ({ ...f, email: v })); setErrors((e) => ({ ...e, email: undefined })) }}
              required
              error={errors.email}
              placeholder="anna@empresa.cat"
            />

            <FormField
              id="empresa"
              label="Empresa / Estudi"
              value={form.empresa}
              onChange={(v) => setForm((f) => ({ ...f, empresa: v }))}
              placeholder="Opcional"
            />

            <FormField
              id="missatge"
              label="Missatge"
              value={form.missatge}
              onChange={(v) => setForm((f) => ({ ...f, missatge: v }))}
              placeholder="Detalls del projecte, quantitat aproximada, termini..."
              multiline
            />

            {/* Submit */}
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '13px 24px',
                borderRadius: 'var(--radius)',
                border: 'none',
                backgroundColor: 'var(--color-accent)',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                width: '100%',
                transition: 'transform 160ms var(--ease-out)',
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Enviar sol·licitud
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8l12-6-5 6 5 6-12-6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </button>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              S'obrirà el teu client de correu. Cap dada s'envia a servidors externs.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export type UseType =
  | 'peatonal_lleuger'
  | 'peatonal_intens'
  | 'mixt'
  | 'vehicular_lleuger'
  | 'vehicular_pesat'

export type SceneId =
  | 'vorera-urbana'
  | 'placa-publica'
  | 'parc-cami'
  | 'pati-escolar'
  | 'acces-rodat'
  | 'jardi-privat'

export interface ProductColor {
  name: string
  description: string
  hex_approx: string
  _pending?: boolean
  _note?: string
}

export interface ProductFinish {
  name: string
  description: string
  _pending?: boolean
}

export interface Granulometry {
  size: string
  applications?: string[]
  _pending?: boolean
}

export interface ProductDimensions {
  width_cm: number
  length_cm: number
  thickness_cm: number
  customizable: boolean
  _note?: string
}

export interface ProductTechnical {
  drainage?: string
  max_slope_pct?: number | string
  max_slope_execution_pct?: number
  compressive_strength_mpa?: { min: number; max: number; standard: string; _note?: string } | string
  flexural_strength_mpa?: { min: number; max: number; _note?: string }
  maintenance: string
  installation_methods: string[]
  additives?: string[]
  base_options?: string[]
  eco: string
  certifications: string[]
  standards: string[]
  quality_control?: string
  resistance_verified?: string
  _pending_fields?: string[]
}

export interface Product {
  id: string
  brand: string
  website: string
  short_description: string
  long_description: string
  key_differentiator: string
  applications: string[]
  use_types: UseType[]
  colors: ProductColor[]
  finishes: ProductFinish[]
  granulometries: Granulometry[]
  thicknesses_cm: Record<string, unknown>
  dimensions?: ProductDimensions
  technical: ProductTechnical
  supply_formats: string[]
  sample_image_url: string
  pdf_urls: string[]
  contact?: { email?: string; phone?: string }
}

export interface ConfiguratorState {
  scene: SceneId | null
  useType: UseType | null
  productId: string | null
  finishIndex: number
  granulometryIndex: number
}

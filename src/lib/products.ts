import type { Product, UseType } from '@/types/product'
// UseType is still used by filterByUseType

let cache: Product[] | null = null

export async function loadProducts(): Promise<Product[]> {
  if (cache) return cache
  const res = await fetch('/data/products.json')
  if (!res.ok) throw new Error('Failed to load products.json')
  const json = await res.json()
  cache = json.products as Product[]
  return cache
}

export function filterByUseType(products: Product[], useType: UseType): Product[] {
  return products.filter((p) => p.use_types.includes(useType))
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

// Builds a shareable URL with the current configuration state
export function buildShareUrl(params: {
  scene: string
  productId: string
  finishIndex: number
  granulometryIndex: number
}): string {
  const url = new URL(window.location.origin + '/configurador')
  url.searchParams.set('s', params.scene)
  url.searchParams.set('p', params.productId)
  url.searchParams.set('f', String(params.finishIndex))
  url.searchParams.set('g', String(params.granulometryIndex))
  return url.toString()
}

export function parseShareUrl(searchParams: URLSearchParams): {
  scene: string
  productId: string
  finishIndex: number
  granulometryIndex: number
} | {
  scene: string
} | null {
  const s = searchParams.get('s')
  const p = searchParams.get('p')
  const f = searchParams.get('f')
  const g = searchParams.get('g')
  if (!s) return null
  if (!p) return { scene: s }
  return {
    scene: s,
    productId: p,
    finishIndex: f ? parseInt(f, 10) : 0,
    granulometryIndex: g ? parseInt(g, 10) : 0,
  }
}

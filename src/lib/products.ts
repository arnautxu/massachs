import type { Product, UseType } from '@/types/product'

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

// Resolves the URL params for shareable links
export function buildShareUrl(params: {
  scene: string
  useType: string
  productId: string
  finishIndex: number
  granulometryIndex: number
}): string {
  const url = new URL(window.location.origin + '/configurador')
  url.searchParams.set('s', params.scene)
  url.searchParams.set('u', params.useType)
  url.searchParams.set('p', params.productId)
  url.searchParams.set('f', String(params.finishIndex))
  url.searchParams.set('g', String(params.granulometryIndex))
  return url.toString()
}

export function parseShareUrl(searchParams: URLSearchParams) {
  const s = searchParams.get('s')
  const u = searchParams.get('u')
  const p = searchParams.get('p')
  const f = searchParams.get('f')
  const g = searchParams.get('g')
  if (!s || !u || !p) return null
  return {
    scene: s,
    useType: u as UseType,
    productId: p,
    finishIndex: f ? parseInt(f, 10) : 0,
    granulometryIndex: g ? parseInt(g, 10) : 0,
  }
}

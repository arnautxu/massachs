import { useEffect, useState } from 'react'
import type { Product } from '@/types/product'

interface State {
  products: Product[]
  loading: boolean
  error: Error | null
}

let cachePromise: Promise<Product[]> | null = null

function loadOnce(): Promise<Product[]> {
  if (cachePromise) return cachePromise
  cachePromise = fetch('/data/products.json')
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load products: ${r.status}`)
      return r.json()
    })
    .then((data) => (Array.isArray(data) ? data : data.products) as Product[])
  return cachePromise
}

export function useProducts(): State {
  const [state, setState] = useState<State>({ products: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    loadOnce()
      .then((products) => { if (!cancelled) setState({ products, loading: false, error: null }) })
      .catch((error) => { if (!cancelled) setState({ products: [], loading: false, error }) })
    return () => { cancelled = true }
  }, [])

  return state
}

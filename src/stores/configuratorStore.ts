import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SceneId, UseType } from '@/types/product'

interface ConfiguratorStore {
  // Step 1
  scene: SceneId | null
  setScene: (scene: SceneId) => void

  // Step 2
  useType: UseType | null
  setUseType: (useType: UseType) => void

  // Step 3
  productId: string | null
  setProductId: (productId: string) => void
  finishIndex: number
  setFinishIndex: (index: number) => void
  granulometryIndex: number
  setGranulometryIndex: (index: number) => void

  // Navigation
  step: 1 | 2 | 3 | 4
  setStep: (step: 1 | 2 | 3 | 4) => void
  goToStep: (step: 1 | 2 | 3 | 4) => void

  // Reset
  reset: () => void

  // Session timestamp
  lastUpdated: number
}

const initialState = {
  scene: null,
  useType: null,
  productId: null,
  finishIndex: 0,
  granulometryIndex: 0,
  step: 1 as const,
  lastUpdated: Date.now(),
}

export const useConfiguratorStore = create<ConfiguratorStore>()(
  persist(
    (set) => ({
      ...initialState,

      setScene: (scene) =>
        set({ scene, lastUpdated: Date.now() }),

      setUseType: (useType) =>
        set({ useType, lastUpdated: Date.now() }),

      setProductId: (productId) =>
        set({ productId, finishIndex: 0, granulometryIndex: 0, lastUpdated: Date.now() }),

      setFinishIndex: (finishIndex) =>
        set({ finishIndex, lastUpdated: Date.now() }),

      setGranulometryIndex: (granulometryIndex) =>
        set({ granulometryIndex, lastUpdated: Date.now() }),

      setStep: (step) =>
        set({ step }),

      goToStep: (step) =>
        set({ step }),

      reset: () =>
        set({ ...initialState, lastUpdated: Date.now() }),
    }),
    {
      name: 'massachs-configurator',
      // Only persist for 24h
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const age = Date.now() - (state.lastUpdated ?? 0)
        if (age > 24 * 60 * 60 * 1000) state.reset()
      },
    },
  ),
)

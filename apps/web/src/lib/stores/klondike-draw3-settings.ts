import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface KlondikeDraw3SettingsStore {
  redealtCost: number
  redealsAllowed: number // 3 for standard draw-3
  setRedealtCost: (n: number) => void
  setRedealsAllowed: (n: number) => void
}

export const useKlondikeDraw3SettingsStore = create<KlondikeDraw3SettingsStore>()(
  persist(
    (set) => ({
      redealtCost: -100,
      redealsAllowed: 3,
      setRedealtCost: (n: number) => set({ redealtCost: n }),
      setRedealsAllowed: (n: number) => set({ redealsAllowed: n }),
    }),
    { name: 'klondike-draw3-settings' },
  ),
)

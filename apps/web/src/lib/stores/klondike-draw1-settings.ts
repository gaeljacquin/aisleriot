import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface KlondikeDraw1SettingsStore {
  redealtCost: number
  redealsAllowed: -1 // -1 = unlimited for draw-1
  setRedealtCost: (n: number) => void
}

export const useKlondikeDraw1SettingsStore =
  create<KlondikeDraw1SettingsStore>()(
    persist(
      (set) => ({
        redealtCost: 0,
        redealsAllowed: -1 as const,
        setRedealtCost: (n: number) => set({ redealtCost: n }),
      }),
      { name: 'klondike-draw1-settings' },
    ),
  )

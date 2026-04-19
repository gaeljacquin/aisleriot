import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CardStyle = 'basic' | 'four-color' | 'large' | 'large-four-color'

interface CardSettingsStore {
  cardStyle: CardStyle
  setCardStyle: (style: CardStyle) => void
}

export const useCardSettingsStore = create<CardSettingsStore>()(
  persist(
    (set) => ({
      cardStyle: 'basic',
      setCardStyle: (cardStyle) => set({ cardStyle }),
    }),
    {
      name: 'card-settings',
    },
  ),
)

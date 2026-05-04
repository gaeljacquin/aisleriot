import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CardStyle =
  | 'basic'
  | 'four-color'
  | 'large'
  | 'large-four-color'
  | 'minimal'
export type CardBack = 'default' | 'classic' | 'lattice' | 'monogram' | 'royal'

interface CardSettingsStore {
  cardStyle: CardStyle
  cardBack: CardBack
  setCardStyle: (style: CardStyle) => void
  setCardBack: (back: CardBack) => void
}

export const useCardSettingsStore = create<CardSettingsStore>()(
  persist(
    (set) => ({
      cardStyle: 'basic',
      cardBack: 'default',
      setCardStyle: (cardStyle) => set({ cardStyle }),
      setCardBack: (cardBack) => set({ cardBack }),
    }),
    {
      name: 'card-settings',
    },
  ),
)

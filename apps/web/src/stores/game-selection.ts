import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type GameFilter = 'popular' | 'all' | 'favorites'

interface GameSelectionState {
  gameFilter: GameFilter
  setGameFilter: (filter: GameFilter) => void
}

export const useGameSelectionStore = create<GameSelectionState>()(
  persist(
    (set) => ({
      gameFilter: 'popular',
      setGameFilter: (gameFilter) => set({ gameFilter }),
    }),
    {
      name: 'game-selection-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

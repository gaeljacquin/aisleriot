import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GameSelectionState {
  showAllGames: boolean
  setShowAllGames: (showAllGames: boolean) => void
  toggleShowAllGames: () => void
}

export const useGameSelectionStore = create<GameSelectionState>()(
  persist(
    (set) => ({
      showAllGames: false,
      setShowAllGames: (showAllGames) => set({ showAllGames }),
      toggleShowAllGames: () => set((state) => ({ showAllGames: !state.showAllGames })),
    }),
    {
      name: 'game-selection-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

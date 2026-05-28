import { create } from 'zustand'

interface VictoryAnimationState {
  isAnimating: boolean
  setIsAnimating: (isAnimating: boolean) => void
}

export const useVictoryAnimationStore = create<VictoryAnimationState>(
  (set) => ({
    isAnimating: false,
    setIsAnimating: (isAnimating) => set({ isAnimating }),
  }),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DevModeStore {
  isDevMode: boolean
  toggleDevMode: () => void
  setDevMode: (enabled: boolean) => void
}

export const useDevModeStore = create<DevModeStore>()(
  persist(
    (set) => ({
      isDevMode: false,
      toggleDevMode: () => set((state) => ({ isDevMode: !state.isDevMode })),
      setDevMode: (isDevMode) => set({ isDevMode }),
    }),
    {
      name: 'dev-mode-settings',
    },
  ),
)

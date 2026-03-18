import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PyramidSettingsStore {
  recycleLimit: number
  setRecycleLimit: (n: number) => void
}

export const usePyramidSettingsStore = create<PyramidSettingsStore>()(
  persist(
    (set) => ({
      recycleLimit: 2,
      setRecycleLimit: (n: number) => set({ recycleLimit: n }),
    }),
    { name: 'pyramid-settings' },
  ),
)

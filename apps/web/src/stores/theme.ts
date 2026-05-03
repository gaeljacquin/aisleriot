import { create } from 'zustand'
import { applyThemeMode, getStoredMode } from '@/lib/theme'
import type { ThemeMode } from '@/lib/theme'

interface ThemeStore {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const initialMode = getStoredMode()
applyThemeMode(initialMode)

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: initialMode,
  setMode: (mode) => {
    applyThemeMode(mode)
    localStorage.setItem('theme', mode)
    set({ mode })
  },
}))

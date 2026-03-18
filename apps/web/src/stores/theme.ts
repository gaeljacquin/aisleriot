import { create } from 'zustand'
import { applyThemeMode, getStoredMode  } from '@/lib/theme'
import type {ThemeMode} from '@/lib/theme';

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

// Keep the resolved theme in sync when the OS preference changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().mode === 'auto') {
      applyThemeMode('auto')
    }
  })
}

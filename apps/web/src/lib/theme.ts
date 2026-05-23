export type ThemeMode = 'legacy-light' | 'legacy-dark'
export type ThemeType = 'light' | 'dark'

export interface ThemeMetadata {
  label: string
  type?: ThemeType
}

export const THEMES: Record<ThemeMode, ThemeMetadata> = {
  'legacy-light': { label: 'Legacy Light', type: 'light' },
  'legacy-dark': { label: 'Legacy Dark', type: 'dark' },
}

export function getThemeType(mode: ThemeMode): ThemeType {
  return THEMES[mode].type || 'dark'
}

export function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'legacy-dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'legacy-light' || stored === 'legacy-dark') return stored
  // Migration/Fallback for older values
  if (stored === 'light') return 'legacy-light'
  if (stored === 'dark') return 'legacy-dark'
  return 'legacy-dark'
}

export function applyThemeMode(mode: ThemeMode) {
  const type = getThemeType(mode)
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(type)
  document.documentElement.setAttribute('data-theme', type)
  document.documentElement.style.colorScheme = type
}

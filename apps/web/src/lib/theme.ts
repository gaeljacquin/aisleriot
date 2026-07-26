export type ThemeMode =
  'glacier-dark' | 'glacier-light' | 'legacy-light' | 'legacy-dark'
export type ThemeType = 'light' | 'dark'

export interface ThemeMetadata {
  label: string
  type?: ThemeType
}

export const THEMES: Record<ThemeMode, ThemeMetadata> = {
  'glacier-dark': { label: 'Glacier Dark', type: 'dark' },
  'glacier-light': { label: 'Glacier Light', type: 'light' },
  'legacy-light': { label: 'Legacy Light', type: 'light' },
  'legacy-dark': { label: 'Legacy Dark', type: 'dark' },
}

export function getThemeType(mode: ThemeMode): ThemeType {
  return THEMES[mode]?.type || 'dark'
}

export function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'glacier-dark'
  const stored = localStorage.getItem('theme')
  if (
    stored === 'glacier-dark' ||
    stored === 'glacier-light' ||
    stored === 'legacy-light' ||
    stored === 'legacy-dark'
  ) {
    return stored
  }
  // Migration/Fallback for older values
  if (stored === 'light') return 'legacy-light'
  if (stored === 'dark') return 'legacy-dark'
  return 'glacier-dark'
}

export function applyThemeMode(mode: ThemeMode) {
  const type = getThemeType(mode)
  document.documentElement.classList.remove(
    'light',
    'dark',
    'glacier-dark',
    'glacier-light',
    'legacy-light',
    'legacy-dark',
  )
  document.documentElement.classList.add(type, mode)
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = type
}

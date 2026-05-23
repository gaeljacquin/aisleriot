export type ThemeMode = 'legacy-light' | 'legacy-dark'

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
  const cssClass = mode === 'legacy-dark' ? 'dark' : 'light'
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(cssClass)
  document.documentElement.setAttribute('data-theme', cssClass)
  document.documentElement.style.colorScheme = cssClass
}

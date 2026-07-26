import { describe, it, expect, beforeEach } from 'vitest'
import { THEMES, getThemeType, getStoredMode, applyThemeMode } from './theme'

// Ensure window, localStorage, and document are available in Node environment
if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
  const store = new Map<string, string>()
  const mockLocalStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  }
  const classes = new Set<string>()
  const attributes = new Map<string, string>()
  const documentElement = {
    classList: {
      add: (...cls: string[]) => cls.forEach((c) => classes.add(c)),
      remove: (...cls: string[]) => cls.forEach((c) => classes.delete(c)),
      contains: (c: string) => classes.has(c),
    },
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    getAttribute: (name: string) => attributes.get(name) ?? null,
    removeAttribute: (name: string) => attributes.delete(name),
    style: {} as Record<string, string>,
  }

  // @ts-expect-error mocking environment
  globalThis.window = globalThis
  // @ts-expect-error mocking environment
  globalThis.localStorage = mockLocalStorage
  // @ts-expect-error mocking environment
  globalThis.document = { documentElement }
}

describe('Theme management', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove(
      'light',
      'dark',
      'glacier-dark',
      'legacy-light',
      'legacy-dark',
    )
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
  })

  it('defines Glacier Dark as the first theme and labels it properly', () => {
    expect(THEMES['glacier-dark']).toEqual({
      label: 'Glacier Dark',
      type: 'dark',
    })
    expect(THEMES['legacy-light']).toEqual({
      label: 'Legacy Light',
      type: 'light',
    })
    expect(THEMES['legacy-dark']).toEqual({
      label: 'Legacy Dark',
      type: 'dark',
    })
  })

  it('returns glacier-dark as default stored mode when localStorage is empty', () => {
    expect(getStoredMode()).toBe('glacier-dark')
  })

  it('retrieves valid theme modes from localStorage', () => {
    localStorage.setItem('theme', 'legacy-light')
    expect(getStoredMode()).toBe('legacy-light')

    localStorage.setItem('theme', 'legacy-dark')
    expect(getStoredMode()).toBe('legacy-dark')

    localStorage.setItem('theme', 'glacier-dark')
    expect(getStoredMode()).toBe('glacier-dark')
  })

  it('migrates legacy light and dark values correctly', () => {
    localStorage.setItem('theme', 'light')
    expect(getStoredMode()).toBe('legacy-light')

    localStorage.setItem('theme', 'dark')
    expect(getStoredMode()).toBe('legacy-dark')
  })

  it('falls back to glacier-dark for invalid values', () => {
    localStorage.setItem('theme', 'invalid-theme')
    expect(getStoredMode()).toBe('glacier-dark')
  })

  it('applies glacier-dark mode to documentElement correctly', () => {
    applyThemeMode('glacier-dark')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('glacier-dark')).toBe(
      true,
    )
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'glacier-dark',
    )
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('switches between themes cleanly', () => {
    applyThemeMode('glacier-dark')
    applyThemeMode('legacy-light')

    expect(document.documentElement.classList.contains('glacier-dark')).toBe(
      false,
    )
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('legacy-light')).toBe(
      true,
    )
    expect(document.documentElement.getAttribute('data-theme')).toBe(
      'legacy-light',
    )
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('returns correct theme type for each theme mode', () => {
    expect(getThemeType('glacier-dark')).toBe('dark')
    expect(getThemeType('legacy-dark')).toBe('dark')
    expect(getThemeType('legacy-light')).toBe('light')
  })
})

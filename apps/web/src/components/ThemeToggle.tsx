import { useThemeStore } from '@/stores/theme'
import { cn } from '@workspace/ui/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sun01Icon, Moon02Icon } from '@hugeicons/core-free-icons'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md'
}

/**
 * Small two-state pill toggle. Sun = light, Moon = dark.
 * Styled like Lovable's toggle but using the app's current theme store.
 */
export default function ThemeToggle({
  className,
  size = 'md',
}: ThemeToggleProps) {
  const { mode, setMode } = useThemeStore()
  const isDark = mode === 'dark'

  const toggleMode = () => {
    setMode(isDark ? 'light' : 'dark')
  }

  const label = `Theme mode: ${mode}. Click to switch mode.`

  const dims = size === 'sm' ? 'h-7 w-[3.25rem] p-0.5' : 'h-8 w-[3.75rem] p-1'
  const knob = 'h-6 w-6'
  const translation =
    size === 'sm' ? 'translate-x-[1.5rem]' : 'translate-x-[1.75rem]'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={toggleMode}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full border border-gold/40 bg-felt-deep/60 transition-colors hover:border-gold/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-felt-deep cursor-pointer',
        dims,
        className,
      )}
    >
      {/* Track icons */}
      <HugeiconsIcon
        icon={Sun01Icon}
        className={cn(
          'absolute left-1.5 h-3.5 w-3.5 transition-opacity',
          isDark ? 'opacity-40 text-gold/70' : 'opacity-0',
        )}
        strokeWidth={2}
      />
      <HugeiconsIcon
        icon={Moon02Icon}
        className={cn(
          'absolute right-1.5 h-3.5 w-3.5 transition-opacity',
          isDark ? 'opacity-0' : 'opacity-40 text-gold/70',
        )}
        strokeWidth={2}
      />
      {/* Knob */}
      <span
        className={cn(
          'relative z-10 grid place-items-center rounded-full bg-linear-to-br from-gold-soft via-gold to-gold-deep text-felt-deep shadow-card transition-transform duration-300',
          knob,
          isDark ? 'translate-x-0' : translation,
        )}
      >
        <HugeiconsIcon
          icon={isDark ? Moon02Icon : Sun01Icon}
          className="h-3.5 w-3.5"
          strokeWidth={2.25}
        />
      </span>
    </button>
  )
}

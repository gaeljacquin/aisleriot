import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@workspace/ui/lib/utils'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/lib/theme'
import BackLink from '@/components/BackLink'

export const Route = createFileRoute('/settings')({ component: Settings })

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'auto', label: 'System' },
  { value: 'dark', label: 'Dark' },
]

function ThemeToggleGroup() {
  const { mode, setMode } = useThemeStore()

  return (
    <div role="group" aria-label="Theme" className="flex w-fit overflow-hidden rounded-lg border border-border">
      {themeOptions.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setMode(value)}
          aria-pressed={mode === value}
          className={cn(
            'px-5 py-2 text-sm font-medium transition-colors',
            mode === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-muted',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function Settings() {
  return (
    <main className="flex h-full flex-col px-6 py-10">
      <div className="mb-10">
        <BackLink />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-sm space-y-10">
          <h1 className="text-center text-3xl font-bold text-foreground">Settings</h1>

          <section className="space-y-3">
            <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Appearance
            </h2>
            <div className="flex justify-center">
              <ThemeToggleGroup />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

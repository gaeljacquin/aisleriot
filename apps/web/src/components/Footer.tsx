import { appInfo } from '@workspace/constants'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@workspace/ui/components/toggle-group'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/lib/theme'

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'auto', label: 'System' },
  { value: 'dark', label: 'Dark' },
]

export default function Footer() {
  const { mode, setMode } = useThemeStore()
  const currentYear = new Date().getFullYear()

  function handleValueChange(vals: string[]) {
    const next = vals[0]
    if (next === 'light' || next === 'dark' || next === 'auto') setMode(next)
  }

  return (
    <footer className="container mx-auto px-4 py-5">
      <div className="flex flex-row items-center justify-evenly gap-4 text-center text-sm text-muted-foreground">
        <p>
          &copy; 2026{' '}
          {currentYear > 2026 ? <span>- {currentYear} </span> : null}
          <a
            href={`${appInfo.authorUrl}`}
            target="_blank"
            className="text-primary/90 hover:text-primary hover:underline"
          >
            {appInfo.author}
          </a>
          . All rights reserved.
        </p>
        <ToggleGroup
          value={[mode]}
          onValueChange={handleValueChange}
          variant="outline"
        >
          {themeOptions.map(({ value, label }) => (
            <ToggleGroupItem key={value} value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </footer>
  )
}

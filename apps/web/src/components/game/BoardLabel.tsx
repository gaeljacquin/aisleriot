import { cn } from '@workspace/ui/lib/utils'
import { useDevModeStore } from '#/stores/dev-mode'

interface BoardLabelProps {
  label: string
  className?: string
  color?: 'gold' | 'cream'
}

export function BoardLabel({
  label,
  className,
  color = 'cream',
}: BoardLabelProps) {
  const { isDevMode } = useDevModeStore()

  const colorClasses = {
    gold: 'text-gold',
    cream: 'text-cream-dim',
  }

  return (
    <div
      className={cn(
        'text-[10px] uppercase tracking-[0.25em] transition-opacity duration-200 pointer-events-none select-none flex items-center justify-center leading-none',
        colorClasses[color],
        isDevMode ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {label}
    </div>
  )
}

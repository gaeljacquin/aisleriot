import { cn } from '@workspace/ui/lib/utils'
import type { PileRole } from '#/lib/types'

interface CardSlotProps {
  role: PileRole
  label?: string
  className?: string
}

export default function CardSlot({
  role: _role,
  label,
  className,
}: CardSlotProps) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-green-700 bg-green-900',
        className,
      )}
      style={{
        width: 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
      aria-label="empty card slot"
    >
      {label && (
        <span
          className={cn(
            'font-display tracking-wide uppercase text-green-600 pointer-events-none select-none',
          )}
        >
          {label}
        </span>
      )}
    </div>
  )
}

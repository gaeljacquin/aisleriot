import { cn } from '@workspace/ui/lib/utils'
import type { PileRole } from '#/lib/types'

interface CardSlotProps {
  role: PileRole
  className?: string
}

export default function CardSlot({ role: _role, className }: CardSlotProps) {
  return (
    <div
      className={cn(
        'h-28 w-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600',
        className,
      )}
      aria-label="empty card slot"
    />
  )
}

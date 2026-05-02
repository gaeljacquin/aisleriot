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
        'h-40 w-28 rounded-lg border-2 border-dashed border-green-700 bg-green-900',
        className,
      )}
      aria-label="empty card slot"
    />
  )
}

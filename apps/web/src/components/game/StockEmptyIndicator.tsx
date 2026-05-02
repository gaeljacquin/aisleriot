import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from './CardSlot'

interface StockEmptyIndicatorProps {
  canRecycle: boolean
  onClick?: () => void
}

/**
 * Shown in place of the stock pile when it is empty.
 *
 * - canRecycle: green circle border, clickable
 * - !canRecycle: red X, not clickable
 */
export default function StockEmptyIndicator({
  canRecycle,
  onClick,
}: StockEmptyIndicatorProps) {
  return (
    <div
      className={cn(
        'relative h-40 w-28 rounded-lg transition-colors',
        canRecycle
          ? 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-950/40'
          : 'hover:bg-red-100 dark:hover:bg-red-950/40',
      )}
      onClick={canRecycle ? onClick : undefined}
      role={canRecycle ? 'button' : undefined}
      aria-label={canRecycle ? 'Recycle waste to stock' : 'No more recycles'}
    >
      <CardSlot role="stock" />

      {canRecycle ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-green-500" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={40}
            className="text-red-500"
          />
        </div>
      )}
    </div>
  )
}

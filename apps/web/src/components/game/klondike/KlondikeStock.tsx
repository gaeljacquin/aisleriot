import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'

interface KlondikeStockProps {
  stockCount: number
  stockEmpty: boolean
  canRedeal: boolean
  onClick: () => void
}

/**
 * The stock pile.
 *
 * - Stock has cards: show face-down card back (clickable to flip)
 * - Stock empty + canRedeal: green-border circle; light green bg on hover; click to recycle
 * - Stock empty + !canRedeal: red X; light red bg on hover; click is a no-op
 */
export default function KlondikeStock({
  stockCount,
  stockEmpty,
  canRedeal,
  onClick,
}: KlondikeStockProps) {
  if (!stockEmpty && stockCount > 0) {
    return (
      <div
        className="cursor-pointer"
        onClick={onClick}
        role="button"
        aria-label={`Stock pile, ${stockCount} cards remaining`}
      >
        <Card suit="spades" rank="A" faceUp={false} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative h-28 w-20 cursor-pointer rounded-lg transition-colors',
        canRedeal
          ? 'hover:bg-green-100 dark:hover:bg-green-950/40'
          : 'hover:bg-red-100 dark:hover:bg-red-950/40',
      )}
      onClick={canRedeal ? onClick : undefined}
      role={canRedeal ? 'button' : undefined}
      aria-label={canRedeal ? 'Recycle waste to stock' : 'No more recycles'}
    >
      <CardSlot role="stock" />

      {canRedeal ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-green-500" />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <HugeiconsIcon icon={Cancel01Icon} size={32} className="text-red-500" />
        </div>
      )}
    </div>
  )
}

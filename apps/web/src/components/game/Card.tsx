import { cn } from '@workspace/ui/lib/utils'
import type { Suit, Rank } from '#/lib/types'
import CardPrimitive from './CardPrimitive'

interface CardProps {
  suit: Suit
  rank: Rank
  faceUp: boolean
  highlighted?: boolean
  onClick?: () => void
  className?: string
}

export default function Card({
  suit,
  rank,
  faceUp,
  highlighted,
  onClick,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'relative flex h-40 w-28 select-none flex-col rounded-lg transition-all duration-200',
        highlighted &&
          'ring-4 ring-amber-400 dark:ring-amber-300 ring-offset-2',
        onClick && 'cursor-pointer hover:brightness-105 active:scale-95',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={faceUp ? `${rank} of ${suit}` : 'Face-down card'}
    >
      <CardPrimitive
        suit={suit}
        rank={rank}
        faceUp={faceUp}
        className={cn(
          'h-full w-full overflow-hidden rounded-lg border-2 border-slate-800',
          faceUp ? 'bg-slate-800 shadow-sm' : '',
        )}
      />
    </div>
  )
}

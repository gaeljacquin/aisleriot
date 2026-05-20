import { Card } from '../index'
import type { Card as CardType } from '#/lib/types'
import { cn } from '@workspace/ui/lib/utils'

interface SimpleSimonCardProps {
  card: CardType
  isHidden?: boolean
  className?: string
}

export default function SimpleSimonCard({
  card,
  isHidden,
  className,
}: SimpleSimonCardProps) {
  return (
    <div
      className={cn(
        'transition-opacity duration-200',
        isHidden && 'opacity-0 pointer-events-none',
        className,
      )}
    >
      <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
    </div>
  )
}

import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import type { Card as CardType } from '#/lib/types'

interface FreeCellCardProps {
  card: CardType
  isHidden?: boolean
  onDoubleClick?: () => void
  className?: string
}

export default function FreeCellCard({
  card,
  isHidden,
  onDoubleClick,
  className,
}: FreeCellCardProps) {
  return (
    <div
      className={cn(
        'transition-opacity',
        isHidden && 'opacity-0',
        className,
      )}
      onDoubleClick={onDoubleClick}
    >
      <Card
        suit={card.suit}
        rank={card.rank}
        faceUp={card.faceUp}
      />
    </div>
  )
}

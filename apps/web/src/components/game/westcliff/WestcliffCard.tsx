import { useDraggable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import type {
  DraggableCardData,
  WestcliffTableauId,
  WestcliffFoundationId,
} from '#/lib/games/westcliff'
import type { Card as CardType } from '#/lib/types'

interface WestcliffCardProps {
  card: CardType
  pileId: WestcliffTableauId | WestcliffFoundationId | 'waste'
  fromIndex: number
  dragCards: CardType[]
  isHidden?: boolean
  onDoubleClick?: () => void
  className?: string
}

export default function WestcliffCard({
  card,
  pileId,
  fromIndex,
  dragCards,
  isHidden,
  onDoubleClick,
  className,
}: WestcliffCardProps) {
  const draggableData: DraggableCardData = {
    type: 'card',
    cards: dragCards,
    pileId,
    fromIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${pileId}-${fromIndex}`,
    data: draggableData,
    disabled: !card.faceUp,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'touch-none',
        (isDragging || isHidden) && 'opacity-0',
        className,
      )}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick?.()
      }}
    >
      <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
    </div>
  )
}

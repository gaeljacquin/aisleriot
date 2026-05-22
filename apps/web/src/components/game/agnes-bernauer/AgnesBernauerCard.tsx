import { useDraggable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import type { Card as CardType } from '#/lib/types'
import type {
  AgnesBernauerPileId,
  DraggableCardData,
} from '#/lib/games/agnes-bernauer'

interface AgnesBernauerCardProps {
  card: CardType
  pileId: AgnesBernauerPileId
  fromIndex: number
  /** The sequence of cards being dragged starting from this card */
  dragCards: CardType[]
  isHidden?: boolean
  disabled?: boolean
  onDoubleClick?: () => void
  className?: string
}

export default function AgnesBernauerCard({
  card,
  pileId,
  fromIndex,
  dragCards,
  isHidden,
  disabled,
  onDoubleClick,
  className,
}: AgnesBernauerCardProps) {
  const draggableData: DraggableCardData = {
    type: 'card',
    cards: dragCards,
    pileId: pileId as any,
    fromIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${card.id}-${pileId}-${fromIndex}`,
    data: draggableData,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDoubleClick={onDoubleClick}
      className={cn(
        'h-full w-full rounded-lg transition-shadow',
        isDragging || isHidden ? 'opacity-0' : 'opacity-100',
        !isDragging && 'cursor-grab active:cursor-grabbing',
        className,
      )}
    >
      <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
    </div>
  )
}

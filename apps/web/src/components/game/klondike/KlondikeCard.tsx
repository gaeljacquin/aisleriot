import { useDraggable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import type { DraggableCardData, KlondikeTableauId, KlondikeFoundationId } from '#/lib/games/klondike'
import type { Card as CardType } from '#/lib/types'

interface KlondikeCardProps {
  card: CardType
  pileId: KlondikeTableauId | KlondikeFoundationId | 'waste'
  fromIndex: number
  /** All cards in the draggable sequence (length 1 for single-card drags) */
  dragCards: CardType[]
  isHidden?: boolean
  onDoubleClick?: () => void
  className?: string
}

/**
 * A draggable card wrapper for Klondike.
 * Attaches dnd-kit drag data and hides itself when being dragged
 * (the DragOverlay takes over visually).
 */
export default function KlondikeCard({
  card,
  pileId,
  fromIndex,
  dragCards,
  isHidden,
  onDoubleClick,
  className,
}: KlondikeCardProps) {
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

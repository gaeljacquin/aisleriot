import { useDroppable, useDraggable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import FreeCellCard from './FreeCellCard'
import type {
  FreeCellPileId,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/freecell'
import type { Card } from '#/lib/types'

interface FreeCellFreeCellProps {
  id: FreeCellPileId
  card: Card | null
  onDoubleClick?: (pileId: FreeCellPileId) => void
}

function OccupiedFreeCell({
  id,
  card,
  onDoubleClick,
}: {
  id: FreeCellPileId
  card: Card
  onDoubleClick?: (pileId: FreeCellPileId) => void
}) {
  const draggableData: DraggableCardData = {
    type: 'card',
    cards: [card],
    fromPileId: id,
    fromIndex: 0,
  }

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `draggable-${id}`,
    data: draggableData,
  })

  const [isDragging, setIsDragging] = useState(false)

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as DraggableCardData | undefined
      if (data?.type === 'card' && data.fromPileId === id) {
        setIsDragging(true)
      }
    },
    onDragEnd() {
      setIsDragging(false)
    },
    onDragCancel() {
      setIsDragging(false)
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-none"
      onDoubleClick={onDoubleClick ? () => onDoubleClick(id) : undefined}
    >
      <FreeCellCard card={card} isHidden={isDragging} />
    </div>
  )
}

export default function FreeCellFreeCell({
  id,
  card,
  onDoubleClick,
}: FreeCellFreeCellProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'freecell',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
    >
      <CardSlot role="freecell" />
      {card && (
        <div className="absolute inset-0">
          <OccupiedFreeCell id={id} card={card} onDoubleClick={onDoubleClick} />
        </div>
      )}
    </div>
  )
}

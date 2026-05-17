import { useDroppable, useDraggable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import { GrandfathersClockCard } from './GrandfathersClockCard'
import type {
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/grandfathers-clock'
import type { Card } from '#/lib/types'

interface GrandfathersClockColumnProps {
  id: string
  cards: Card[]
  onDoubleClick?: (pileId: string) => void
}

function DraggableCard({
  pileId,
  card,
  cardIndex,
  top,
  zIndex,
  onDoubleClick,
}: {
  pileId: string
  card: Card
  cardIndex: number
  top: number | string
  zIndex: number
  onDoubleClick?: (pileId: string) => void
}) {
  const draggableData: DraggableCardData = {
    type: 'card',
    cards: [card],
    fromPileId: pileId,
    fromIndex: cardIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${pileId}-${cardIndex}`,
    data: draggableData,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'touch-none absolute',
        isDragging && 'opacity-0 pointer-events-none',
      )}
      style={{ top, left: 0, zIndex }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick?.(pileId)
      }}
    >
      <GrandfathersClockCard card={card} />
    </div>
  )
}

export default function GrandfathersClockColumn({
  id,
  cards,
  onDoubleClick,
}: GrandfathersClockColumnProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'tableau',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
  })

  const containerHeight =
    cards.length === 0
      ? 'var(--card-height)'
      : `calc(((${cards.length} - 1) * var(--card-offset-tableau)) + var(--card-height))`

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{
        width: 'var(--card-width)',
        minHeight: containerHeight,
      }}
    >
      <CardSlot role="tableau" className="absolute top-0 left-0" />
      {cards.length > 0 && (
        <>
          {cards.map((card, i) => {
            const isLast = i === cards.length - 1
            if (!isLast) {
              return (
                <div
                  key={card.id}
                  className="absolute"
                  style={{
                    top: `calc(${i} * var(--card-offset-tableau))`,
                    left: 0,
                    zIndex: i,
                  }}
                >
                  <GrandfathersClockCard card={card} />
                </div>
              )
            }
            return (
              <DraggableCard
                key={card.id}
                pileId={id}
                card={card}
                cardIndex={i}
                top={`calc(${i} * var(--card-offset-tableau))`}
                zIndex={i}
                onDoubleClick={onDoubleClick}
              />
            )
          })}
        </>
      )}
    </div>
  )
}

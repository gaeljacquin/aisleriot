import { useDroppable, useDraggable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import FreeCellCard from './FreeCellCard'
import type { FreeCellPileId, DraggableCardData, DroppableZoneData } from '#/lib/games/freecell'
import type { Card } from '#/lib/types'

const CARD_OFFSET = 36

interface FreeCellColumnProps {
  id: FreeCellPileId
  cards: Card[]
  draggableFrom: number
  onDoubleClick?: (pileId: FreeCellPileId) => void
}

function DraggableCard({
  pileId,
  card,
  cardIndex,
  allCards,
  top,
  zIndex,
  hiddenFromIndex,
  onDoubleClick,
}: {
  pileId: FreeCellPileId
  card: Card
  cardIndex: number
  allCards: Card[]
  top: number
  zIndex: number
  hiddenFromIndex: number | null // if set, cards at this index and above are hidden
  onDoubleClick?: (pileId: FreeCellPileId) => void
}) {
  const dragCards = allCards.slice(cardIndex)

  const draggableData: DraggableCardData = {
    type: 'card',
    cards: dragCards,
    fromPileId: pileId,
    fromIndex: cardIndex,
  }

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${pileId}-${cardIndex}`,
    data: draggableData,
  })

  // Hide this card if it's part of a sequence being dragged from above
  const isHidden =
    isDragging ||
    (hiddenFromIndex !== null && cardIndex >= hiddenFromIndex)

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-none absolute"
      style={{ top, left: 0, zIndex }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick?.(pileId)
      }}
    >
      <FreeCellCard card={card} isHidden={isHidden} />
    </div>
  )
}

export default function FreeCellColumn({
  id,
  cards,
  draggableFrom,
  onDoubleClick,
}: FreeCellColumnProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'tableau',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
  })

  // Track which card index in this column is currently being dragged
  // so we can hide all cards from that index downward
  const [activeDragFrom, setActiveDragFrom] = useState<number | null>(null)

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as DraggableCardData | undefined
      if (data?.type === 'card' && data.fromPileId === id) {
        setActiveDragFrom(data.fromIndex)
      }
    },
    onDragEnd() {
      setActiveDragFrom(null)
    },
    onDragCancel() {
      setActiveDragFrom(null)
    },
  })

  const CARD_HEIGHT = 112
  const containerHeight =
    cards.length === 0
      ? CARD_HEIGHT
      : (cards.length - 1) * CARD_OFFSET + CARD_HEIGHT

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative w-20 rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{ minHeight: containerHeight }}
    >
      {cards.length === 0 ? (
        <CardSlot role="tableau" />
      ) : (
        <>
          {/* Non-draggable cards */}
          {cards.slice(0, draggableFrom).map((card, i) => (
            <div
              key={card.id}
              className="absolute"
              style={{ top: i * CARD_OFFSET, left: 0, zIndex: i }}
            >
              <FreeCellCard card={card} />
            </div>
          ))}

          {/* Draggable cards */}
          {cards.slice(draggableFrom).map((card, relIdx) => {
            const absIdx = draggableFrom + relIdx
            return (
              <DraggableCard
                key={card.id}
                pileId={id}
                card={card}
                cardIndex={absIdx}
                allCards={cards}
                top={absIdx * CARD_OFFSET}
                zIndex={absIdx}
                hiddenFromIndex={activeDragFrom}
                onDoubleClick={
                  absIdx === cards.length - 1 ? onDoubleClick : undefined
                }
              />
            )
          })}
        </>
      )}
    </div>
  )
}

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

const CARD_OFFSET = 48

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
  top: number | string
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
    isDragging || (hiddenFromIndex !== null && cardIndex >= hiddenFromIndex)

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

  const containerHeight =
    cards.length === 0
      ? 'var(--card-height, 10rem)'
      : `calc(((${cards.length} - 1) * var(--card-offset-free, 3rem)) + var(--card-height, 10rem))`

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{
        width: 'var(--card-width, 7rem)',
        minHeight: containerHeight,
      }}
    >
      <CardSlot role="tableau" className="absolute top-0 left-0" />
      {cards.length > 0 && (
        <>
          {/* Non-draggable cards */}
          {cards.slice(0, draggableFrom).map((card, i) => (
            <div
              key={card.id}
              className="absolute"
              style={{
                top: `calc(${i} * var(--card-offset-free, 3rem))`,
                left: 0,
                zIndex: i,
              }}
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
                top={`calc(${absIdx} * var(--card-offset-free, 3rem))`}
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

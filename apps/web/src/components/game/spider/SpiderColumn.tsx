import { useDroppable, useDraggable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import SpiderCard from './SpiderCard'
import type {
  SpiderTableauId,
  DraggableCardData,
  DroppableZoneData,
} from '#/lib/games/spider'
import type { Card } from '#/lib/types'

interface SpiderColumnProps {
  id: SpiderTableauId
  cards: Card[]
  draggableFrom: number
}

function DraggableCard({
  pileId,
  card,
  cardIndex,
  allCards,
  top,
  zIndex,
  hiddenFromIndex,
}: {
  pileId: SpiderTableauId
  card: Card
  cardIndex: number
  allCards: Card[]
  top: number | string
  zIndex: number
  hiddenFromIndex: number | null
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

  const isHidden =
    isDragging || (hiddenFromIndex !== null && cardIndex >= hiddenFromIndex)

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="touch-none absolute w-full"
      style={{ top, left: 0, zIndex }}
    >
      <SpiderCard card={card} isHidden={isHidden} />
    </div>
  )
}

export default function SpiderColumn({
  id,
  cards,
  draggableFrom,
}: SpiderColumnProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'tableau',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
  })

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
      : `calc(((${cards.length} - 1) * var(--card-offset-spider, 2rem)) + var(--card-height, 10rem))`

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
      <CardSlot role="tableau" showLogo className="absolute top-0 left-0" />
      {cards.length > 0 && (
        <>
          {cards.slice(0, draggableFrom).map((card, i) => (
            <div
              key={card.id}
              className="absolute w-full"
              style={{
                top: `calc(${i} * var(--card-offset-spider, 2rem))`,
                left: 0,
                zIndex: i,
              }}
            >
              <SpiderCard card={card} />
            </div>
          ))}

          {cards.slice(draggableFrom).map((card, relIdx) => {
            const absIdx = draggableFrom + relIdx
            return (
              <DraggableCard
                key={card.id}
                pileId={id}
                card={card}
                cardIndex={absIdx}
                allCards={cards}
                top={`calc(${absIdx} * var(--card-offset-spider, 2rem))`}
                zIndex={absIdx}
                hiddenFromIndex={activeDragFrom}
              />
            )
          })}
        </>
      )}
    </div>
  )
}

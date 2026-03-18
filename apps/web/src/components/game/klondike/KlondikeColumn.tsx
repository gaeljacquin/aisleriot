import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import type { KlondikeTableauId, DraggableCardData, DroppableZoneData } from '#/lib/games/klondike'
import type { Card as CardType } from '#/lib/types'

const CARD_OFFSET = 28 // px between stacked cards vertically
const CARD_HEIGHT = 112 // h-28 = 7rem

interface KlondikeColumnProps {
  id: KlondikeTableauId
  cards: CardType[]
  draggableFrom: number
  onDoubleClick?: (pileId: KlondikeTableauId) => void
}

export default function KlondikeColumn({
  id,
  cards,
  draggableFrom,
  onDoubleClick,
}: KlondikeColumnProps) {
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
      if (data?.type === 'card' && data.pileId === id) {
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
          {/* Non-draggable face-down cards */}
          {cards.slice(0, draggableFrom).map((card, i) => (
            <div
              key={card.id}
              className="absolute"
              style={{ top: i * CARD_OFFSET, left: 0, zIndex: i }}
            >
              <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
            </div>
          ))}

          {/* Draggable face-up cards */}
          {cards.slice(draggableFrom).map((card, relIdx) => {
            const absIdx = draggableFrom + relIdx
            const isHidden = activeDragFrom !== null && absIdx >= activeDragFrom
            const dragCards = cards.slice(absIdx)

            return (
              <div
                key={card.id}
                className="absolute"
                style={{ top: absIdx * CARD_OFFSET, left: 0, zIndex: absIdx }}
              >
                <KlondikeCard
                  card={card}
                  pileId={id}
                  fromIndex={absIdx}
                  dragCards={dragCards}
                  isHidden={isHidden}
                  onDoubleClick={
                    absIdx === cards.length - 1
                      ? () => onDoubleClick?.(id)
                      : undefined
                  }
                />
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

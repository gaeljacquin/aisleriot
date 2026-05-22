import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import AgnesBernauerCard from './AgnesBernauerCard'
import AgnesBernauerFoundationSlot from './AgnesBernauerFoundationSlot'
import type {
  AgnesBernauerFoundationId,
  DroppableZoneData,
  DraggableCardData,
} from '#/lib/games/agnes-bernauer'
import type { Card as CardType, Suit, Rank } from '#/lib/types'

interface AgnesBernauerFoundationProps {
  id: AgnesBernauerFoundationId
  cards: CardType[]
  suit: Suit
  baseRank: Rank
  draggable?: boolean
  disabled?: boolean
}

export default function AgnesBernauerFoundation({
  id,
  cards,
  suit,
  baseRank,
  draggable = true,
  disabled,
}: AgnesBernauerFoundationProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'foundation',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
    disabled,
  })

  const [isDraggingTop, setIsDraggingTop] = useState(false)

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as DraggableCardData | undefined
      if (data?.type === 'card' && data.pileId === id) {
        setIsDraggingTop(true)
      }
    },
    onDragEnd() {
      setIsDraggingTop(false)
    },
    onDragCancel() {
      setIsDraggingTop(false)
    },
  })

  const topCard = cards.length > 0 ? cards[cards.length - 1] : null
  const beneathCard = cards.length > 1 ? cards[cards.length - 2] : null

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{
        width: 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
    >
      <AgnesBernauerFoundationSlot suit={suit} baseRank={baseRank} />

      {isDraggingTop && beneathCard && (
        <div className="absolute inset-0">
          <Card
            suit={beneathCard.suit}
            rank={beneathCard.rank}
            faceUp={beneathCard.faceUp}
          />
        </div>
      )}

      {topCard && (
        <div className="absolute inset-0">
          {draggable ? (
            <AgnesBernauerCard
              card={topCard}
              pileId={id}
              fromIndex={cards.length - 1}
              dragCards={[topCard]}
              isHidden={isDraggingTop}
              disabled={disabled}
            />
          ) : (
            <Card
              suit={topCard.suit}
              rank={topCard.rank}
              faceUp={topCard.faceUp}
            />
          )}
        </div>
      )}
    </div>
  )
}

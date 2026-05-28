import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import AgnesBernauerCard from './AgnesBernauerCard'
import CardSlot from '../CardSlot'
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

  // const _topCard = cards.length > 0 ? cards[cards.length - 1] : null
  // const _beneathCard = cards.length > 1 ? cards[cards.length - 2] : null

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
      <CardSlot
        role="foundation"
        suit={suit}
        baseRank={baseRank}
        className="absolute inset-0"
      />

      {cards.map((card, index) => {
        const isTop = index === cards.length - 1
        const isDraggingThis = isTop && isDraggingTop

        return (
          <div key={card.id} className="absolute inset-0">
            {isTop && draggable ? (
              <AgnesBernauerCard
                card={card}
                pileId={id}
                fromIndex={index}
                dragCards={[card]}
                isHidden={isDraggingThis}
                disabled={disabled}
              />
            ) : (
              <Card
                suit={card.suit}
                rank={card.rank}
                faceUp={card.faceUp}
                className={isDraggingThis ? 'opacity-0' : ''}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import WestcliffCard from './WestcliffCard'
import { getVariant } from '@workspace/constants'
import type {
  WestcliffFoundationId,
  DroppableZoneData,
  DraggableCardData,
} from '#/lib/games/westcliff'
import type { Card as CardType, Suit } from '#/lib/types'

interface WestcliffFoundationProps {
  id: WestcliffFoundationId
  cards: CardType[]
  suit: Suit
  draggable?: boolean
}

export default function WestcliffFoundation({
  id,
  cards,
  suit,
  draggable = true,
}: WestcliffFoundationProps) {
  const variant = getVariant('westcliff')
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'foundation',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
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
        baseRank={variant.foundation_base_rank}
      />

      {cards.map((card, index) => {
        const isTop = index === cards.length - 1
        const isDraggingThis = isTop && isDraggingTop

        return (
          <div key={card.id} className="absolute inset-0">
            {isTop && draggable ? (
              <WestcliffCard
                card={card}
                pileId={id}
                fromIndex={index}
                dragCards={[card]}
                isHidden={isDraggingThis}
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

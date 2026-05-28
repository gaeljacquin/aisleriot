import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import { getVariant } from '@workspace/constants'
import type {
  KlondikeFoundationId,
  DroppableZoneData,
  DraggableCardData,
} from '#/lib/games/klondike'
import type { Card as CardType, Suit } from '#/lib/types'

interface KlondikeFoundationProps {
  id: KlondikeFoundationId
  cards: CardType[]
  suit: Suit
  /** Allow dragging the top card back to tableau */
  draggable?: boolean
}

export default function KlondikeFoundation({
  id,
  cards,
  suit,
  draggable = true,
}: KlondikeFoundationProps) {
  const variant = getVariant('klondike-draw-1')
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
      {/* Always-visible empty slot with suit hint and base rank */}
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
              <KlondikeCard
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

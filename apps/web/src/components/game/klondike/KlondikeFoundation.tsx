import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import type {
  KlondikeFoundationId,
  DroppableZoneData,
  DraggableCardData,
} from '#/lib/games/klondike'
import type { Card as CardType, Suit } from '#/lib/types'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

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

  const topCard = cards.length > 0 ? cards[cards.length - 1] : null
  const beneathCard = cards.length > 1 ? cards[cards.length - 2] : null
  const isRed = suit === 'hearts' || suit === 'diamonds'

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative h-28 w-20 rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
    >
      {/* Always-visible empty slot with suit hint */}
      <CardSlot role="foundation" />
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-3xl opacity-60',
          isRed ? 'text-red-300' : 'text-slate-300',
        )}
      >
        {SUIT_SYMBOLS[suit]}
      </div>

      {/* Card beneath top — shown while the top card is being dragged */}
      {isDraggingTop && beneathCard && (
        <div className="absolute inset-0">
          <Card
            suit={beneathCard.suit}
            rank={beneathCard.rank}
            faceUp={beneathCard.faceUp}
          />
        </div>
      )}

      {/* Top card — stays mounted (opacity-0 when dragging) so drag stays alive */}
      {topCard && (
        <div className="absolute inset-0">
          {draggable ? (
            <KlondikeCard
              card={topCard}
              pileId={id}
              fromIndex={cards.length - 1}
              dragCards={[topCard]}
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

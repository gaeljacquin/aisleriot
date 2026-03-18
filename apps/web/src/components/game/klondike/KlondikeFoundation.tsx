import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import type { KlondikeFoundationId, DroppableZoneData } from '#/lib/games/klondike'
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

  const topCard = cards.length > 0 ? cards[cards.length - 1] : null
  const isRed = suit === 'hearts' || suit === 'diamonds'

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
    >
      {topCard ? (
        draggable ? (
          <KlondikeCard
            card={topCard}
            pileId={id}
            fromIndex={cards.length - 1}
            dragCards={[topCard]}
          />
        ) : (
          <Card suit={topCard.suit} rank={topCard.rank} faceUp={topCard.faceUp} />
        )
      ) : (
        <div className="relative h-28 w-20">
          <CardSlot role="foundation" />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 flex items-center justify-center text-3xl opacity-30',
              isRed ? 'text-red-500' : 'text-slate-700 dark:text-slate-300',
            )}
          >
            {SUIT_SYMBOLS[suit]}
          </div>
        </div>
      )}
    </div>
  )
}

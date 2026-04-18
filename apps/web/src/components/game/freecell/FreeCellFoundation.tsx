import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import type { FreeCellPileId, DroppableZoneData } from '#/lib/games/freecell'
import type { Card as CardType, Suit } from '#/lib/types'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

interface FreeCellFoundationProps {
  id: FreeCellPileId
  cards: CardType[]
  suit: Suit
}

export default function FreeCellFoundation({
  id,
  cards,
  suit,
}: FreeCellFoundationProps) {
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
        <Card suit={topCard.suit} rank={topCard.rank} faceUp={topCard.faceUp} />
      ) : (
        <div className="relative h-28 w-20">
          <CardSlot role="foundation" />
          {/* Suit hint in empty slot */}
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

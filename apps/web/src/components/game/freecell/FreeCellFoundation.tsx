import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import Card from '../Card'
import { getVariant } from '@workspace/constants'
import type { FreeCellPileId, DroppableZoneData } from '#/lib/games/freecell'
import type { Card as CardType, Suit } from '#/lib/types'

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
  const variant = getVariant('freecell')
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
      <div className="relative h-full w-full">
        <CardSlot
          role="foundation"
          suit={suit}
          baseRank={variant.foundation_base_rank}
        />
      </div>

      {topCard && (
        <div className="absolute inset-0">
          <Card
            suit={topCard.suit}
            rank={topCard.rank}
            faceUp={topCard.faceUp}
          />
        </div>
      )}
    </div>
  )
}

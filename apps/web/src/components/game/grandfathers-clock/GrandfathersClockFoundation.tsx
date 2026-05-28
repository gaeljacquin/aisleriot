import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import { GrandfathersClockCard } from './GrandfathersClockCard'
import type { DroppableZoneData } from '#/lib/games/grandfathers-clock'
import type { Card as CardType } from '#/lib/types'

interface GrandfathersClockFoundationProps {
  id: string
  cards: CardType[]
  label?: string
}

export default function GrandfathersClockFoundation({
  id,
  cards,
  label,
}: GrandfathersClockFoundationProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'foundation',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
  })

  // const _topCard = cards.length > 0 ? cards[cards.length - 1] : null

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{
        width: 'var(--card-width)',
        height: 'var(--card-height)',
      }}
    >
      <div className="relative h-full w-full">
        <CardSlot role="foundation" label={label} />
      </div>

      {cards.map((card) => (
        <div key={card.id} className="absolute inset-0">
          <GrandfathersClockCard card={card} />
        </div>
      ))}
    </div>
  )
}

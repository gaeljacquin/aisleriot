import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import CardSlot from '../CardSlot'
import SimpleSimonCard from './SimpleSimonCard'
import type {
  SimpleSimonFoundationId,
  DroppableZoneData,
} from '#/lib/games/simple-simon'
import type { Card } from '#/lib/types'

interface SimpleSimonFoundationProps {
  id: SimpleSimonFoundationId
  cards: Card[]
}

export default function SimpleSimonFoundation({
  id,
  cards,
}: SimpleSimonFoundationProps) {
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
      <CardSlot role="foundation" className="absolute inset-0" />
      {topCard && (
        <div className="absolute inset-0">
          <SimpleSimonCard card={topCard} />
        </div>
      )}
    </div>
  )
}

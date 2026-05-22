import { useDraggable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import AcmeCard from './AcmeCard'
import CardSlot from '../CardSlot'
import type { Card as CardType } from '#/lib/types'

interface AcmeReserveProps {
  reserve: CardType[]
  onDoubleClick?: () => void
  devMoveAnywhere?: boolean
}

function DraggableCard({
  pileId,
  card,
  cardIndex,
  onDoubleClick,
  isDraggable,
}: {
  pileId: string
  card: CardType
  cardIndex: number
  onDoubleClick?: () => void
  isDraggable: boolean
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${pileId}-${cardIndex}`,
    data: {
      type: 'card',
      cards: [card],
      fromPileId: pileId,
      fromIndex: cardIndex,
    },
    disabled: !isDraggable,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(isDraggable ? 'touch-none' : '')}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick?.()
      }}
    >
      <AcmeCard card={card} isHidden={isDragging} />
    </div>
  )
}

export default function AcmeReserve({
  reserve,
  onDoubleClick,
  devMoveAnywhere,
}: AcmeReserveProps) {
  return (
    <div
      className="relative"
      style={{
        width: 'var(--card-width)',
        minHeight: 'var(--card-height)',
      }}
    >
      <CardSlot role="reserve" className="absolute top-0 left-0" />
      {reserve.map((card, index) => (
        <div
          key={card.id}
          className="absolute"
          style={{
            top: `calc(${index} * var(--card-offset-free))`,
            left: 0,
            zIndex: index,
          }}
        >
          <DraggableCard
            pileId="reserve"
            card={card}
            cardIndex={index}
            isDraggable={index === reserve.length - 1 || devMoveAnywhere}
            onDoubleClick={
              index === reserve.length - 1 ? onDoubleClick : undefined
            }
          />
        </div>
      ))}
    </div>
  )
}

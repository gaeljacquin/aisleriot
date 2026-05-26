import { useDraggable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import AcmeCard from './AcmeCard'
import CardSlot from '../CardSlot'
import type { Card as CardType } from '#/lib/types'

interface AcmeWasteProps {
  waste: CardType[]
  onDoubleClick?: () => void
  devMoveAnywhere?: boolean
}

function DraggableCard({
  pileId,
  card,
  cardIndex,
  onDoubleClick,
  isDraggable = true,
}: {
  pileId: string
  card: CardType
  cardIndex: number
  onDoubleClick?: () => void
  isDraggable?: boolean
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

export default function AcmeWaste({
  waste,
  onDoubleClick,
  devMoveAnywhere,
}: AcmeWasteProps) {
  return (
    <div
      className="relative"
      style={{ width: 'var(--card-width)', height: 'var(--card-height)' }}
    >
      <CardSlot role="waste" className="absolute inset-0" />
      {waste.map((card, index) => {
        const isTop = index === waste.length - 1

        return (
          <div key={card.id} className="absolute inset-0">
            <DraggableCard
              pileId="waste"
              card={card}
              cardIndex={index}
              onDoubleClick={isTop ? onDoubleClick : undefined}
              isDraggable={isTop || !!devMoveAnywhere}
            />
          </div>
        )
      })}
    </div>
  )
}

import { useDroppable, useDraggable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import FortuneFavorCard from './FortuneFavorCard'
import CardSlot from '../CardSlot'
import type { FortuneFavorTableauEntry } from '#/lib/hooks/use-fortune-favor'
import type { Card as CardType } from '#/lib/types'

interface FortuneFavorTableauProps {
  tableau: FortuneFavorTableauEntry[]
  onDoubleClick?: (pileId: string) => void
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
  onDoubleClick?: (pileId: string) => void
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
        onDoubleClick?.(pileId)
      }}
    >
      <FortuneFavorCard card={card} isHidden={isDragging} />
    </div>
  )
}

export default function FortuneFavorTableau({
  tableau,
  onDoubleClick,
  devMoveAnywhere,
}: FortuneFavorTableauProps) {
  const row1 = tableau.slice(0, 6)
  const row2 = tableau.slice(6, 12)

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Row 1: Columns 0 - 5 */}
      <div className="flex gap-(--card-gap-free)">
        {row1.map((entry) => (
          <FortuneFavorTableauColumn
            key={entry.id}
            entry={entry}
            devMoveAnywhere={devMoveAnywhere}
            onDoubleClick={onDoubleClick}
          />
        ))}
      </div>

      {/* Row 2: Columns 6 - 11 */}
      <div className="flex gap-(--card-gap-free)">
        {row2.map((entry) => (
          <FortuneFavorTableauColumn
            key={entry.id}
            entry={entry}
            devMoveAnywhere={devMoveAnywhere}
            onDoubleClick={onDoubleClick}
          />
        ))}
      </div>
    </div>
  )
}

function FortuneFavorTableauColumn({
  entry,
  onDoubleClick,
  devMoveAnywhere,
}: {
  entry: FortuneFavorTableauEntry
  onDoubleClick?: (pileId: string) => void
  devMoveAnywhere?: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: entry.id,
    data: {
      type: 'pile',
      pileId: entry.id,
    },
  })

  const containerHeight =
    entry.cards.length === 0
      ? 'var(--card-height)'
      : `calc(((${entry.cards.length} - 1) * var(--card-offset-free)) + var(--card-height))`

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative flex flex-col',
        isOver && 'ring-2 ring-primary ring-offset-1 rounded-lg',
      )}
      style={{
        width: 'var(--card-width)',
        minHeight: containerHeight,
      }}
    >
      <CardSlot role="tableau" showLogo className="absolute top-0 left-0" />
      {entry.cards.length > 0 &&
        entry.cards.map((card, index) => (
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
              pileId={entry.id}
              card={card}
              cardIndex={index}
              isDraggable={
                index === entry.cards.length - 1 || !!devMoveAnywhere
              }
              onDoubleClick={
                index === entry.cards.length - 1 ? onDoubleClick : undefined
              }
            />
          </div>
        ))}
    </div>
  )
}

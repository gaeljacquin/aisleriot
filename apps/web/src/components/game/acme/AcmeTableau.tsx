import { useDroppable, useDraggable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import AcmeCard from './AcmeCard'
import CardSlot from '../CardSlot'
import type { AcmeTableauEntry } from '#/lib/hooks/use-acme'
import type { Card as CardType } from '#/lib/types'

interface AcmeTableauProps {
  tableau: AcmeTableauEntry[]
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
      <AcmeCard card={card} isHidden={isDragging} />
    </div>
  )
}

export default function AcmeTableau({
  tableau,
  onDoubleClick,
  devMoveAnywhere,
}: AcmeTableauProps) {
  return (
    <div className="flex gap-[var(--card-gap-free)]">
      {tableau.map((entry) => (
        <AcmeTableauColumn
          key={entry.id}
          entry={entry}
          devMoveAnywhere={devMoveAnywhere}
          onDoubleClick={onDoubleClick}
        />
      ))}
    </div>
  )
}

function AcmeTableauColumn({
  entry,
  onDoubleClick,
  devMoveAnywhere,
}: {
  entry: AcmeTableauEntry
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

  const [, setActiveDragFrom] = useState<number | null>(null)

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as any
      if (data?.type === 'card' && data.fromPileId === entry.id) {
        setActiveDragFrom(data.fromIndex)
      }
    },
    onDragEnd() {
      setActiveDragFrom(null)
    },
    onDragCancel() {
      setActiveDragFrom(null)
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative flex flex-col',
        isOver && 'ring-2 ring-primary ring-offset-1 rounded-lg',
      )}
      style={{
        width: 'var(--card-width)',
        minHeight: 'var(--card-height)',
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

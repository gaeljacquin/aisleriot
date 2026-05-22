import { useDroppable, useDndMonitor } from '@dnd-kit/core'
import { useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'
import AgnesBernauerCard from './AgnesBernauerCard'
import CardSlot from '../CardSlot'
import Card from '../Card'
import type { Card as CardType } from '#/lib/types'
import { draggableFromIndex, getNextRankDown } from '#/lib/games/agnes-bernauer'
import type {
  AgnesBernauerTableauId,
  DroppableZoneData,
  AgnesBernauerState,
  DraggableCardData,
} from '#/lib/games/agnes-bernauer'

interface AgnesBernauerColumnProps {
  id: AgnesBernauerTableauId
  cards: CardType[]
  state: AgnesBernauerState
  disabled?: boolean
  devUnlimitedMoves?: boolean
}

export default function AgnesBernauerColumn({
  id,
  cards,
  state,
  disabled,
  devUnlimitedMoves,
}: AgnesBernauerColumnProps) {
  const droppableData: DroppableZoneData = {
    type: 'pile',
    pileId: id,
    role: 'tableau',
  }

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${id}`,
    data: droppableData,
    disabled,
  })

  const [activeDragFrom, setActiveDragFrom] = useState<number | null>(null)

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as DraggableCardData | undefined
      if (data?.type === 'card' && data.pileId === id) {
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

  const dragStartIndex = draggableFromIndex(state, id)
  const emptyLabel = getNextRankDown(state.baseRank)

  const containerHeight =
    cards.length === 0
      ? 'var(--card-height, 10rem)'
      : `calc((${cards.length} - 1) * var(--card-offset, 2.5rem) + var(--card-height, 10rem))`

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{
        minHeight: containerHeight,
        width: 'var(--card-width, 7rem)',
      }}
    >
      <CardSlot
        role="tableau"
        label={emptyLabel}
        className="absolute top-0 left-0 text-[4rem] font-bold text-green-700/40"
      />

      {cards.map((card, index) => {
        const isDraggable = devUnlimitedMoves || index >= dragStartIndex
        const isHidden = activeDragFrom !== null && index >= activeDragFrom

        return (
          <div
            key={`${card.id}-${index}`}
            className="absolute w-full"
            style={{
              top: `calc(${index} * var(--card-offset, 2.5rem))`,
              zIndex: index,
            }}
          >
            {isDraggable ? (
              <AgnesBernauerCard
                card={card}
                pileId={id}
                fromIndex={index}
                dragCards={cards.slice(index)}
                isHidden={isHidden}
                disabled={disabled}
                onDoubleClick={
                  index === cards.length - 1
                    ? () => state.autoMove(id)
                    : undefined
                }
              />
            ) : (
              <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
            )}
          </div>
        )
      })}
    </div>
  )
}

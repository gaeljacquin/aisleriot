import { useState } from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import type { DraggableCardData } from '#/lib/games/klondike'
import type { Card as CardType } from '#/lib/types'

const FAN_OFFSET = 20 // px horizontal offset between fanned cards in draw-3

interface KlondikeWasteProps {
  waste: CardType[]
  drawCount: 1 | 3
  moveAnywhere?: boolean
  onDoubleClick?: () => void
}

export default function KlondikeWaste({
  waste,
  drawCount,
  moveAnywhere,
  onDoubleClick,
}: KlondikeWasteProps) {
  const [draggingFromIndex, setDraggingFromIndex] = useState<number | null>(
    null,
  )

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as DraggableCardData | undefined
      if (data?.type === 'card' && data.pileId === 'waste') {
        setDraggingFromIndex(data.fromIndex)
      }
    },
    onDragEnd() {
      setDraggingFromIndex(null)
    },
    onDragCancel() {
      setDraggingFromIndex(null)
    },
  })

  if (waste.length === 0) {
    return (
      <div className="h-28 w-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600" />
    )
  }

  if (drawCount === 1) {
    const top = waste[waste.length - 1]
    const isDragging = draggingFromIndex !== null

    return (
      <div className="relative h-28 w-20">
        {/* Card beneath — shown while dragging */}
        {isDragging && waste.length >= 2 && (
          <div className="absolute inset-0">
            <Card
              suit={waste[waste.length - 2].suit}
              rank={waste[waste.length - 2].rank}
              faceUp={waste[waste.length - 2].faceUp}
            />
          </div>
        )}
        {/* Top card — always rendered so drag stays alive; hidden via opacity when dragging */}
        <div className="absolute inset-0">
          <KlondikeCard
            card={top}
            pileId="waste"
            fromIndex={waste.length - 1}
            dragCards={[top]}
            isHidden={isDragging}
            onDoubleClick={onDoubleClick}
          />
        </div>
      </div>
    )
  }

  // Draw-3: fan of up to 3 visible cards
  // In moveAnywhere mode, all visible cards are independently draggable
  const visible = waste.slice(-3)
  const count = visible.length
  const containerWidth = 80 + (count - 1) * FAN_OFFSET

  return (
    <div
      className="relative h-28 flex-shrink-0"
      style={{ width: containerWidth }}
    >
      {visible.map((card, i) => {
        // absolute index in the full waste array
        const absIndex = waste.length - count + i
        const isTop = i === count - 1
        const isDraggingThis = draggingFromIndex === absIndex
        // card to show beneath this one while it's being dragged
        const beneathCard =
          isDraggingThis && absIndex > 0 ? waste[absIndex - 1] : null
        const left = i * FAN_OFFSET
        const isDraggable = isTop || moveAnywhere === true

        // Only show beneathCard if it's not already rendered as the previous fan card
        const showBeneath =
          beneathCard !== null && absIndex - 1 < waste.length - count

        return (
          <div
            key={card.id}
            className={cn('absolute', !isDraggable && 'pointer-events-none')}
            style={{ left, top: 0, zIndex: i }}
          >
            {/* Card beneath — shown while this card is being dragged, only if not already in fan */}
            {showBeneath && (
              <div className="absolute inset-0" style={{ zIndex: -1 }}>
                <Card
                  suit={beneathCard.suit}
                  rank={beneathCard.rank}
                  faceUp={beneathCard.faceUp}
                />
              </div>
            )}
            {isDraggable ? (
              <KlondikeCard
                card={card}
                pileId="waste"
                fromIndex={absIndex}
                dragCards={[card]}
                isHidden={isDraggingThis}
                onDoubleClick={isTop ? onDoubleClick : undefined}
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

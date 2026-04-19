import { useState } from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import type { DraggableCardData } from '#/lib/games/klondike'
import type { Card as CardType } from '#/lib/types'
import CardSlot from '../CardSlot'

const FAN_OFFSET = 20 // px horizontal offset between fanned cards in draw-3

interface KlondikeWasteProps {
  waste: CardType[]
  drawCount: 1 | 3
  moveAnywhere?: boolean
  onDoubleClick?: () => void
  currentDealCount: number
}

export default function KlondikeWaste({
  waste,
  drawCount,
  moveAnywhere,
  onDoubleClick,
  currentDealCount,
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

  // The base slot is always rendered
  const baseSlot = <CardSlot role="waste" className="absolute inset-0" />

  // FIX: Only show the cards from the current "deal"
  // currentDealCount is the number of cards from the last flip that are still in the waste
  const visible = currentDealCount > 0 ? waste.slice(-currentDealCount) : []
  const containerWidth = 80

  if (drawCount === 1) {
    const top = visible.length > 0 ? visible[0] : null
    const isDragging = draggingFromIndex !== null
    const underCard =
      isDragging && waste.length > 1 ? waste[waste.length - 2] : null

    return (
      <div className="relative h-28 w-20">
        {baseSlot}

        {/* Card under the dragging card — so we don't see an empty slot */}
        {underCard && (
          <div className="absolute inset-0">
            <Card
              suit={underCard.suit}
              rank={underCard.rank}
              faceUp={underCard.faceUp}
            />
          </div>
        )}

        {/* Top card — always rendered so drag stays alive; hidden via opacity when dragging */}
        {top && (
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
        )}
      </div>
    )
  }

  // Draw 3
  const underCard =
    waste.length > visible.length
      ? waste[waste.length - visible.length - 1]
      : null

  return (
    <div
      className="relative h-28 flex-shrink-0"
      style={{ width: containerWidth }}
    >
      {baseSlot}

      {/* Card under the current deal — visible if dragging the last card of the deal */}
      {underCard && (
        <div className="absolute inset-0">
          <Card
            suit={underCard.suit}
            rank={underCard.rank}
            faceUp={underCard.faceUp}
          />
        </div>
      )}

      {visible.map((card, i) => {
        // absolute index in the full waste array is length - visibleCount + i
        const absIndex = waste.length - visible.length + i
        const isTop = i === visible.length - 1
        const isDraggingThis = draggingFromIndex === absIndex
        const left = i * FAN_OFFSET
        const isDraggable = isTop || moveAnywhere === true

        return (
          <div
            key={card.id}
            className={cn('absolute', !isDraggable && 'pointer-events-none')}
            style={{ left, top: 0, zIndex: i }}
          >
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

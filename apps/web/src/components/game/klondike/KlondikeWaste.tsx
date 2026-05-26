import { useState } from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import KlondikeCard from './KlondikeCard'
import type { DraggableCardData } from '#/lib/games/klondike'
import type { Card as CardType } from '#/lib/types'
import CardSlot from '../CardSlot'

const FAN_OFFSET = 28 // px horizontal offset between fanned cards in draw-3

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
  const baseSlot = <CardSlot role="waste" className="absolute top-0 left-0" />

  // FIX: Only show the cards from the current "deal"
  // currentDealCount is the number of cards from the last flip that are still in the waste
  const visible = currentDealCount > 0 ? waste.slice(-currentDealCount) : []

  if (drawCount === 1) {
    const isDragging = draggingFromIndex !== null

    return (
      <div
        className="relative"
        style={{
          width: 'var(--card-width, 7rem)',
          height: 'var(--card-height, 10rem)',
        }}
      >
        {baseSlot}

        {/* Render all cards so VictoryFanOut captures them */}
        {waste.map((card, index) => {
          const isTop = index === waste.length - 1
          const isDraggingThis = isTop && isDragging

          return (
            <div key={card.id} className="absolute inset-0">
              {isTop ? (
                <KlondikeCard
                  card={card}
                  pileId="waste"
                  fromIndex={index}
                  dragCards={[card]}
                  isHidden={isDraggingThis}
                  onDoubleClick={onDoubleClick}
                />
              ) : (
                <Card
                  suit={card.suit}
                  rank={card.rank}
                  faceUp={card.faceUp}
                  className={isDraggingThis ? 'opacity-0' : ''}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Draw 3
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width:
          visible.length > 1
            ? `calc(${visible.length - 1} * 1.75rem + var(--card-width, 7rem))`
            : 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
    >
      {baseSlot}

      {/* Render hidden cards underneath the visible ones */}
      {waste.slice(0, -visible.length).map((card) => (
        <div key={card.id} className="absolute top-0 left-0">
          <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
        </div>
      ))}

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

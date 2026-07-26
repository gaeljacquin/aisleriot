import { useState } from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import Card from '../Card'
import WestcliffCard from './WestcliffCard'
import type { DraggableCardData } from '#/lib/games/westcliff'
import type { Card as CardType } from '#/lib/types'
import CardSlot from '../CardSlot'

interface WestcliffWasteProps {
  waste: CardType[]
  moveAnywhere?: boolean
  onDoubleClick?: () => void
}

export default function WestcliffWaste({
  waste,
  onDoubleClick,
}: WestcliffWasteProps) {
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

  const baseSlot = <CardSlot role="waste" className="absolute top-0 left-0" />
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

      {waste.map((card, index) => {
        const isTop = index === waste.length - 1
        const isDraggingThis = isTop && isDragging

        return (
          <div key={card.id} className="absolute inset-0">
            {isTop ? (
              <WestcliffCard
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

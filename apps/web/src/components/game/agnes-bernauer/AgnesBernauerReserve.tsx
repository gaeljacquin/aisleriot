import { useState } from 'react'
import { useDndMonitor } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import { useAgnesBernauerStore } from '#/lib/stores/agnes-bernauer'
import AgnesBernauerCard from './AgnesBernauerCard'
import CardSlot from '../CardSlot'
import Card from '../Card'
import type { Card as CardType } from '#/lib/types'
import type {
  AgnesBernauerReserveId,
  DraggableCardData,
} from '#/lib/games/agnes-bernauer'

interface AgnesBernauerReserveProps {
  id: AgnesBernauerReserveId
  cards: CardType[]
  disabled?: boolean
}

export default function AgnesBernauerReserve({
  id,
  cards,
  disabled,
}: AgnesBernauerReserveProps) {
  const state = useAgnesBernauerStore()
  const [isDraggingTop, setIsDraggingTop] = useState(false)

  useDndMonitor({
    onDragStart(event) {
      const data = event.active.data.current as DraggableCardData | undefined
      if (data?.type === 'card' && data.pileId === id) {
        setIsDraggingTop(true)
      }
    },
    onDragEnd() {
      setIsDraggingTop(false)
    },
    onDragCancel() {
      setIsDraggingTop(false)
    },
  })

  const topCard = cards.length > 0 ? cards[cards.length - 1] : null
  const beneathCard = cards.length > 1 ? cards[cards.length - 2] : null

  return (
    <div
      className={cn('relative rounded-lg transition-colors')}
      style={{
        width: 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
    >
      <CardSlot role="waste" />

      {/* Peek card beneath top */}
      {isDraggingTop && beneathCard && (
        <div className="absolute inset-0">
          <Card
            suit={beneathCard.suit}
            rank={beneathCard.rank}
            faceUp={beneathCard.faceUp}
          />
        </div>
      )}

      {topCard && (
        <div className="absolute inset-0">
          <AgnesBernauerCard
            card={topCard}
            pileId={id}
            fromIndex={cards.length - 1}
            dragCards={[topCard]}
            isHidden={isDraggingTop}
            disabled={disabled}
            onDoubleClick={() => state.autoMove(id)}
          />
        </div>
      )}
    </div>
  )
}

import { memo } from 'react'
import Card from '../Card'
import type { Card as CardType } from '#/lib/types'

interface GrandfathersClockCardProps {
  card: CardType
  isHidden?: boolean
  onDoubleClick?: () => void
  className?: string
}

export const GrandfathersClockCard = memo(function GrandfathersClockCard({
  card,
  isHidden,
  onDoubleClick,
  className,
}: GrandfathersClockCardProps) {
  return (
    <div onDoubleClick={onDoubleClick} className={className}>
      <Card
        suit={card.suit}
        rank={card.rank}
        faceUp={card.faceUp}
        className={isHidden ? 'opacity-0' : ''}
      />
    </div>
  )
})

export default GrandfathersClockCard

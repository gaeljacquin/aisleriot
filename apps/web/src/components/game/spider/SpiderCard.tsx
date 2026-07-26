import Card from '../Card'
import type { Card as CardType } from '#/lib/types'

interface SpiderCardProps {
  card: CardType
  isHidden?: boolean
}

export default function SpiderCard({ card, isHidden }: SpiderCardProps) {
  if (isHidden) {
    return (
      <div
        className="w-full rounded-md opacity-0 pointer-events-none"
        style={{ height: 'var(--card-height)' }}
      />
    )
  }

  return <Card suit={card.suit} rank={card.rank} faceUp={card.faceUp} />
}

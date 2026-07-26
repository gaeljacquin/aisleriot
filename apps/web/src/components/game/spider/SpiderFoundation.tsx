import CardSlot from '../CardSlot'
import SpiderCard from './SpiderCard'
import type { SpiderFoundationId } from '#/lib/games/spider'
import type { Card } from '#/lib/types'

interface SpiderFoundationProps {
  id: SpiderFoundationId
  cards: Card[]
}

export default function SpiderFoundation({
  id: _id,
  cards,
}: SpiderFoundationProps) {
  const topCard = cards.length > 0 ? cards[cards.length - 1] : null

  return (
    <div
      className="relative rounded-lg"
      style={{
        width: 'var(--card-width)',
        height: 'var(--card-height)',
      }}
    >
      <CardSlot role="foundation" showLogo />
      {topCard && (
        <div className="absolute inset-0">
          <SpiderCard card={topCard} />
        </div>
      )}
    </div>
  )
}

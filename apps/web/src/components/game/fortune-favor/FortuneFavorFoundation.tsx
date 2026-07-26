import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import FortuneFavorCard from './FortuneFavorCard'
import CardSlot from '../CardSlot'
import { getVariant } from '@workspace/constants'
import type { FortuneFavorFoundationEntry } from '#/lib/hooks/use-fortune-favor'

interface FortuneFavorFoundationProps {
  foundation: FortuneFavorFoundationEntry[]
}

export default function FortuneFavorFoundation({
  foundation,
}: FortuneFavorFoundationProps) {
  return (
    <div className="flex gap-(--card-gap-free)">
      {foundation.map((entry) => (
        <FortuneFavorFoundationPile key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

function FortuneFavorFoundationPile({
  entry,
}: {
  entry: FortuneFavorFoundationEntry
}) {
  const variant = getVariant('fortune-favor')
  const { setNodeRef, isOver } = useDroppable({
    id: entry.id,
    data: {
      type: 'pile',
      pileId: entry.id,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative rounded-lg transition-colors',
        isOver && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{
        width: 'var(--card-width)',
        height: 'var(--card-height)',
      }}
    >
      <CardSlot
        role="foundation"
        suit={entry.suit}
        baseRank={variant.foundation_base_rank}
        className="absolute inset-0"
      />
      {entry.cards.map((card) => (
        <div key={card.id} className="absolute inset-0">
          <FortuneFavorCard card={card} />
        </div>
      ))}
    </div>
  )
}

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@workspace/ui/lib/utils'
import AcmeCard from './AcmeCard'
import CardSlot from '../CardSlot'
import { getVariant } from '@workspace/constants'
import type { AcmeFoundationEntry } from '#/lib/hooks/use-acme'
import type { Suit } from '#/lib/types'

interface AcmeFoundationProps {
  foundation: AcmeFoundationEntry[]
}

export default function AcmeFoundation({ foundation }: AcmeFoundationProps) {
  return (
    <div className="flex gap-[var(--card-gap-free)]">
      {foundation.map((entry) => (
        <AcmeFoundationPile key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

function AcmeFoundationPile({ entry }: { entry: AcmeFoundationEntry }) {
  const variant = getVariant('acme')
  const { setNodeRef, isOver } = useDroppable({
    id: entry.id,
    data: {
      type: 'pile',
      pileId: entry.id,
    },
  })

  const topCard = entry.cards[entry.cards.length - 1]

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
      {entry.cards.length > 0 && (
        <div className="absolute inset-0">
          <AcmeCard card={topCard} />
        </div>
      )}
    </div>
  )
}

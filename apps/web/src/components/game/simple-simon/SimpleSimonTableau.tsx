import SimpleSimonColumn from './SimpleSimonColumn'
import type { SimpleSimonTableauId } from '#/lib/games/simple-simon'
import type { Card } from '#/lib/types'

interface SimpleSimonTableauProps {
  tableau: Record<SimpleSimonTableauId, Card[]>
  draggableFromIndex: (pileId: string) => number
  devMoveAnywhere?: boolean
}

export default function SimpleSimonTableau({
  tableau,
  draggableFromIndex,
  devMoveAnywhere,
}: SimpleSimonTableauProps) {
  return (
    <div
      className="grid grid-cols-5 sm:grid-cols-10 justify-center gap-x-[var(--card-gap-x)] gap-y-8"
      style={{
        width: 'fit-content',
        margin: '0 auto',
      }}
    >
      {(Object.entries(tableau) as [SimpleSimonTableauId, Card[]][]).map(
        ([id, cards]) => (
          <SimpleSimonColumn
            key={id}
            id={id}
            cards={cards}
            draggableFrom={devMoveAnywhere ? 0 : draggableFromIndex(id)}
          />
        ),
      )}
    </div>
  )
}

import FreeCellColumn from './FreeCellColumn'
import type { FreeCellPileId } from '#/lib/games/freecell'
import type { FreeCellTableauEntry } from '#/lib/hooks/useFreeCell'

interface FreeCellTableauProps {
  tableau: FreeCellTableauEntry[]
  draggableFromIndex: Record<FreeCellPileId, number>
  devUnlimitedMoves?: boolean
  onDoubleClick: (pileId: FreeCellPileId) => void
}

export default function FreeCellTableau({
  tableau,
  draggableFromIndex,
  devUnlimitedMoves,
  onDoubleClick,
}: FreeCellTableauProps) {
  return (
    <div className="flex justify-center gap-4">
      {tableau.map((entry) => (
        <FreeCellColumn
          key={entry.id}
          id={entry.id}
          cards={entry.cards}
          draggableFrom={devUnlimitedMoves ? 0 : (draggableFromIndex[entry.id] ?? entry.cards.length)}
          onDoubleClick={onDoubleClick}
        />
      ))}
    </div>
  )
}

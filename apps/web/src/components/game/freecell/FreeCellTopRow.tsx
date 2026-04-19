import FreeCellFreeCell from './FreeCellFreeCell'
import FreeCellFoundation from './FreeCellFoundation'
import type { FreeCellPileId } from '#/lib/games/freecell'
import type {
  FreeCellFreeCellEntry,
  FreeCellFoundationEntry,
} from '#/lib/hooks/useFreeCell'

interface FreeCellTopRowProps {
  freeCells: FreeCellFreeCellEntry[]
  foundation: FreeCellFoundationEntry[]
  onFreeCellDoubleClick: (pileId: FreeCellPileId) => void
}

export default function FreeCellTopRow({
  freeCells,
  foundation,
  onFreeCellDoubleClick,
}: FreeCellTopRowProps) {
  return (
    <div className="flex items-center justify-center gap-10">
      {/* Left: 4 free cells */}
      <div className="flex gap-2">
        {freeCells.map((entry) => (
          <FreeCellFreeCell
            key={entry.id}
            id={entry.id}
            card={entry.card}
            onDoubleClick={onFreeCellDoubleClick}
          />
        ))}
      </div>

      {/* Right: 4 foundations */}
      <div className="flex gap-2">
        {foundation.map((entry) => (
          <FreeCellFoundation
            key={entry.id}
            id={entry.id}
            cards={entry.cards}
            suit={entry.suit}
          />
        ))}
      </div>
    </div>
  )
}

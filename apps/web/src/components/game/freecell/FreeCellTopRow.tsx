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
  center?: React.ReactNode
  onFreeCellDoubleClick: (pileId: FreeCellPileId) => void
}

export default function FreeCellTopRow({
  freeCells,
  foundation,
  center,
  onFreeCellDoubleClick,
}: FreeCellTopRowProps) {
  return (
    <div className="flex items-center justify-between gap-2">
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

      {/* Center: action buttons */}
      {center && <div className="flex-1 flex justify-center">{center}</div>}

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

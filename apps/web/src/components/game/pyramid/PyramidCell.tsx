import { cn } from '@workspace/ui/lib/utils'
import Card from '../Card'
import type {
  PyramidCell as PyramidCellType,
  PyramidCellId,
} from '#/lib/games/pyramid'

interface PyramidCellProps {
  cell: PyramidCellType
  isAvailable: boolean
  isSelected: boolean
  onClick: (id: PyramidCellId) => void
}

export default function PyramidCell({
  cell,
  isAvailable,
  isSelected,
  onClick,
}: PyramidCellProps) {
  // Removed cells keep their space in the layout but don't block clicks
  if (cell.removed) {
    return <div className="h-40 w-28 pointer-events-none" aria-hidden="true" />
  }

  // Blocked — face-up but not interactive
  if (!isAvailable) {
    return (
      <div className="h-40 w-28">
        <Card suit={cell.card.suit} rank={cell.card.rank} faceUp={true} />
      </div>
    )
  }

  return (
    <div className={cn('h-40 w-28')}>
      <Card
        suit={cell.card.suit}
        rank={cell.card.rank}
        faceUp={true}
        highlighted={isSelected}
        onClick={() => onClick(cell.id)}
      />
    </div>
  )
}

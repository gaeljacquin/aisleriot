import Card from '../Card'
import CardSlot from '../CardSlot'
import type {
  PyramidCell as PyramidCellType,
  PyramidCellId,
} from '#/lib/games/pyramid'

interface PyramidCellProps {
  cell: PyramidCellType
  isAvailable: boolean
  isSelected: boolean
  onClick: (id: PyramidCellId) => void
  isTop?: boolean
}

export default function PyramidCell({
  cell,
  isAvailable,
  isSelected,
  onClick,
  isTop,
}: PyramidCellProps) {
  // Removed cells keep their space in the layout but don't block clicks
  if (cell.removed) {
    return (
      <div
        className="pointer-events-none relative"
        style={{
          width: 'var(--card-width, 7rem)',
          height: 'var(--card-height, 10rem)',
        }}
        aria-hidden="true"
      >
        {isTop && <CardSlot role="tableau" className="absolute inset-0" />}
      </div>
    )
  }

  return (
    <div
      className="relative"
      style={{
        width: 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
    >
      {isTop && <CardSlot role="tableau" className="absolute inset-0" />}

      {/* Blocked — face-up but not interactive */}
      {!isAvailable ? (
        <Card suit={cell.card.suit} rank={cell.card.rank} faceUp={true} />
      ) : (
        <Card
          suit={cell.card.suit}
          rank={cell.card.rank}
          faceUp={true}
          highlighted={isSelected}
          onClick={() => onClick(cell.id)}
        />
      )}
    </div>
  )
}

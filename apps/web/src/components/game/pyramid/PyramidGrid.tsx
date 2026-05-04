import PyramidCell from './PyramidCell'
import type {
  PyramidCell as PyramidCellType,
  PyramidCellId,
} from '#/lib/games/pyramid'
import { cn } from '@workspace/ui/lib/utils'

interface PyramidGridProps {
  cells: PyramidCellType[]
  availableCells: PyramidCellId[]
  selectedCellId: PyramidCellId | null
  onCellClick: (id: PyramidCellId) => void
}

// Card dimensions (rem)
// const CARD_W = 7 // w-28
// const CARD_H = 10 // h-40
// Pyramid: 7 rows. Row r has r+1 cards. Cell index i in row r at position p: i = r*(r+1)/2 + p
// x = (p + (6 - r) / 2) * STEP  (center each row relative to the 7-card base row)
// y = r * ROW_STEP

function getRow(index: number): number {
  let r = 0
  while (((r + 1) * (r + 2)) / 2 <= index) r++
  return r
}

export default function PyramidGrid({
  cells,
  availableCells,
  selectedCellId,
  onCellClick,
}: PyramidGridProps) {
  const availableSet = new Set(availableCells)
  const cellMap = new Map(cells.map((c) => [c.id, c]))

  return (
    <div
      className={cn('relative mx-auto')}
      style={{
        width:
          'calc(var(--card-step-x, 8.5rem) * 6 + var(--card-width, 7.5rem))',
        height:
          'calc(var(--card-step-y, 6.5rem) * 6 + var(--card-height, 10.7rem))',
      }}
    >
      {cells.map((_, idx) => {
        const cellId = `cell-${idx}`
        const cell = cellMap.get(cellId)
        if (!cell) return null

        const r = getRow(idx)
        const p = idx - (r * (r + 1)) / 2
        const offsetX = (6 - r) / 2

        return (
          <div
            key={cellId}
            className={cn('absolute', cell.removed && 'pointer-events-none')}
            style={{
              left: `calc((${p} + ${offsetX}) * var(--card-step-x, 8.5rem))`,
              top: `calc(${r} * var(--card-step-y, 6.5rem))`,
              zIndex: r + 1,
            }}
          >
            <PyramidCell
              cell={cell}
              isAvailable={availableSet.has(cellId)}
              isSelected={selectedCellId === cellId}
              onClick={onCellClick}
            />
          </div>
        )
      })}
    </div>
  )
}

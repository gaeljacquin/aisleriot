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
const STEP = 8 // horizontal step per column (rem) — card width + 1rem gap
const ROW_STEP = 6 // vertical step per row (rem) — cards overlap slightly

// Pyramid: 7 rows. Row r has r+1 cards. Cell index i in row r at position p: i = r*(r+1)/2 + p
// x = (p + (6 - r) / 2) * STEP  (center each row relative to the 7-card base row)
// y = r * ROW_STEP

function getRow(index: number): number {
  let r = 0
  while (((r + 1) * (r + 2)) / 2 <= index) r++
  return r
}

function getPosition(index: number): { x: number; y: number } {
  const r = getRow(index)
  const p = index - (r * (r + 1)) / 2
  const x = (p + (6 - r) / 2) * STEP
  const y = r * ROW_STEP
  return { x, y }
}

// Container dimensions
const CONTAINER_W = 55
const CONTAINER_H = 46

// Z-index: base row (r=6) = 7 (renders on top), apex (r=0) = 1 (renders underneath)
function getZIndex(index: number): number {
  const r = getRow(index)
  return r + 1
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
      style={{ width: `${CONTAINER_W}rem`, height: `${CONTAINER_H}rem` }}
    >
      {cells.map((_, idx) => {
        const cellId = `cell-${idx}`
        const cell = cellMap.get(cellId)
        if (!cell) return null

        const { x, y } = getPosition(idx)

        return (
          <div
            key={cellId}
            className={cn('absolute', cell.removed && 'pointer-events-none')}
            style={{
              left: `${x}rem`,
              top: `${y}rem`,
              zIndex: getZIndex(idx),
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

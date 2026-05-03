import { cn } from '@workspace/ui/lib/utils'
import PeakCell from './PeakCell'
import type { TriPeaksCell, TriPeaksCellId } from '#/lib/games/tri-peaks'

interface PeakGridProps {
  cells: TriPeaksCell[]
  availableCells: TriPeaksCellId[]
  onPlayCard: (id: TriPeaksCellId) => void
  isValidMove: (id: TriPeaksCellId) => boolean
}

/**
 * Absolute-positioned pyramid layout for 28 Tri Peaks cells.
 *
 * Card size: 7rem wide (w-28), 10rem tall (h-40). Column step: 8.5rem (card + 1.5rem gap).
 *
 * Row y positions (cards overlap by 4rem vertically — each row step = 6rem):
 *   Row 0 (tops):   y = 0rem
 *   Row 1 (pairs):  y = 6rem
 *   Row 2 (9):      y = 12rem
 *   Row 3 (bottom): y = 18rem
 *
 * Row 3 (10 cards): x[j] = j × 8.5rem
 * Row 2 (9 cards, half-step offset): x[j] = (j + 0.5) × 8.5rem
 * Row 1 (6 cards, 2 per peak): aligned above row2 pairs
 *   Peak 0: cards 3,4 → x = 1×8.5, 2×8.5
 *   Peak 1: cards 5,6 → x = 4×8.5, 5×8.5
 *   Peak 2: cards 7,8 → x = 7×8.5, 8×8.5
 * Row 0 (3 tops): centered over each pair in row 1
 *   Peak 0: center of x=8.5 and x=17+7 → (8.5 + 17 + 7) / 2 - 3.5 = 12.75rem
 *   Peak 1: center of x=34 and x=42.5+7 → (34 + 42.5 + 7) / 2 - 3.5 = 38.25rem
 *   Peak 2: center of x=59.5 and x=68+7 → (59.5 + 68 + 7) / 2 - 3.5 = 63.75rem
 *
 * Container: 83.5rem × 28rem
 */

const CELL_POSITIONS: Array<{ x: number; y: number }> = [
  // Row 0: peak tops (y=0)
  { x: 1.5, y: 0 }, // 0: peak 0 top
  { x: 4.5, y: 0 }, // 1: peak 1 top
  { x: 7.5, y: 0 }, // 2: peak 2 top

  // Row 1: two cards per peak (y=1)
  { x: 1, y: 1 }, // 3: peak 0 left
  { x: 2, y: 1 }, // 4: peak 0 right
  { x: 4, y: 1 }, // 5: peak 1 left
  { x: 5, y: 1 }, // 6: peak 1 right
  { x: 7, y: 1 }, // 7: peak 2 left
  { x: 8, y: 1 }, // 8: peak 2 right

  // Row 2: nine cards, offset 0.5 step from left (y=2)
  { x: 0.5, y: 2 }, // 9
  { x: 1.5, y: 2 }, // 10
  { x: 2.5, y: 2 }, // 11
  { x: 3.5, y: 2 }, // 12
  { x: 4.5, y: 2 }, // 13
  { x: 5.5, y: 2 }, // 14
  { x: 6.5, y: 2 }, // 15
  { x: 7.5, y: 2 }, // 16
  { x: 8.5, y: 2 }, // 17

  // Row 3: ten bottom cards, flush left (y=3)
  { x: 0, y: 3 }, // 18
  { x: 1, y: 3 }, // 19
  { x: 2, y: 3 }, // 20
  { x: 3, y: 3 }, // 21
  { x: 4, y: 3 }, // 22
  { x: 5, y: 3 }, // 23
  { x: 6, y: 3 }, // 24
  { x: 7, y: 3 }, // 25
  { x: 8, y: 3 }, // 26
  { x: 9, y: 3 }, // 27
]

function getZIndex(idx: number): number {
  if (idx <= 2) return 1 // row 0
  if (idx <= 8) return 2 // row 1
  if (idx <= 17) return 3 // row 2
  return 4 // row 3
}

export default function PeakGrid({
  cells,
  availableCells,
  onPlayCard,
  isValidMove,
}: PeakGridProps) {
  const availableSet = new Set(availableCells)
  const cellMap = new Map(cells.map((c) => [c.id, c]))

  return (
    <div
      className={cn('relative')}
      style={{
        width: 'calc(var(--card-step-x, 8.5rem) * 9 + var(--card-width, 7rem))',
        height:
          'calc(var(--card-step-y, 6rem) * 3 + var(--card-height, 10rem))',
      }}
    >
      {CELL_POSITIONS.map((pos, idx) => {
        const cellId = `cell-${idx}`
        const cell = cellMap.get(cellId)
        if (!cell) return null

        return (
          <div
            key={cellId}
            className={cn('absolute', cell.removed && 'pointer-events-none')}
            style={{
              left: `calc(${pos.x} * var(--card-step-x, 8.5rem))`,
              top: `calc(${pos.y} * var(--card-step-y, 6rem))`,
              zIndex: getZIndex(idx),
            }}
          >
            <PeakCell
              cell={cell}
              isAvailable={availableSet.has(cellId)}
              onClick={onPlayCard}
              isValidMove={isValidMove}
            />
          </div>
        )
      })}
    </div>
  )
}

import { cn } from '@workspace/ui/lib/utils'
import PeakCell from './PeakCell'
import type { TriPeaksCell, TriPeaksCellId } from '#/lib/games/tri-peaks'

interface PeakGridProps {
  cells: TriPeaksCell[]
  availableCells: TriPeaksCellId[]
  onPlayCard: (id: TriPeaksCellId) => void
}

/**
 * Absolute-positioned pyramid layout for 28 Tri Peaks cells.
 *
 * Card size: 5rem wide (w-20), 7rem tall (h-28). Column step: 6rem (card + 1rem gap).
 *
 * Row y positions (cards overlap by 2rem vertically — each row step = 4rem):
 *   Row 0 (tops):   y = 0rem
 *   Row 1 (pairs):  y = 4rem
 *   Row 2 (9):      y = 8rem
 *   Row 3 (bottom): y = 12rem
 *
 * Row 3 (10 cards): x[j] = j × 6rem
 * Row 2 (9 cards, half-step offset): x[j] = (j + 0.5) × 6rem
 * Row 1 (6 cards, 2 per peak): aligned above row2 pairs
 *   Peak 0: cards 3,4 → x = 1×6, 2×6
 *   Peak 1: cards 5,6 → x = 4×6, 5×6
 *   Peak 2: cards 7,8 → x = 7×6, 8×6
 * Row 0 (3 tops): centered over each pair in row 1
 *   Peak 0: center of x=6 and x=12+5 → (6 + 12 + 5) / 2 - 2.5 = 9rem
 *   Peak 1: center of x=24 and x=30+5 → (24 + 30 + 5) / 2 - 2.5 = 27rem
 *   Peak 2: center of x=42 and x=48+5 → (42 + 48 + 5) / 2 - 2.5 = 45rem
 *
 * Container: 59rem × 19rem
 */

const STEP = 6 // rem (5rem card + 1rem gap)

const CELL_POSITIONS: Array<{ x: number; y: number }> = [
  // Row 0: peak tops (y=0)
  { x: 9, y: 0 },   // 0: peak 0 top
  { x: 27, y: 0 },  // 1: peak 1 top
  { x: 45, y: 0 },  // 2: peak 2 top

  // Row 1: two cards per peak (y=4)
  { x: 1 * STEP, y: 4 },  // 3: peak 0 left   = 6rem
  { x: 2 * STEP, y: 4 },  // 4: peak 0 right  = 12rem
  { x: 4 * STEP, y: 4 },  // 5: peak 1 left   = 24rem
  { x: 5 * STEP, y: 4 },  // 6: peak 1 right  = 30rem
  { x: 7 * STEP, y: 4 },  // 7: peak 2 left   = 42rem
  { x: 8 * STEP, y: 4 },  // 8: peak 2 right  = 48rem

  // Row 2: nine cards, offset 0.5 step from left (y=8)
  { x: 0.5 * STEP, y: 8 },  // 9
  { x: 1.5 * STEP, y: 8 },  // 10
  { x: 2.5 * STEP, y: 8 },  // 11
  { x: 3.5 * STEP, y: 8 },  // 12
  { x: 4.5 * STEP, y: 8 },  // 13
  { x: 5.5 * STEP, y: 8 },  // 14
  { x: 6.5 * STEP, y: 8 },  // 15
  { x: 7.5 * STEP, y: 8 },  // 16
  { x: 8.5 * STEP, y: 8 },  // 17

  // Row 3: ten bottom cards, flush left (y=12)
  { x: 0 * STEP, y: 12 },  // 18
  { x: 1 * STEP, y: 12 },  // 19
  { x: 2 * STEP, y: 12 },  // 20
  { x: 3 * STEP, y: 12 },  // 21
  { x: 4 * STEP, y: 12 },  // 22
  { x: 5 * STEP, y: 12 },  // 23
  { x: 6 * STEP, y: 12 },  // 24
  { x: 7 * STEP, y: 12 },  // 25
  { x: 8 * STEP, y: 12 },  // 26
  { x: 9 * STEP, y: 12 },  // 27
]

// Container dimensions
const CONTAINER_W = 10 * 5 + 9 * 1 // 59rem
const CONTAINER_H = 12 + 7 // 19rem (last row y=12 + card height=7)

function getZIndex(idx: number): number {
  if (idx <= 2) return 1   // row 0
  if (idx <= 8) return 2   // row 1
  if (idx <= 17) return 3  // row 2
  return 4                 // row 3
}

export default function PeakGrid({ cells, availableCells, onPlayCard }: PeakGridProps) {
  const availableSet = new Set(availableCells)
  const cellMap = new Map(cells.map((c) => [c.id, c]))

  return (
    <div
      className={cn('relative mx-auto')}
      style={{ width: `${CONTAINER_W}rem`, height: `${CONTAINER_H}rem` }}
    >
      {CELL_POSITIONS.map((pos, idx) => {
        const cellId = `cell-${idx}`
        const cell = cellMap.get(cellId)
        if (!cell) return null

        return (
          <div
            key={cellId}
            className="absolute"
            style={{ left: `${pos.x}rem`, top: `${pos.y}rem`, zIndex: getZIndex(idx) }}
          >
            <PeakCell
              cell={cell}
              isAvailable={availableSet.has(cellId)}
              onClick={onPlayCard}
            />
          </div>
        )
      })}
    </div>
  )
}

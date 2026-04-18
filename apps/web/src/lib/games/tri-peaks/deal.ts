import { createShuffledDeck } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { TriPeaksState, TriPeaksCellId, TriPeaksCell } from './types'

// blockedBy relationships: a cell is available when ALL cells blocking it have been removed.
// 28 peak cards arranged as:
//   Row 0 (3 tops):    indices 0, 1, 2
//   Row 1 (6 cards):   indices 3,4, 5,6, 7,8
//   Row 2 (9 cards):   indices 9–17
//   Row 3 (10 bottom): indices 18–27
const BLOCKED_BY: Record<number, number[]> = {
  0: [3, 4],
  1: [5, 6],
  2: [7, 8],
  3: [9, 10],
  4: [10, 11],
  5: [12, 13],
  6: [13, 14],
  7: [15, 16],
  8: [16, 17],
  9: [18, 19],
  10: [19, 20],
  11: [20, 21],
  12: [21, 22],
  13: [22, 23],
  14: [23, 24],
  15: [24, 25],
  16: [25, 26],
  17: [26, 27],
  18: [],
  19: [],
  20: [],
  21: [],
  22: [],
  23: [],
  24: [],
  25: [],
  26: [],
  27: [],
}

const PEAK_COUNT = 28

function cellId(index: number): TriPeaksCellId {
  return `cell-${index}`
}

export function createInitialState(seed?: number): TriPeaksState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const shuffled = createShuffledDeck(resolvedSeed)

  const cells: Record<TriPeaksCellId, TriPeaksCell> = {}

  for (let i = 0; i < PEAK_COUNT; i++) {
    const card = shuffled[i]
    const blockedByIndices: number[] = BLOCKED_BY[i] ?? []
    cells[cellId(i)] = {
      id: cellId(i),
      card: { ...card, faceUp: true }, // all peak cards are visible (face-up)
      blockedBy: blockedByIndices.map(cellId),
      removed: false,
    }
  }

  const stock = shuffled
    .slice(PEAK_COUNT)
    .map((c: Card) => ({ ...c, faceUp: false }))

  return {
    cells,
    stock,
    waste: [],
    chain: 0,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
  }
}

import { createDeck, shuffleDeck } from '#/lib/utils'
import type { PyramidState, PyramidCellId, PyramidCell } from './types'

// Pyramid layout: 7 rows, row r has r+1 cards.
// Cell index i in row r at position p: i = r*(r+1)/2 + p
// Cell i is blocked by cells at i + r + 1 and i + r + 2 (the two cells in the row below
// that overlap it). Base row (row 6, indices 21–27) has no blockers.
//
// BLOCKED_BY[i] = indices of cells that must be removed before cell i is available.
const BLOCKED_BY: Record<number, number[]> = {
  // Row 0 (apex): index 0
  0: [1, 2],
  // Row 1: indices 1–2
  1: [3, 4],
  2: [4, 5],
  // Row 2: indices 3–5
  3: [6, 7],
  4: [7, 8],
  5: [8, 9],
  // Row 3: indices 6–9
  6: [10, 11],
  7: [11, 12],
  8: [12, 13],
  9: [13, 14],
  // Row 4: indices 10–14
  10: [15, 16],
  11: [16, 17],
  12: [17, 18],
  13: [18, 19],
  14: [19, 20],
  // Row 5: indices 15–20
  15: [21, 22],
  16: [22, 23],
  17: [23, 24],
  18: [24, 25],
  19: [25, 26],
  20: [26, 27],
  // Row 6 (base): indices 21–27 — no blockers
  21: [],
  22: [],
  23: [],
  24: [],
  25: [],
  26: [],
  27: [],
}

const PYRAMID_COUNT = 28

function cellId(index: number): PyramidCellId {
  return `cell-${index}`
}

export function createInitialState(_recycleLimit: number, seed?: number): PyramidState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const shuffled = shuffleDeck(createDeck(), resolvedSeed)

  const cells: Record<PyramidCellId, PyramidCell> = {}

  for (let i = 0; i < PYRAMID_COUNT; i++) {
    const card = shuffled[i]
    const blockedByIndices: number[] = BLOCKED_BY[i] ?? []
    cells[cellId(i)] = {
      id: cellId(i),
      card: { ...card, faceUp: true }, // all pyramid cards are face-up
      blockedBy: blockedByIndices.map(cellId),
      removed: false,
    }
  }

  // Remaining 24 cards form the stock; last element = top. Face-down.
  const stock = shuffled.slice(PYRAMID_COUNT).map((c) => ({ ...c, faceUp: false }))

  return {
    cells,
    stock,
    waste: [],
    recyclesUsed: 0,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: resolvedSeed,
  }
}

import { rankDistance } from '#/lib/utils'
import type { TriPeaksState, TriPeaksCellId } from './types'

/**
 * Returns true if the cell is not removed, all its blockers have been removed,
 * and its card is exactly 1 rank away from the current waste top.
 * When wrap=true, K(13) and A(1) are adjacent (wrapped distance check).
 */
export function canPlayCard(
  state: TriPeaksState,
  cellId: TriPeaksCellId,
  wrap = false,
): boolean {
  const cell = state.cells[cellId]
  if (cell.removed) return false

  // Check all blockers are removed
  for (const blockerId of cell.blockedBy) {
    if (!state.cells[blockerId].removed) return false
  }

  if (state.waste.length === 0) return false

  const dist = rankDistance(cell.card, state.waste[state.waste.length - 1])
  if (wrap) {
    // K(13) and A(1) are adjacent: wrapped distance = min(dist, 14 - dist)
    return Math.min(dist, 14 - dist) === 1
  }
  return dist === 1
}

export function canDraw(state: TriPeaksState): boolean {
  return state.stock.length > 0
}

export function getAvailableCells(state: TriPeaksState): TriPeaksCellId[] {
  return Object.values(state.cells)
    .filter((cell) => {
      if (cell.removed) return false
      for (const blockerId of cell.blockedBy) {
        if (!state.cells[blockerId].removed) return false
      }
      return true
    })
    .map((cell) => cell.id)
}

export function isGameWon(state: TriPeaksState): boolean {
  return Object.values(state.cells).every((cell) => cell.removed)
}

/**
 * The game is lost only when the stock is empty and no available cell
 * can be played on the current waste top.
 */
export function isGameLost(state: TriPeaksState, wrap = false): boolean {
  if (state.stock.length > 0) return false
  const available = getAvailableCells(state)
  return !available.some((cellId) => canPlayCard(state, cellId, wrap))
}

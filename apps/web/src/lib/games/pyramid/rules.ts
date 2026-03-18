import { rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { PyramidState, PyramidCellId } from './types'

export function sumTo13(a: Card, b: Card): boolean {
  return rankValue(a.rank) + rankValue(b.rank) === 13
}

export function isKing(card: Card): boolean {
  return rankValue(card.rank) === 13
}

export function isCellAvailable(state: PyramidState, cellId: PyramidCellId): boolean {
  const cell = state.cells[cellId]
  if (cell.removed) return false
  return cell.blockedBy.every((id) => state.cells[id].removed)
}

export function getAvailableCells(state: PyramidState): PyramidCellId[] {
  return Object.values(state.cells)
    .filter((cell) => {
      if (cell.removed) return false
      return cell.blockedBy.every((id) => state.cells[id].removed)
    })
    .map((cell) => cell.id)
}

export function canRemoveAlone(state: PyramidState, cellId: PyramidCellId): boolean {
  return isCellAvailable(state, cellId) && isKing(state.cells[cellId].card)
}

export function canPairCells(
  state: PyramidState,
  idA: PyramidCellId,
  idB: PyramidCellId,
): boolean {
  if (idA === idB) return false
  if (!isCellAvailable(state, idA)) return false
  if (!isCellAvailable(state, idB)) return false
  return sumTo13(state.cells[idA].card, state.cells[idB].card)
}

export function canPairWithWaste(state: PyramidState, cellId: PyramidCellId): boolean {
  if (!isCellAvailable(state, cellId)) return false
  if (state.waste.length === 0) return false
  const wasteTop = state.waste[state.waste.length - 1]
  return sumTo13(state.cells[cellId].card, wasteTop)
}

export function canDraw(state: PyramidState): boolean {
  return state.stock.length > 0
}

export function canRecycle(state: PyramidState, recycleLimit: number): boolean {
  return (
    state.stock.length === 0 &&
    state.waste.length > 0 &&
    state.recyclesUsed < recycleLimit
  )
}

export function isGameWon(state: PyramidState): boolean {
  return Object.values(state.cells).every((cell) => cell.removed)
}

export function isGameLost(state: PyramidState, recycleLimit: number): boolean {
  // Can still draw from stock — not lost
  if (state.stock.length > 0) return false
  // Can recycle — not lost
  if (canRecycle(state, recycleLimit)) return false

  // Check for any valid move among available cells
  const available = getAvailableCells(state)

  // Any king can be removed alone
  for (const cellId of available) {
    if (canRemoveAlone(state, cellId)) return false
  }

  // Any cell pairs summing to 13
  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      if (canPairCells(state, available[i], available[j])) return false
    }
  }

  // Any available cell pairs with waste top
  if (state.waste.length > 0) {
    for (const cellId of available) {
      if (canPairWithWaste(state, cellId)) return false
    }
  }

  return true
}

// --- Alt variant helpers ---

export function canPairWithStock(state: PyramidState, cellId: PyramidCellId): boolean {
  if (state.stock.length === 0) return false
  if (!isCellAvailable(state, cellId)) return false
  const stockTop = state.stock[state.stock.length - 1]
  return sumTo13(state.cells[cellId].card, stockTop)
}

export function canPairStockWithWaste(state: PyramidState): boolean {
  if (state.stock.length === 0) return false
  if (state.waste.length === 0) return false
  const stockTop = state.stock[state.stock.length - 1]
  const wasteTop = state.waste[state.waste.length - 1]
  return sumTo13(stockTop, wasteTop)
}

export function isStockTopKing(state: PyramidState): boolean {
  if (state.stock.length === 0) return false
  return isKing(state.stock[state.stock.length - 1])
}

export function isGameLostAlt(state: PyramidState, recycleLimit: number): boolean {
  // Can recycle — not lost
  if (canRecycle(state, recycleLimit)) return false

  // Stock has cards — check alt-specific moves
  if (state.stock.length > 0) {
    // Stock top is a king — can remove alone
    if (isStockTopKing(state)) return false
    // Non-king stock top can always be drawn to waste — not lost
    return false
  }

  // Check for any valid move among available cells
  const available = getAvailableCells(state)

  // Any king can be removed alone
  for (const cellId of available) {
    if (canRemoveAlone(state, cellId)) return false
  }

  // Any cell pairs summing to 13
  for (let i = 0; i < available.length; i++) {
    for (let j = i + 1; j < available.length; j++) {
      if (canPairCells(state, available[i], available[j])) return false
    }
  }

  // Any available cell pairs with waste top
  if (state.waste.length > 0) {
    for (const cellId of available) {
      if (canPairWithWaste(state, cellId)) return false
    }
  }

  return true
}

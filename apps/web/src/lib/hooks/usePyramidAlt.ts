import { usePyramidAltStore } from '#/lib/stores/pyramid-alt'
import { usePyramidSettingsStore } from '#/lib/stores/pyramid-settings'
import {
  getAvailableCells,
  canDraw as rulesCanDraw,
  canRecycle as rulesCanRecycle,
  isStockTopKing,
} from '#/lib/games/pyramid'
import type { PyramidCell, PyramidCellId } from '#/lib/games/pyramid'
import type { Card } from '#/lib/types'
import type { UsePyramidResult } from './usePyramid'

export interface UsePyramidAltResult extends UsePyramidResult {
  stockTop: Card | null
  stockTopIsKing: boolean
  onRemoveAloneFromStock: () => void
  onRemovePairWithStock: (cellId: PyramidCellId) => void
  onRemovePairStockWithWaste: () => void
}

export function usePyramidAlt(): UsePyramidAltResult {
  const storeState = usePyramidAltStore()
  const recycleLimit = usePyramidSettingsStore((s) => s.recycleLimit)

  const cells = Object.values(storeState.cells).sort((a, b) => {
    const indexA = parseInt(a.id.replace('cell-', ''), 10)
    const indexB = parseInt(b.id.replace('cell-', ''), 10)
    return indexA - indexB
  })

  const availableCells = getAvailableCells(storeState)
  const wasteTop = storeState.waste[storeState.waste.length - 1] ?? null
  const stockTop = storeState.stock[storeState.stock.length - 1] ?? null

  return {
    cells,
    availableCells,
    wasteTop,
    stockCount: storeState.stock.length,
    canDraw: rulesCanDraw(storeState) && storeState.status === 'playing',
    canRecycle: rulesCanRecycle(storeState, recycleLimit) && storeState.status === 'playing',
    recyclesRemaining: recycleLimit - storeState.recyclesUsed,
    score: storeState.score,
    status: storeState.status,
    canUndo: storeState.canUndo,
    onRemoveAlone: storeState.removeAlone,
    onRemovePair: storeState.removePair,
    onRemovePairWithWaste: storeState.removePairWithWaste,
    onDraw: storeState.draw,
    onRecycle: storeState.recycle,
    onNewGame: storeState.newGame,
    onUndo: storeState.undo,
    stockTop,
    stockTopIsKing: isStockTopKing(storeState),
    onRemoveAloneFromStock: storeState.removeAloneFromStock,
    onRemovePairWithStock: storeState.removePairWithStock,
    onRemovePairStockWithWaste: storeState.removePairStockWithWaste,
  }
}

// Re-export base type for convenience
export type { PyramidCell, PyramidCellId }

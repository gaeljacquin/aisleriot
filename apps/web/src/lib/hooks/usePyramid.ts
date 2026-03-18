import { usePyramidStore } from '#/lib/stores/pyramid'
import { usePyramidSettingsStore } from '#/lib/stores/pyramid-settings'
import {
  getAvailableCells,
  canDraw as rulesCanDraw,
  canRecycle as rulesCanRecycle,
} from '#/lib/games/pyramid'
import type { PyramidCell, PyramidCellId } from '#/lib/games/pyramid'
import type { Card, GameStatus } from '#/lib/types'

export interface UsePyramidResult {
  cells: PyramidCell[]
  availableCells: PyramidCellId[]
  wasteTop: Card | null
  stockCount: number
  canDraw: boolean
  canRecycle: boolean
  recyclesRemaining: number
  score: number
  status: GameStatus
  canUndo: boolean
  onRemoveAlone: (id: PyramidCellId) => void
  onRemovePair: (idA: PyramidCellId, idB: PyramidCellId) => void
  onRemovePairWithWaste: (id: PyramidCellId) => void
  onRemoveWasteKing: () => void
  onDraw: () => void
  onRecycle: () => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
}

export function usePyramid(): UsePyramidResult {
  const storeState = usePyramidStore()
  const recycleLimit = usePyramidSettingsStore((s) => s.recycleLimit)

  const cells = Object.values(storeState.cells).sort((a, b) => {
    const indexA = parseInt(a.id.replace('cell-', ''), 10)
    const indexB = parseInt(b.id.replace('cell-', ''), 10)
    return indexA - indexB
  })

  const availableCells = getAvailableCells(storeState)
  const wasteTop = storeState.waste[storeState.waste.length - 1] ?? null

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
    onRemoveWasteKing: storeState.removeWasteKing,
    onDraw: storeState.draw,
    onRecycle: storeState.recycle,
    onNewGame: storeState.newGame,
    onRestartGame: storeState.restartGame,
    onUndo: storeState.undo,
  }
}

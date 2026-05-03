import { useTriPeaksAltStore as useTriPeaksAltStore } from '#/lib/stores/tri-peaks-alt'
import { getAvailableCells, canPlayCard } from '#/lib/games/tri-peaks'
import type { TriPeaksCell, TriPeaksCellId } from '#/lib/games/tri-peaks'
import type { Card, GameStatus } from '#/lib/types'

export interface UseTriPeaksAltResult {
  cells: TriPeaksCell[]
  availableCells: TriPeaksCellId[]
  wasteTop: Card | null
  stockCount: number
  canDraw: boolean
  chain: number
  score: number
  status: GameStatus
  canUndo: boolean
  onPlayCard: (id: TriPeaksCellId) => void
  onDraw: () => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
  isValidMove: (id: TriPeaksCellId) => boolean
  devSetStatus: (status: GameStatus) => void
}

export function useTriPeaksAlt(): UseTriPeaksAltResult {
  const storeState = useTriPeaksAltStore()

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
    canDraw: storeState.stock.length > 0 && storeState.status === 'playing',
    chain: storeState.chain,
    score: storeState.score,
    status: storeState.status,
    canUndo: storeState.canUndo,
    onPlayCard: storeState.playCard,
    onDraw: storeState.draw,
    onNewGame: storeState.newGame,
    onRestartGame: storeState.restartGame,
    onUndo: storeState.undo,
    isValidMove: (id: TriPeaksCellId) => canPlayCard(storeState, id, true),
    devSetStatus: storeState.devSetStatus,
  }
}

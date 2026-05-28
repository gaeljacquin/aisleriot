import { useGolfStore } from '#/lib/stores/golf'
import { canPlayCard } from '#/lib/games/golf'
import type { Card, GameStatus, Pile } from '#/lib/types'

export interface UseGolfResult {
  columns: Pile[]
  wasteTop: Card | null
  wasteCount: number
  stockCount: number
  canDraw: boolean
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  onPlayCard: (columnId: string) => void
  onDraw: () => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
  isValidMove: (columnId: string) => boolean
  devSetStatus: (status: GameStatus) => void
}

export function useGolf(): UseGolfResult {
  const storeState = useGolfStore()

  const wasteTop = storeState.waste[storeState.waste.length - 1] ?? null

  const isValidMove = (columnId: string) => {
    const column = storeState.columns.find((c) => c.id === columnId)
    if (!column || column.cards.length === 0) return false
    const topCard = column.cards[column.cards.length - 1]
    return canPlayCard(storeState, topCard)
  }

  return {
    columns: storeState.columns,
    wasteTop,
    wasteCount: storeState.waste.length,
    stockCount: storeState.stock.length,
    canDraw: storeState.stock.length > 0 && storeState.status === 'playing',
    score: storeState.score,
    moveCount: storeState.moveCount,
    status: storeState.status,
    canUndo: storeState.canUndo,
    onPlayCard: storeState.playCard,
    onDraw: storeState.draw,
    onNewGame: storeState.newGame,
    onRestartGame: storeState.restartGame,
    onUndo: storeState.undo,
    isValidMove,
    devSetStatus: storeState.devSetStatus,
  }
}

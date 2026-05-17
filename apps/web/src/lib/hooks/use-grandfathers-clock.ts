import { useGrandfathersClockStore } from '#/lib/stores/grandfathers-clock'
import {
  isValidFoundationMove,
  TABLEAU_IDS,
  FOUNDATION_IDS,
} from '#/lib/games/grandfathers-clock'
import type { GrandfathersClockMove } from '#/lib/stores/grandfathers-clock'
import type { Card, GameStatus } from '#/lib/types'

export interface GrandfathersClockTableauEntry {
  id: string
  cards: Card[]
}

export interface GrandfathersClockFoundationEntry {
  id: string
  cards: Card[]
}

export interface UseGrandfathersClock {
  tableau: GrandfathersClockTableauEntry[]
  foundation: GrandfathersClockFoundationEntry[]
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  onMoveCard: (move: GrandfathersClockMove) => void
  onAutoMove: (fromPileId: string) => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
  devSetStatus: (status: GameStatus) => void
}

export function useGrandfathersClock(): UseGrandfathersClock {
  const state = useGrandfathersClockStore()

  const tableau: GrandfathersClockTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id],
  }))

  const foundation: GrandfathersClockFoundationEntry[] = FOUNDATION_IDS.map(
    (id) => ({
      id,
      cards: state.foundation[id],
    }),
  )

  function onAutoMove(fromPileId: string) {
    const fromPile = fromPileId.startsWith('tableau-')
      ? state.tableau[fromPileId]
      : state.foundation[fromPileId]
    if (fromPile.length === 0) return

    const fromIndex = fromPile.length - 1
    const card = fromPile[fromIndex]

    // Check all foundations
    for (const toPileId of FOUNDATION_IDS) {
      if (isValidFoundationMove(card, toPileId, state.foundation[toPileId])) {
        state.moveCard({ fromPileId, fromIndex, toPileId })
        return
      }
    }
  }

  return {
    tableau,
    foundation,
    score: Math.max(0, state.score),
    moveCount: state.moveCount,
    status: state.status,
    canUndo: state.canUndo,
    onMoveCard: state.moveCard,
    onAutoMove,
    onNewGame: state.newGame,
    onRestartGame: state.restartGame,
    onUndo: state.undo,
    devSetStatus: state.devSetStatus,
  }
}

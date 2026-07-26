import { useWestcliffStore } from '#/lib/stores/westcliff'
import {
  draggableFromIndex as computeDraggableFromIndex,
  canMoveToFoundation,
  canRedeal as computeCanRedeal,
  TABLEAU_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/westcliff'
import type {
  WestcliffTableauId,
  WestcliffFoundationId,
  WestcliffMove,
} from '#/lib/games/westcliff'
import type { Card, GameStatus, Suit } from '#/lib/types'

export interface WestcliffTableauEntry {
  id: WestcliffTableauId
  cards: Card[]
}

export interface WestcliffFoundationEntry {
  id: WestcliffFoundationId
  cards: Card[]
  suit: Suit
}

export interface UseWestcliffResult {
  tableau: WestcliffTableauEntry[]
  foundation: WestcliffFoundationEntry[]
  waste: Card[]
  stockCount: number
  stockEmpty: boolean
  canRedeal: boolean
  draggableFromIndex: Record<WestcliffTableauId, number>
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  onMoveCard: (move: WestcliffMove) => void
  onMoveCardForce: (move: WestcliffMove) => void
  onAutoMove: (fromPile: string) => void
  onFlipStock: () => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
  devSetStatus: (status: GameStatus) => void
}

export function useWestcliff(): UseWestcliffResult {
  const state = useWestcliffStore()

  const tableau: WestcliffTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id] || [],
  }))

  const foundation: WestcliffFoundationEntry[] = FOUNDATION_IDS.map((id) => ({
    id,
    cards: state.foundation[id] || [],
    suit: FOUNDATION_SUITS[id],
  }))

  const draggableFromIndex: Record<WestcliffTableauId, number> = {} as Record<
    WestcliffTableauId,
    number
  >
  for (const id of TABLEAU_IDS) {
    draggableFromIndex[id] = computeDraggableFromIndex(state, id)
  }

  function onAutoMove(fromPile: string) {
    if (fromPile === 'waste') {
      if (state.waste.length === 0) return
      const fromIndex = state.waste.length - 1
      const card = state.waste[fromIndex]
      if (canMoveToFoundation(state, 'waste', fromIndex)) {
        state.moveCard({
          fromPile: 'waste',
          fromIndex,
          toPile: `foundation-${card.suit}`,
        })
      }
      return
    }

    if (fromPile.startsWith('tableau-')) {
      const pileId = fromPile as WestcliffTableauId
      const pile = state.tableau[pileId]
      if (!pile || pile.length === 0) return
      const fromIndex = pile.length - 1
      const card = pile[fromIndex]
      if (canMoveToFoundation(state, pileId, fromIndex)) {
        state.moveCard({
          fromPile: pileId,
          fromIndex,
          toPile: `foundation-${card.suit}`,
        })
      }
    }
  }

  return {
    tableau,
    foundation,
    waste: state.waste,
    stockCount: state.stock.length,
    stockEmpty: state.stock.length === 0,
    canRedeal: computeCanRedeal(state),
    draggableFromIndex,
    score: Math.max(0, state.score),
    moveCount: state.moveCount,
    status: state.status,
    canUndo: state.canUndo,
    onMoveCard: state.moveCard,
    onMoveCardForce: state.moveCardForce,
    onAutoMove,
    onFlipStock: state.flipStock,
    onNewGame: state.newGame,
    onRestartGame: state.restartGame,
    onUndo: state.undo,
    devSetStatus: state.devSetStatus,
  }
}

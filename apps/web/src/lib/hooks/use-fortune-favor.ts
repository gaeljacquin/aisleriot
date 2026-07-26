import { useFortuneFavorStore } from '#/lib/stores/fortune-favor'
import {
  TABLEAU_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/fortune-favor/types'
import { canMoveToFoundation } from '#/lib/games/fortune-favor/rules'
import type {
  FortuneFavorTableauId,
  FortuneFavorFoundationId,
} from '#/lib/games/fortune-favor/types'
import type { Card, GameStatus, Suit } from '#/lib/types'

export interface FortuneFavorTableauEntry {
  id: FortuneFavorTableauId
  cards: Card[]
}

export interface FortuneFavorFoundationEntry {
  id: FortuneFavorFoundationId
  cards: Card[]
  suit: Suit
}

export interface UseFortuneFavor {
  tableau: FortuneFavorTableauEntry[]
  foundation: FortuneFavorFoundationEntry[]
  stock: Card[]
  waste: Card[]
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  onMoveCard: (move: {
    fromPile: string
    fromIndex: number
    toPile: string
  }) => void
  onMoveCardForce: (move: {
    fromPile: string
    fromIndex: number
    toPile: string
  }) => void
  onAutoMove: (fromPile: string) => void
  onFlipStock: () => void
  onNewGame: (seed?: number) => void
  onRestartGame: () => void
  onUndo: () => void
  devSetStatus: (status: GameStatus) => void
}

export function useFortuneFavor(): UseFortuneFavor {
  const state = useFortuneFavorStore()

  const tableau: FortuneFavorTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id] || [],
  }))

  const foundation: FortuneFavorFoundationEntry[] = FOUNDATION_IDS.map(
    (id, index) => ({
      id,
      cards: state.foundation[id] || [],
      suit: FOUNDATION_SUITS[index],
    }),
  )

  function onAutoMove(fromPile: string) {
    let card: Card | null = null
    let fromIndex: number

    if (fromPile === 'waste') {
      if (state.waste.length === 0) return
      fromIndex = state.waste.length - 1
      card = state.waste[fromIndex]
    } else if (fromPile.startsWith('tableau-')) {
      const pile = state.tableau[fromPile as FortuneFavorTableauId]
      if (!pile || pile.length === 0) return
      fromIndex = pile.length - 1
      card = pile[fromIndex]
    } else {
      return
    }

    if (canMoveToFoundation(state, fromPile as any, fromIndex)) {
      const targetFoundationId = `foundation-${card.suit}`
      state.moveCard({ fromPile, fromIndex, toPile: targetFoundationId })
    }
  }

  return {
    tableau,
    foundation,
    stock: state.stock,
    waste: state.waste,
    score: state.score,
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

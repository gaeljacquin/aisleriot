import { useAcmeStore } from '#/lib/stores/acme'
import {
  TABLEAU_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/acme/types'
import { canMoveToFoundation } from '#/lib/games/acme/rules'
import type { AcmeTableauId, AcmeFoundationId } from '#/lib/games/acme/types'
import type { Card, GameStatus, Suit } from '#/lib/types'

export interface AcmeTableauEntry {
  id: AcmeTableauId
  cards: Card[]
}

export interface AcmeFoundationEntry {
  id: AcmeFoundationId
  cards: Card[]
  suit: Suit
}

export interface UseAcme {
  tableau: AcmeTableauEntry[]
  foundation: AcmeFoundationEntry[]
  reserve: Card[]
  stock: Card[]
  waste: Card[]
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  redealsUsed: number
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

export function useAcme(): UseAcme {
  const state = useAcmeStore()

  const tableau: AcmeTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id],
  }))

  const foundation: AcmeFoundationEntry[] = FOUNDATION_IDS.map((id, index) => ({
    id,
    cards: state.foundation[id],
    suit: FOUNDATION_SUITS[index],
  }))

  function onAutoMove(fromPile: string) {
    let card: Card | null = null
    let fromIndex: number

    if (fromPile === 'waste') {
      if (state.waste.length === 0) return
      fromIndex = state.waste.length - 1
      card = state.waste[fromIndex]
    } else if (fromPile === 'reserve') {
      if (state.reserve.length === 0) return
      fromIndex = state.reserve.length - 1
      card = state.reserve[fromIndex]
    } else if (fromPile.startsWith('tableau-')) {
      const pile = state.tableau[fromPile as AcmeTableauId]
      if (pile.length === 0) return
      fromIndex = pile.length - 1
      card = pile[fromIndex]
    } else {
      return
    }

    // Check if it can move to its foundation
    if (canMoveToFoundation(state, fromPile as any, fromIndex)) {
      // We need to know WHICH foundation it can move to.
      // In Acme, foundations are built by suit.
      const targetFoundationId = `foundation-${card.suit}`
      state.moveCard({ fromPile, fromIndex, toPile: targetFoundationId })
      return
    }
  }

  return {
    tableau,
    foundation,
    reserve: state.reserve,
    stock: state.stock,
    waste: state.waste,
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    canUndo: state.canUndo,
    redealsUsed: state.redealsUsed,
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

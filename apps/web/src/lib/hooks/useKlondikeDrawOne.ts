import { useKlondikeDrawOneStore } from '#/lib/stores/klondike-draw1'
import {
  draggableFromIndex as computeDraggableFromIndex,
  canMoveToFoundation,
  canRedeal as computeCanRedeal,
  isSafeToAutoMove,
  TABLEAU_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/klondike'
import type { KlondikeTableauId, KlondikeFoundationId, KlondikeMove } from '#/lib/games/klondike'
import type { Card, GameStatus, Suit } from '#/lib/types'

export interface KlondikeTableauEntry {
  id: KlondikeTableauId
  cards: Card[]
}

export interface KlondikeFoundationEntry {
  id: KlondikeFoundationId
  cards: Card[]
  suit: Suit
}

export interface UseKlondikeResult {
  tableau: KlondikeTableauEntry[]
  foundation: KlondikeFoundationEntry[]
  waste: Card[]
  stockCount: number
  stockEmpty: boolean
  canRedeal: boolean
  redealsUsed: number
  redealsLeft: number | null // null = unlimited
  drawCount: 1 | 3
  draggableFromIndex: Record<KlondikeTableauId, number>
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  onMoveCard: (move: KlondikeMove) => void
  onMoveCardForce: (move: KlondikeMove) => void
  onAutoMove: (fromPile: string) => void
  onFlipStock: () => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
}

export function useKlondikeDrawOne(): UseKlondikeResult {
  const state = useKlondikeDrawOneStore()

  const tableau: KlondikeTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id],
  }))

  const foundation: KlondikeFoundationEntry[] = FOUNDATION_IDS.map((id) => ({
    id,
    cards: state.foundation[id],
    suit: FOUNDATION_SUITS[id],
  }))

  const draggableFromIndex: Record<KlondikeTableauId, number> = {} as Record<KlondikeTableauId, number>
  for (const id of TABLEAU_IDS) {
    draggableFromIndex[id] = computeDraggableFromIndex(state, id)
  }

  function onAutoMove(fromPile: string) {
    if (fromPile === 'waste') {
      if (state.waste.length === 0) return
      const fromIndex = state.waste.length - 1
      const card = state.waste[fromIndex]
      if (canMoveToFoundation(state, 'waste', fromIndex) && isSafeToAutoMove(state, card)) {
        state.moveCard({ fromPile: 'waste', fromIndex, toPile: `foundation-${card.suit}` as KlondikeFoundationId })
      }
      return
    }

    if (fromPile.startsWith('tableau-')) {
      const pileId = fromPile as KlondikeTableauId
      const pile = state.tableau[pileId]
      if (pile.length === 0) return
      const fromIndex = pile.length - 1
      const card = pile[fromIndex]
      if (canMoveToFoundation(state, pileId, fromIndex) && isSafeToAutoMove(state, card)) {
        state.moveCard({ fromPile: pileId, fromIndex, toPile: `foundation-${card.suit}` as KlondikeFoundationId })
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
    redealsUsed: state.redealsUsed,
    redealsLeft: null, // draw-1 = unlimited
    drawCount: state.drawCount,
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
  }
}

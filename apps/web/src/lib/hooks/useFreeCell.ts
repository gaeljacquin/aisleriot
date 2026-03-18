import { useFreeCellStore } from '#/lib/stores/freecell'
import {
  draggableFromIndex as computeDraggableFromIndex,
  canMoveToFoundation,
  canMoveToFreeCell,
  isSafeToAutoMove,
  TABLEAU_IDS,
  FREECELL_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/freecell'
import type { FreeCellPileId, FreeCellMove } from '#/lib/games/freecell'
import type { Card, GameStatus, Suit } from '#/lib/types'

export interface FreeCellTableauEntry {
  id: FreeCellPileId
  cards: Card[]
}

export interface FreeCellFreeCellEntry {
  id: FreeCellPileId
  card: Card | null
}

export interface FreeCellFoundationEntry {
  id: FreeCellPileId
  cards: Card[]
  suit: Suit
}

export interface UseFreeCell {
  tableau: FreeCellTableauEntry[]
  freeCells: FreeCellFreeCellEntry[]
  foundation: FreeCellFoundationEntry[]
  draggableFromIndex: Record<FreeCellPileId, number>
  score: number
  moveCount: number
  status: GameStatus
  canUndo: boolean
  onMoveCard: (move: FreeCellMove) => void
  onMoveCardForce: (move: FreeCellMove) => void
  onAutoMove: (fromPileId: FreeCellPileId) => void
  onNewGame: () => void
  onRestartGame: () => void
  onUndo: () => void
}

export function useFreeCell(): UseFreeCell {
  const state = useFreeCellStore()

  // Ordered tableau entries
  const tableau: FreeCellTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id] ?? [],
  }))

  // Ordered freecell entries
  const freeCells: FreeCellFreeCellEntry[] = FREECELL_IDS.map((id) => ({
    id,
    card: state.freeCells[id] ?? null,
  }))

  // Ordered foundation entries
  const foundation: FreeCellFoundationEntry[] = FOUNDATION_IDS.map((id) => ({
    id,
    cards: state.foundation[id] ?? [],
    suit: FOUNDATION_SUITS[id],
  }))

  // Compute draggable-from-index for each tableau pile
  const draggableFromIndex: Record<FreeCellPileId, number> = {}
  for (const id of TABLEAU_IDS) {
    draggableFromIndex[id] = computeDraggableFromIndex(state, id)
  }

  function onAutoMove(fromPileId: FreeCellPileId) {
    let card: Card | null = null
    let fromIndex: number

    if (fromPileId.startsWith('tableau-')) {
      const pile = state.tableau[fromPileId]
      if (!pile || pile.length === 0) return
      fromIndex = pile.length - 1
      card = pile[fromIndex]
    } else if (fromPileId.startsWith('freecell-')) {
      card = state.freeCells[fromPileId]
      if (!card) return
      fromIndex = 0
    } else {
      return
    }

    // Prefer foundation if the card can legally and safely go there
    if (canMoveToFoundation(state, fromPileId, fromIndex) && isSafeToAutoMove(state, card)) {
      const toPileId: FreeCellPileId = `foundation-${card.suit}`
      state.moveCard({ fromPileId, fromIndex, toPileId })
      return
    }

    // Otherwise try a free cell (tableau top card only)
    if (canMoveToFreeCell(state, fromPileId, fromIndex)) {
      const emptyFcId = FREECELL_IDS.find((id) => state.freeCells[id] === null)
      if (emptyFcId) {
        state.moveCard({ fromPileId, fromIndex, toPileId: emptyFcId })
      }
    }
  }

  return {
    tableau,
    freeCells,
    foundation,
    draggableFromIndex,
    score: Math.max(0, state.score),
    moveCount: state.moveCount,
    status: state.status,
    canUndo: state.canUndo,
    onMoveCard: state.moveCard,
    onMoveCardForce: state.moveCardForce,
    onAutoMove,
    onNewGame: state.newGame,
    onRestartGame: state.restartGame,
    onUndo: state.undo,
  }
}

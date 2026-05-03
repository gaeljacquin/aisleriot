import { useKlondikeDrawThreeStore } from '#/lib/stores/klondike-draw3'
import { useKlondikeDraw3SettingsStore } from '#/lib/stores/klondike-draw3-settings'
import {
  draggableFromIndex as computeDraggableFromIndex,
  canMoveToFoundation,
  isSafeToAutoMove as _isSafeToAutoMove,
  TABLEAU_IDS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/klondike'
import type {
  KlondikeTableauId,
  KlondikeFoundationId,
} from '#/lib/games/klondike'
import type {
  UseKlondikeResult,
  KlondikeTableauEntry,
  KlondikeFoundationEntry,
} from './useKlondikeDrawOne'

export type { UseKlondikeResult, KlondikeTableauEntry, KlondikeFoundationEntry }

export function useKlondikeDrawThree(): UseKlondikeResult {
  const state = useKlondikeDrawThreeStore()
  const { redealsAllowed } = useKlondikeDraw3SettingsStore()

  const tableau: KlondikeTableauEntry[] = TABLEAU_IDS.map((id) => ({
    id,
    cards: state.tableau[id],
  }))

  const foundation: KlondikeFoundationEntry[] = FOUNDATION_IDS.map((id) => ({
    id,
    cards: state.foundation[id],
    suit: FOUNDATION_SUITS[id],
  }))

  const draggableFromIndex: Record<KlondikeTableauId, number> = {} as Record<
    KlondikeTableauId,
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
          toPile: `foundation-${card.suit}` as KlondikeFoundationId,
        })
      }
      return
    }

    if (fromPile.startsWith('tableau-')) {
      const pileId = fromPile as KlondikeTableauId
      const pile = state.tableau[pileId]
      if (pile.length === 0) return
      const fromIndex = pile.length - 1
      const card = pile[fromIndex]
      if (canMoveToFoundation(state, pileId, fromIndex)) {
        state.moveCard({
          fromPile: pileId,
          fromIndex,
          toPile: `foundation-${card.suit}` as KlondikeFoundationId,
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
    canRedeal:
      state.stock.length === 0 &&
      state.waste.length > 0 &&
      state.redealsUsed < redealsAllowed,
    redealsUsed: state.redealsUsed,
    redealsLeft: Math.max(0, redealsAllowed - state.redealsUsed),
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
    currentDealCount: state.currentDealCount,
    devSetStatus: state.devSetStatus,
  }
}

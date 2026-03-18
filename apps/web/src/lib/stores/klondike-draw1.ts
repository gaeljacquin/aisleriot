import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canMoveToFoundation,
  canMoveToTableau,
  autoFlipTop,
  isGameWon,
  isSafeToAutoMove,
  SCORE_DELTAS,
  FOUNDATION_IDS,
  FOUNDATION_SUITS,
} from '#/lib/games/klondike'
import type { KlondikeState, KlondikeMove, KlondikeTableauId, KlondikeFoundationId } from '#/lib/games/klondike'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { Card } from '#/lib/types'
import { useKlondikeDraw1SettingsStore } from './klondike-draw1-settings'

export interface KlondikeStore extends KlondikeState, HistorySlice<KlondikeState>, StatsSlice {
  moveCard: (move: KlondikeMove) => void
  moveCardForce: (move: KlondikeMove) => void
  flipStock: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
}

function snapshot(state: KlondikeState): KlondikeState {
  return {
    tableau: state.tableau,
    foundation: state.foundation,
    stock: state.stock,
    waste: state.waste,
    drawCount: state.drawCount,
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
    redealsUsed: state.redealsUsed,
  }
}

/**
 * Auto-flip any tableau column whose top card is face-down.
 * Returns [newTableau, scoreGain].
 */
function applyAutoFlips(
  tableau: KlondikeState['tableau'],
): [KlondikeState['tableau'], number] {
  let newTableau = tableau
  let scoreGain = 0

  for (const id of Object.keys(tableau) as KlondikeTableauId[]) {
    const col = tableau[id]
    if (autoFlipTop(col)) {
      const flipped = col.map((c, i) =>
        i === col.length - 1 ? { ...c, faceUp: true } : c,
      )
      newTableau = { ...newTableau, [id]: flipped }
      scoreGain += SCORE_DELTAS.turnOverCard
    }
  }

  return [newTableau, scoreGain]
}

/**
 * Auto-cascade: move cards to foundation only when it is safe to do so.
 */
function applyCascade(state: KlondikeState): KlondikeState {
  let current = state
  let moved = true

  while (moved) {
    moved = false

    for (const pileId of Object.keys(current.tableau) as KlondikeTableauId[]) {
      const pile = current.tableau[pileId]
      if (pile.length === 0) continue
      const fromIndex = pile.length - 1
      const card = pile[fromIndex]
      if (canMoveToFoundation(current, pileId, fromIndex) && isSafeToAutoMove(current, card)) {
        const foundId = `foundation-${card.suit}` as KlondikeFoundationId
        const newTableau = { ...current.tableau, [pileId]: pile.slice(0, -1) }
        const newFoundation = {
          ...current.foundation,
          [foundId]: [...current.foundation[foundId], card],
        }
        const [autoFlippedTableau, flipScore] = applyAutoFlips(newTableau)
        current = {
          ...current,
          tableau: autoFlippedTableau,
          foundation: newFoundation,
          score: current.score + SCORE_DELTAS.tableauToFoundation + flipScore,
        }
        moved = true
        break
      }
    }

    if (!moved && current.waste.length > 0) {
      const fromIndex = current.waste.length - 1
      const card = current.waste[fromIndex]
      if (canMoveToFoundation(current, 'waste', fromIndex) && isSafeToAutoMove(current, card)) {
        const foundId = `foundation-${card.suit}` as KlondikeFoundationId
        const newWaste = current.waste.slice(0, -1)
        const newFoundation = {
          ...current.foundation,
          [foundId]: [...current.foundation[foundId], card],
        }
        current = {
          ...current,
          waste: newWaste,
          foundation: newFoundation,
          score: current.score + SCORE_DELTAS.wasteToFoundation,
        }
        moved = true
      }
    }
  }

  return current
}

/** Extract the moved cards and updated source piles from a move. */
function extractSource(
  move: KlondikeMove,
  state: KlondikeState,
): {
  movedCards: Card[]
  newWaste: Card[]
  newTableau: KlondikeState['tableau']
  newFoundation: KlondikeState['foundation']
} {
  let movedCards: Card[] = []
  let newWaste = state.waste
  let newTableau = state.tableau
  let newFoundation = state.foundation

  if (move.fromPile === 'waste') {
    if (move.fromIndex >= 0 && move.fromIndex < state.waste.length) {
      movedCards = [state.waste[move.fromIndex]]
      newWaste = [...state.waste.slice(0, move.fromIndex), ...state.waste.slice(move.fromIndex + 1)]
    }
  } else if (move.fromPile.startsWith('tableau-')) {
    const pile = state.tableau[move.fromPile as KlondikeTableauId]
    movedCards = pile.slice(move.fromIndex)
    newTableau = { ...newTableau, [move.fromPile]: pile.slice(0, move.fromIndex) }
  } else if (move.fromPile.startsWith('foundation-')) {
    const pile = state.foundation[move.fromPile as KlondikeFoundationId]
    if (pile.length > 0) {
      movedCards = [pile[pile.length - 1]]
      newFoundation = { ...newFoundation, [move.fromPile]: pile.slice(0, -1) }
    }
  }

  return { movedCards, newWaste, newTableau, newFoundation }
}

/** Place moved cards at the destination pile. */
function applyDestination(
  move: KlondikeMove,
  movedCards: Card[],
  tableau: KlondikeState['tableau'],
  foundation: KlondikeState['foundation'],
): {
  newTableau: KlondikeState['tableau']
  newFoundation: KlondikeState['foundation']
} {
  let newTableau = tableau
  let newFoundation = foundation

  if (move.toPile.startsWith('foundation-')) {
    if (movedCards.length > 0) {
      const card = movedCards[0]
      newFoundation = {
        ...newFoundation,
        [move.toPile]: [...newFoundation[move.toPile as KlondikeFoundationId], card],
      }
    }
  } else if (move.toPile.startsWith('tableau-')) {
    const targetPile = newTableau[move.toPile as KlondikeTableauId]
    newTableau = { ...newTableau, [move.toPile]: [...targetPile, ...movedCards] }
  }

  return { newTableau, newFoundation }
}

/** Score delta for a validated move. */
function scoreForMove(move: KlondikeMove): number {
  if (move.toPile.startsWith('foundation-')) {
    if (move.fromPile === 'waste') return SCORE_DELTAS.wasteToFoundation
    if (move.fromPile.startsWith('tableau-')) return SCORE_DELTAS.tableauToFoundation
  }
  if (move.toPile.startsWith('tableau-')) {
    if (move.fromPile === 'waste') return SCORE_DELTAS.wasteToTableau
    if (move.fromPile.startsWith('foundation-')) return SCORE_DELTAS.foundationToTableau
  }
  return 0
}

export const useKlondikeDrawOneStore = create<KlondikeStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(1),

      ...createHistorySlice<KlondikeState>(
        () => get() as KlondikeState & HistorySlice<KlondikeState>,
        (partial) => set(partial as Partial<KlondikeStore>),
      ),

      ...createStatsSlice(
        () => get() as StatsSlice,
        (partial) => set(partial as Partial<KlondikeStore>),
      ),

      moveCard: (move: KlondikeMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPile, fromIndex, toPile } = move

        let isValid = false
        if (toPile.startsWith('foundation-')) {
          isValid = canMoveToFoundation(state, fromPile, fromIndex)
        } else if (toPile.startsWith('tableau-')) {
          isValid = canMoveToTableau(state, fromPile, fromIndex, toPile as KlondikeTableauId)
        }
        if (!isValid) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const scoreDelta = scoreForMove(move)
        const { movedCards, newWaste, newTableau: srcTableau, newFoundation: srcFoundation } =
          extractSource(move, state)
        const { newTableau: dstTableau, newFoundation: dstFoundation } =
          applyDestination(move, movedCards, srcTableau, srcFoundation)

        const [autoFlippedTableau, flipScore] = applyAutoFlips(dstTableau)

        let nextState: KlondikeState = {
          ...state,
          tableau: autoFlippedTableau,
          foundation: dstFoundation,
          waste: newWaste,
          score: state.score + scoreDelta + flipScore,
          moveCount: state.moveCount + 1,
        }

        if (isGameWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({ ...nextState, status: 'won', past, future, canUndo, canRedo } as Partial<KlondikeStore>)
          get().recordWin(finalScore, !state.usedUndo)
        } else {
          set({ ...nextState, past, future, canUndo, canRedo } as Partial<KlondikeStore>)
        }
      },

      moveCardForce: (move: KlondikeMove) => {
        const state = get()
        if (state.status !== 'playing') return
        if (move.fromPile === move.toPile) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const { movedCards, newWaste, newTableau: srcTableau, newFoundation: srcFoundation } =
          extractSource(move, state)
        const { newTableau: dstTableau, newFoundation: dstFoundation } =
          applyDestination(move, movedCards, srcTableau, srcFoundation)

        const [autoFlippedTableau, flipScore] = applyAutoFlips(dstTableau)

        let nextState: KlondikeState = {
          ...state,
          tableau: autoFlippedTableau,
          foundation: dstFoundation,
          waste: newWaste,
          score: state.score + flipScore,
          moveCount: state.moveCount + 1,
        }

        if (isGameWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({ ...nextState, status: 'won', past, future, canUndo, canRedo } as Partial<KlondikeStore>)
          get().recordWin(finalScore, !state.usedUndo)
        } else {
          set({ ...nextState, past, future, canUndo, canRedo } as Partial<KlondikeStore>)
        }
      },

      flipStock: () => {
        const state = get()
        if (state.status !== 'playing') return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        if (state.stock.length > 0) {
          const toDraw = Math.min(state.drawCount, state.stock.length)
          const drawn = state.stock.slice(-toDraw).map((c) => ({ ...c, faceUp: true }))
          const newStock = state.stock.slice(0, state.stock.length - toDraw)
          set({
            stock: newStock,
            waste: [...state.waste, ...drawn],
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<KlondikeStore>)
        } else if (state.waste.length > 0) {
          const redealtCost = useKlondikeDraw1SettingsStore.getState().redealtCost
          const newStock = [...state.waste].reverse().map((c) => ({ ...c, faceUp: false }))
          set({
            stock: newStock,
            waste: [],
            score: Math.max(0, state.score + redealtCost),
            redealsUsed: state.redealsUsed + 1,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<KlondikeStore>)
        }
      },

      newGame: (seed?: number) => {
        const initial = createInitialState(1, seed)
        set({
          ...initial,
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<KlondikeStore>)
      },

      restartGame: () => {
        const { currentSeed } = get()
        const initial = createInitialState(1, currentSeed)
        set({
          ...initial,
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<KlondikeStore>)
      },
    }),
    {
      name: 'klondike-draw1-stats',
      version: 1,
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

useKlondikeDrawOneStore.getState().setHistoryConfig({
  maxDepth: 'unlimited',
  undoScoreMode: 'revert',
})

export { FOUNDATION_IDS, FOUNDATION_SUITS }

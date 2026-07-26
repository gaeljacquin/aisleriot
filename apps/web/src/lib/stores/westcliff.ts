import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, GameStatus } from '#/lib/types'
import {
  isGameWon,
  canMoveToFoundation,
  canMoveToTableau,
} from '../games/westcliff/rules'
import { createInitialState } from '../games/westcliff/deal'
import type {
  WestcliffState,
  WestcliffMove,
  WestcliffTableauId,
  WestcliffFoundationId,
} from '../games/westcliff/types'
import { FOUNDATION_IDS, FOUNDATION_SUITS, TABLEAU_IDS } from '../games/westcliff/types'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'

const SCORE_DELTAS = {
  wasteToTableau: 5,
  wasteToFoundation: 10,
  tableauToFoundation: 10,
  turnOverCard: 5,
  foundationToTableau: -15,
}

interface WestcliffStore
  extends WestcliffState,
    HistorySlice<WestcliffState>,
    StatsSlice {
  moveCard: (move: WestcliffMove) => void
  moveCardForce: (move: WestcliffMove) => void
  flipStock: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: WestcliffState): WestcliffState {
  return {
    tableau: state.tableau,
    foundation: state.foundation,
    stock: state.stock,
    waste: state.waste,
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
 */
function applyAutoFlips(
  tableau: WestcliffState['tableau'],
): [WestcliffState['tableau'], number] {
  let scoreGain = 0
  const newTableau = { ...tableau }
  for (const id of TABLEAU_IDS) {
    const pile = newTableau[id]
    if (pile && pile.length > 0 && !pile[pile.length - 1].faceUp) {
      newTableau[id] = [
        ...pile.slice(0, -1),
        { ...pile[pile.length - 1], faceUp: true },
      ]
      scoreGain += SCORE_DELTAS.turnOverCard
    }
  }
  return [newTableau, scoreGain]
}

/** Extract the moved cards and updated source piles from a move. */
function extractSource(
  move: WestcliffMove,
  state: WestcliffState,
): {
  movedCards: Card[]
  newWaste: Card[]
  newTableau: WestcliffState['tableau']
  newFoundation: WestcliffState['foundation']
} {
  let movedCards: Card[] = []
  let newWaste = state.waste
  let newTableau = state.tableau
  let newFoundation = state.foundation

  if (move.fromPile === 'waste') {
    if (move.fromIndex >= 0 && move.fromIndex < state.waste.length) {
      movedCards = [state.waste[move.fromIndex]]
      newWaste = [
        ...state.waste.slice(0, move.fromIndex),
        ...state.waste.slice(move.fromIndex + 1),
      ]
    }
  } else if (move.fromPile.startsWith('tableau-')) {
    const pile = state.tableau[move.fromPile as WestcliffTableauId]
    if (pile) {
      movedCards = pile.slice(move.fromIndex)
      newTableau = {
        ...newTableau,
        [move.fromPile]: pile.slice(0, move.fromIndex),
      }
    }
  } else if (move.fromPile.startsWith('foundation-')) {
    const pile = state.foundation[move.fromPile as WestcliffFoundationId]
    if (pile && pile.length > 0) {
      movedCards = [pile[pile.length - 1]]
      newFoundation = { ...newFoundation, [move.fromPile]: pile.slice(0, -1) }
    }
  }

  return { movedCards, newWaste, newTableau, newFoundation }
}

/** Place moved cards at the destination pile. */
function applyDestination(
  move: WestcliffMove,
  movedCards: Card[],
  tableau: WestcliffState['tableau'],
  foundation: WestcliffState['foundation'],
): {
  newTableau: WestcliffState['tableau']
  newFoundation: WestcliffState['foundation']
} {
  let newTableau = tableau
  let newFoundation = foundation

  if (move.toPile.startsWith('foundation-')) {
    if (movedCards.length > 0) {
      const card = movedCards[0]
      newFoundation = {
        ...newFoundation,
        [move.toPile]: [
          ...newFoundation[move.toPile as WestcliffFoundationId],
          card,
        ],
      }
    }
  } else if (move.toPile.startsWith('tableau-')) {
    const targetPile = newTableau[move.toPile as WestcliffTableauId] || []
    newTableau = {
      ...newTableau,
      [move.toPile]: [...targetPile, ...movedCards],
    }
  }

  return { newTableau, newFoundation }
}

/** Score delta for a validated move. */
function scoreForMove(move: WestcliffMove): number {
  if (move.toPile.startsWith('foundation-')) {
    if (move.fromPile === 'waste') return SCORE_DELTAS.wasteToFoundation
    if (move.fromPile.startsWith('tableau-'))
      return SCORE_DELTAS.tableauToFoundation
  }
  if (move.toPile.startsWith('tableau-')) {
    if (move.fromPile === 'waste') return SCORE_DELTAS.wasteToTableau
    if (move.fromPile.startsWith('foundation-'))
      return SCORE_DELTAS.foundationToTableau
  }
  return 0
}

export const useWestcliffStore = create<WestcliffStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      ...createHistorySlice<WestcliffState>(
        () => get(),
        (partial) => set(partial as Partial<WestcliffStore>),
      ),

      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<WestcliffStore>),
      ),

      moveCard: (move: WestcliffMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPile, fromIndex, toPile } = move

        let isValid = false
        if (toPile.startsWith('foundation-')) {
          isValid = canMoveToFoundation(state, fromPile, fromIndex)
        } else if (toPile.startsWith('tableau-')) {
          isValid = canMoveToTableau(
            state,
            fromPile,
            fromIndex,
            toPile as WestcliffTableauId,
          )
        }
        if (!isValid) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const scoreDelta = scoreForMove(move)
        const {
          movedCards,
          newWaste,
          newTableau: srcTableau,
          newFoundation: srcFoundation,
        } = extractSource(move, state)

        const { newTableau: dstTableau, newFoundation: dstFoundation } =
          applyDestination(move, movedCards, srcTableau, srcFoundation)

        const [autoFlippedTableau, flipScore] = applyAutoFlips(dstTableau)

        const nextState: WestcliffState = {
          ...state,
          tableau: autoFlippedTableau,
          foundation: dstFoundation,
          waste: newWaste,
          score: state.score + scoreDelta + flipScore,
          moveCount: state.moveCount + 1,
        }

        if (isGameWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({
            ...nextState,
            status: 'won',
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<WestcliffStore>)
          get().recordWin(finalScore, !state.usedUndo)
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<WestcliffStore>)
        }
      },

      moveCardForce: (move: WestcliffMove) => {
        const state = get()
        if (state.status !== 'playing') return
        if (move.fromPile === move.toPile) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const {
          movedCards,
          newWaste,
          newTableau: srcTableau,
          newFoundation: srcFoundation,
        } = extractSource(move, state)

        const { newTableau: dstTableau, newFoundation: dstFoundation } =
          applyDestination(move, movedCards, srcTableau, srcFoundation)

        const [autoFlippedTableau, flipScore] = applyAutoFlips(dstTableau)

        const nextState: WestcliffState = {
          ...state,
          tableau: autoFlippedTableau,
          foundation: dstFoundation,
          waste: newWaste,
          score: state.score + flipScore,
          moveCount: state.moveCount + 1,
        }

        if (isGameWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({
            ...nextState,
            status: 'won',
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<WestcliffStore>)
          get().recordWin(finalScore, !state.usedUndo)
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<WestcliffStore>)
        }
      },

      flipStock: () => {
        const state = get()
        if (state.status !== 'playing') return

        if (state.stock.length > 0) {
          state.pushHistory(snapshot(state))
          const { past, future, canUndo, canRedo } = get()

          const topCard = state.stock[state.stock.length - 1]
          const newStock = state.stock.slice(0, -1)
          set({
            stock: newStock,
            waste: [...state.waste, { ...topCard, faceUp: true }],
            moveCount: state.moveCount + 1,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<WestcliffStore>)
        }
      },

      newGame: (seed?: number) => {
        const initial = createInitialState(seed)
        set({
          ...initial,
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<WestcliffStore>)
      },

      restartGame: () => {
        const { currentSeed } = get()
        const initial = createInitialState(currentSeed)
        set({
          ...initial,
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<WestcliffStore>)
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          get().recordWin(get().score, !get().usedUndo)
        }
        set({ status } as Partial<WestcliffStore>)
      },
    }),
    {
      name: 'westcliff-storage',
      version: 1,
      partialize: (state) => ({ stats: (state as any).stats }),
    },
  ),
)

useWestcliffStore.getState().setHistoryConfig({
  maxDepth: 'unlimited',
  undoScoreMode: 'revert',
})

export { FOUNDATION_IDS, FOUNDATION_SUITS, TABLEAU_IDS }

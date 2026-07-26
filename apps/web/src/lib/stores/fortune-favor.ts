import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, GameStatus } from '#/lib/types'
import {
  canMoveToFoundation,
  canMoveToTableau,
} from '../games/fortune-favor/rules'
import {
  isWon as checkWin,
  isLost as checkLoss,
} from '../games/fortune-favor/win'
import { createInitialState } from '../games/fortune-favor/deal'
import type {
  FortuneFavorState,
  FortuneFavorTableauId,
  FortuneFavorFoundationId,
} from '../games/fortune-favor/types'
import { TABLEAU_IDS } from '../games/fortune-favor/types'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'

interface FortuneFavorMove {
  fromPile: string
  fromIndex: number
  toPile: string
}

interface FortuneFavorStore
  extends FortuneFavorState, HistorySlice<FortuneFavorState>, StatsSlice {
  moveCard: (move: FortuneFavorMove) => void
  moveCardForce: (move: FortuneFavorMove) => void
  flipStock: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: FortuneFavorState): FortuneFavorState {
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
  }
}

/** Extract source cards and return updated source piles */
function extractSource(
  move: FortuneFavorMove,
  state: FortuneFavorState,
): {
  movedCards: Card[]
  newWaste: Card[]
  newTableau: FortuneFavorState['tableau']
  newFoundation: FortuneFavorState['foundation']
} {
  let movedCards: Card[] = []
  let newWaste = state.waste
  let newTableau = state.tableau
  let newFoundation = state.foundation

  if (move.fromPile === 'waste') {
    movedCards = [state.waste[move.fromIndex]]
    newWaste = state.waste.slice(0, move.fromIndex)
  } else if (move.fromPile.startsWith('tableau-')) {
    const pile = state.tableau[move.fromPile as FortuneFavorTableauId]
    movedCards = pile.slice(move.fromIndex)
    newTableau = {
      ...newTableau,
      [move.fromPile]: pile.slice(0, move.fromIndex),
    }
  } else if (move.fromPile.startsWith('foundation-')) {
    const pile = state.foundation[move.fromPile as FortuneFavorFoundationId]
    movedCards = [pile[pile.length - 1]]
    newFoundation = { ...newFoundation, [move.fromPile]: pile.slice(0, -1) }
  }

  return { movedCards, newWaste, newTableau, newFoundation }
}

/** Place moved cards at destination pile */
function applyDestination(
  move: FortuneFavorMove,
  movedCards: Card[],
  tableau: FortuneFavorState['tableau'],
  foundation: FortuneFavorState['foundation'],
): {
  newTableau: FortuneFavorState['tableau']
  newFoundation: FortuneFavorState['foundation']
} {
  let newTableau = tableau
  let newFoundation = foundation

  if (move.toPile.startsWith('foundation-')) {
    const fId = move.toPile as FortuneFavorFoundationId
    newFoundation = {
      ...newFoundation,
      [fId]: [...newFoundation[fId], ...movedCards],
    }
  } else if (move.toPile.startsWith('tableau-')) {
    const tId = move.toPile as FortuneFavorTableauId
    newTableau = {
      ...newTableau,
      [tId]: [...newTableau[tId], ...movedCards],
    }
  }

  return { newTableau, newFoundation }
}

/** Auto-fill empty tableau slots from stock first, then waste */
function applyAutoFills(
  tableau: FortuneFavorState['tableau'],
  stock: Card[],
  waste: Card[],
): {
  autoTableau: FortuneFavorState['tableau']
  autoStock: Card[]
  autoWaste: Card[]
} {
  let autoTableau = { ...tableau }
  let autoStock = [...stock]
  let autoWaste = [...waste]

  let filled = true
  while (filled) {
    filled = false
    for (const id of TABLEAU_IDS) {
      if (autoTableau[id].length === 0) {
        if (autoStock.length > 0) {
          const topCard = autoStock[autoStock.length - 1]
          autoStock = autoStock.slice(0, -1)
          autoTableau = {
            ...autoTableau,
            [id]: [{ ...topCard, faceUp: true }],
          }
          filled = true
        } else if (autoWaste.length > 0) {
          const topCard = autoWaste[autoWaste.length - 1]
          autoWaste = autoWaste.slice(0, -1)
          autoTableau = {
            ...autoTableau,
            [id]: [{ ...topCard, faceUp: true }],
          }
          filled = true
        }
      }
    }
  }

  return { autoTableau, autoStock, autoWaste }
}

export const useFortuneFavorStore = create<FortuneFavorStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      ...createHistorySlice<FortuneFavorState>(
        () => get(),
        (partial) => set(partial as Partial<FortuneFavorStore>),
      ),

      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<FortuneFavorStore>),
      ),

      moveCard: (move: FortuneFavorMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPile, fromIndex, toPile } = move

        let isValid = false
        if (toPile.startsWith('foundation-')) {
          isValid = canMoveToFoundation(state, fromPile as any, fromIndex)
        } else if (toPile.startsWith('tableau-')) {
          isValid = canMoveToTableau(
            state,
            fromPile as any,
            fromIndex,
            toPile as FortuneFavorTableauId,
          )
        }
        if (!isValid) return

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

        // Apply auto-fills for empty tableau slots from stock or waste
        const { autoTableau, autoStock, autoWaste } = applyAutoFills(
          dstTableau,
          state.stock,
          newWaste,
        )

        const nextScore =
          state.score + (toPile.startsWith('foundation-') ? 10 : 0)
        const nextMoveCount = state.moveCount + 1

        const nextState = {
          tableau: autoTableau,
          foundation: dstFoundation,
          stock: autoStock,
          waste: autoWaste,
          score: nextScore,
          moveCount: nextMoveCount,
        }

        if (checkWin({ ...state, ...nextState })) {
          set({
            ...nextState,
            status: 'won',
            past,
            future,
            canUndo,
            canRedo,
          })
          get().recordWin(nextScore, !state.usedUndo)
        } else if (checkLoss({ ...state, ...nextState })) {
          set({
            ...nextState,
            status: 'lost',
            past,
            future,
            canUndo,
            canRedo,
          })
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          })
        }
      },

      moveCardForce: (move: FortuneFavorMove) => {
        const state = get()
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

        const { autoTableau, autoStock, autoWaste } = applyAutoFills(
          dstTableau,
          state.stock,
          newWaste,
        )

        const nextScore = state.score + 10
        const nextMoveCount = state.moveCount + 1

        const nextState = {
          tableau: autoTableau,
          foundation: dstFoundation,
          stock: autoStock,
          waste: autoWaste,
          score: nextScore,
          moveCount: nextMoveCount,
        }

        if (checkWin({ ...state, ...nextState })) {
          set({
            ...nextState,
            status: 'won',
            past,
            future,
            canUndo,
            canRedo,
          })
          get().recordWin(nextScore, !state.usedUndo)
        } else if (checkLoss({ ...state, ...nextState })) {
          set({
            ...nextState,
            status: 'lost',
            past,
            future,
            canUndo,
            canRedo,
          })
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          })
        }
      },

      flipStock: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (state.stock.length === 0) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const topCard = state.stock[state.stock.length - 1]
        const remainingStock = state.stock.slice(0, -1)
        const updatedWaste = [...state.waste, { ...topCard, faceUp: true }]

        // Auto-fill empty tableau slots if any exist
        const { autoTableau, autoStock, autoWaste } = applyAutoFills(
          state.tableau,
          remainingStock,
          updatedWaste,
        )

        const nextState = {
          tableau: autoTableau,
          stock: autoStock,
          waste: autoWaste,
          moveCount: state.moveCount + 1,
        }

        if (checkLoss({ ...state, ...nextState })) {
          set({
            ...nextState,
            status: 'lost',
            past,
            future,
            canUndo,
            canRedo,
          })
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          })
        }
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          const s = get()
          s.recordWin(s.score, !s.usedUndo)
        }
        set({ status } as Partial<FortuneFavorStore>)
      },

      newGame: (seed?: number) => {
        set({
          ...createInitialState(seed),
          past: [],
          future: [],
        } as Partial<FortuneFavorStore>)
      },

      restartGame: () => {
        const state = get()
        set({
          ...createInitialState(state.currentSeed),
          past: [],
          future: [],
        } as Partial<FortuneFavorStore>)
      },
    }),
    {
      name: 'fortune-favor-storage',
      partialize: (state) => ({
        stats: state.stats,
      }),
    },
  ),
)

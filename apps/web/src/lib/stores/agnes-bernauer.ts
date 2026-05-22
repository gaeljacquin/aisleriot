import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, GameStatus } from '#/lib/types'
import {
  isGameWon,
  canMoveToFoundation,
  canMoveToTableau,
  getFoundationTargetId,
  SCORE_DELTAS,
} from '../games/agnes-bernauer'
import { createInitialState } from '../games/agnes-bernauer/deal'
import type {
  AgnesBernauerState,
  AgnesBernauerMove,
  AgnesBernauerTableauId,
  AgnesBernauerFoundationId,
  AgnesBernauerReserveId,
} from '../games/agnes-bernauer/types'
import {
  TABLEAU_IDS,
  FOUNDATION_IDS,
  RESERVE_IDS,
} from '../games/agnes-bernauer/types'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'

interface AgnesBernauerStore
  extends AgnesBernauerState, HistorySlice<AgnesBernauerState>, StatsSlice {
  moveCard: (move: AgnesBernauerMove) => void
  moveCardForce: (move: AgnesBernauerMove) => void
  flipStock: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  autoMove: (fromPile: AgnesBernauerTableauId | AgnesBernauerReserveId) => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: AgnesBernauerState): AgnesBernauerState {
  return {
    tableau: state.tableau,
    foundation: state.foundation,
    foundationSuits: state.foundationSuits,
    reserve: state.reserve,
    stock: state.stock,
    baseRank: state.baseRank,
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
  }
}

function extractSource(
  move: AgnesBernauerMove,
  state: AgnesBernauerState,
): {
  movedCards: Card[]
  newReserve: AgnesBernauerState['reserve']
  newTableau: AgnesBernauerState['tableau']
  newFoundation: AgnesBernauerState['foundation']
} {
  let movedCards: Card[] = []
  let newReserve = state.reserve
  let newTableau = state.tableau
  let newFoundation = state.foundation

  if (move.fromPile.startsWith('reserve-')) {
    const pid = move.fromPile as AgnesBernauerReserveId
    const pile = state.reserve[pid]
    movedCards = [pile[move.fromIndex]]
    newReserve = {
      ...state.reserve,
      [pid]: pile.slice(0, move.fromIndex),
    }
  } else if (move.fromPile.startsWith('tableau-')) {
    const pid = move.fromPile as AgnesBernauerTableauId
    const pile = state.tableau[pid]
    movedCards = pile.slice(move.fromIndex)
    newTableau = {
      ...state.tableau,
      [pid]: pile.slice(0, move.fromIndex),
    }
  } else if (move.fromPile.startsWith('foundation-')) {
    const pid = move.fromPile as AgnesBernauerFoundationId
    const pile = state.foundation[pid]
    movedCards = [pile[move.fromIndex]]
    newFoundation = {
      ...state.foundation,
      [pid]: pile.slice(0, move.fromIndex),
    }
  }

  return { movedCards, newReserve, newTableau, newFoundation }
}

export const useAgnesBernauerStore = create<AgnesBernauerStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      ...createHistorySlice<AgnesBernauerState>(
        () => get(),
        (partial) => set(partial as Partial<AgnesBernauerStore>),
      ),
      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<AgnesBernauerStore>),
      ),

      newGame: (seed?: number) => {
        const state = createInitialState(seed)
        set({
          ...state,
          moveCount: 0,
          usedUndo: false,
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<AgnesBernauerStore>)
      },

      restartGame: () => {
        const seed = get().currentSeed
        get().newGame(seed)
      },

      autoMove: (fromPile: AgnesBernauerTableauId | AgnesBernauerReserveId) => {
        const state = get()
        if (state.status !== 'playing') return

        let card: Card | null = null
        let fromIndex = -1

        if (fromPile.startsWith('tableau-')) {
          const pile = state.tableau[fromPile as AgnesBernauerTableauId]
          if (pile.length > 0) {
            fromIndex = pile.length - 1
            card = pile[fromIndex]
          }
        } else if (fromPile.startsWith('reserve-')) {
          const pile = state.reserve[fromPile as AgnesBernauerReserveId]
          if (pile.length > 0) {
            fromIndex = pile.length - 1
            card = pile[fromIndex]
          }
        }

        if (card && canMoveToFoundation(state, fromPile, fromIndex)) {
          get().moveCardForce({
            fromPile,
            fromIndex,
            toPile: 'foundation-0', // placeholder, moveCardForce uses getFoundationTargetId
          })
        }
      },

      moveCard: (move: AgnesBernauerMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const isValid = move.toPile.startsWith('tableau-')
          ? canMoveToTableau(
              state,
              move.fromPile,
              move.fromIndex,
              move.toPile as AgnesBernauerTableauId,
            )
          : canMoveToFoundation(state, move.fromPile, move.fromIndex)

        if (!isValid) return
        get().moveCardForce(move)
      },

      moveCardForce: (move: AgnesBernauerMove) => {
        const state = get()
        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const { movedCards, newReserve, newTableau, newFoundation } =
          extractSource(move, state)

        let finalTableau = newTableau
        let finalFoundation = newFoundation
        let scoreGain = 0

        if (move.toPile.startsWith('tableau-')) {
          const tid = move.toPile as AgnesBernauerTableauId
          finalTableau = {
            ...finalTableau,
            [tid]: [...finalTableau[tid], ...movedCards],
          }
          if (move.fromPile.startsWith('reserve-'))
            scoreGain += SCORE_DELTAS.reserveToTableau
          if (move.fromPile.startsWith('foundation-'))
            scoreGain += SCORE_DELTAS.foundationToTableau
        } else {
          const fid = getFoundationTargetId(state, movedCards[0])!
          finalFoundation = {
            ...finalFoundation,
            [fid]: [...finalFoundation[fid], ...movedCards],
          }
          if (move.fromPile.startsWith('reserve-'))
            scoreGain += SCORE_DELTAS.reserveToFoundation
          if (move.fromPile.startsWith('tableau-'))
            scoreGain += SCORE_DELTAS.tableauToFoundation
        }

        const nextState: AgnesBernauerState = {
          ...state,
          tableau: finalTableau,
          foundation: finalFoundation,
          reserve: newReserve,
          score: state.score + scoreGain,
          moveCount: state.moveCount + 1,
        }

        if (isGameWon(nextState)) {
          nextState.status = 'won'
          get().recordWin(nextState.score, !state.usedUndo)
        }

        set({
          ...nextState,
          past,
          future,
          canUndo,
          canRedo,
        } as Partial<AgnesBernauerStore>)
      },

      flipStock: () => {
        const state = get()
        if (state.stock.length === 0 || state.status !== 'playing') return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const newStock = [...state.stock]
        const newReserve = { ...state.reserve }

        for (const rid of RESERVE_IDS) {
          if (newStock.length > 0) {
            const card = { ...newStock.pop()!, faceUp: true }
            newReserve[rid] = [...newReserve[rid], card]
          }
        }

        set({
          stock: newStock,
          reserve: newReserve,
          moveCount: state.moveCount + 1,
          past,
          future,
          canUndo,
          canRedo,
        } as Partial<AgnesBernauerStore>)
      },

      devSetStatus: (status: GameStatus) => {
        set({ status })
        if (status === 'won') {
          get().recordWin(get().score, !get().usedUndo)
        }
      },
    }),
    {
      name: 'agnes-bernauer-storage',
      partialize: (state) => ({
        tableau: state.tableau,
        foundation: state.foundation,
        foundationSuits: state.foundationSuits,
        reserve: state.reserve,
        stock: state.stock,
        baseRank: state.baseRank,
        score: state.score,
        moveCount: state.moveCount,
        status: state.status,
        usedUndo: state.usedUndo,
        currentSeed: state.currentSeed,
        stats: state.stats,
      }),
    },
  ),
)

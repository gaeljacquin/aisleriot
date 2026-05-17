import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  isValidFoundationMove,
  isValidTableauMove,
  isWon,
} from '#/lib/games/grandfathers-clock'
import type { GrandfathersClockState } from '#/lib/games/grandfathers-clock'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { GameStatus } from '#/lib/types'

export type GrandfathersClockMove = {
  fromPileId: string
  toPileId: string
  fromIndex: number
}

export interface GrandfathersClockStore
  extends
    GrandfathersClockState,
    HistorySlice<GrandfathersClockState>,
    StatsSlice {
  moveCard: (move: GrandfathersClockMove) => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

const SCORE_DELTAS = {
  toFoundation: 10,
}

function snapshot(state: GrandfathersClockState): GrandfathersClockState {
  return {
    tableau: { ...state.tableau },
    foundation: { ...state.foundation },
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    currentSeed: state.currentSeed,
    usedUndo: state.usedUndo,
  }
}

export const useGrandfathersClockStore = create<GrandfathersClockStore>()(
  persist(
    (set, get) => ({
      // Initial game state
      ...createInitialState(),

      // History slice
      ...createHistorySlice<GrandfathersClockState>(
        () => get(),
        (partial) => set(partial as Partial<GrandfathersClockStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<GrandfathersClockStore>),
      ),

      moveCard: (move: GrandfathersClockMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPileId, fromIndex, toPileId } = move

        // Only single card moves are allowed in Grandfather's Clock
        // Check if it's the top card
        const fromPile = fromPileId.startsWith('tableau-')
          ? state.tableau[fromPileId]
          : state.foundation[fromPileId]
        if (fromIndex !== fromPile.length - 1) return

        const card = fromPile[fromIndex]
        if (
          !toPileId.startsWith('tableau-') &&
          !toPileId.startsWith('foundation-')
        )
          return

        // --- Validate ---
        let isValid = false
        if (toPileId.startsWith('foundation-')) {
          isValid = isValidFoundationMove(
            card,
            toPileId,
            state.foundation[toPileId],
          )
        } else if (toPileId.startsWith('tableau-')) {
          isValid = isValidTableauMove(card, state.tableau[toPileId])
        }

        if (!isValid) return

        // Push history before mutating
        state.pushHistory(snapshot(state))

        // --- Apply move ---
        const tableau = { ...state.tableau }
        const foundation = { ...state.foundation }

        // Remove from source
        if (fromPileId.startsWith('tableau-')) {
          tableau[fromPileId] = tableau[fromPileId].slice(0, -1)
        } else if (fromPileId.startsWith('foundation-')) {
          foundation[fromPileId] = foundation[fromPileId].slice(0, -1)
        }

        // Add to destination
        let scoreDelta = 0
        if (toPileId.startsWith('foundation-')) {
          foundation[toPileId] = [...foundation[toPileId], card]
          scoreDelta = SCORE_DELTAS.toFoundation
        } else if (toPileId.startsWith('tableau-')) {
          tableau[toPileId] = [...tableau[toPileId], card]
        }

        const nextState: GrandfathersClockState = {
          ...state,
          tableau,
          foundation,
          score: state.score + scoreDelta,
          moveCount: state.moveCount + 1,
        }

        // --- Check win ---
        if (isWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({
            ...nextState,
            status: 'won',
          } as Partial<GrandfathersClockStore>)
          get().recordWin(finalScore, !get().usedUndo)
        } else {
          set(nextState as Partial<GrandfathersClockStore>)
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
          usedUndo: false,
        } as Partial<GrandfathersClockStore>)
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
          usedUndo: false,
        } as Partial<GrandfathersClockStore>)
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          get().recordWin(get().score, !get().usedUndo)
        }
        set({ status } as Partial<GrandfathersClockStore>)
      },
    }),
    {
      name: 'grandfathers-clock-stats',
      version: 1,
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

useGrandfathersClockStore.getState().setHistoryConfig({
  maxDepth: 'unlimited',
  undoScoreMode: 'penalize',
  undoPenaltyScore: 5,
})

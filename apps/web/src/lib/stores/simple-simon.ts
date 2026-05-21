import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canMoveToTableau,
  findCompletedSequence,
  isGameWon,
  SCORE_DELTAS,
} from '#/lib/games/simple-simon'
import type {
  SimpleSimonState,
  SimpleSimonMove,
  SimpleSimonTableauId,
} from '#/lib/games/simple-simon'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { GameStatus } from '#/lib/types'

export interface SimpleSimonStore
  extends SimpleSimonState, HistorySlice<SimpleSimonState>, StatsSlice {
  moveCard: (move: SimpleSimonMove) => void
  moveCardForce: (move: SimpleSimonMove) => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: SimpleSimonState): SimpleSimonState {
  return {
    tableau: { ...state.tableau },
    foundations: { ...state.foundations },
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
  }
}

export const useSimpleSimonStore = create<SimpleSimonStore>()(
  persist(
    (set, get) => ({
      // Initial game state
      ...createInitialState(),

      // History slice
      ...createHistorySlice<SimpleSimonState>(
        () => get(),
        (partial) => set(partial as Partial<SimpleSimonStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<SimpleSimonStore>),
      ),

      moveCard: (move: SimpleSimonMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPileId, fromIndex, toPileId } = move

        if (!canMoveToTableau(state, fromPileId, fromIndex, toPileId)) {
          return
        }

        // Push to history before move
        get().pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const tableau = { ...state.tableau }
        const fromPile = [...tableau[fromPileId as SimpleSimonTableauId]]
        const toPile = [...tableau[toPileId as SimpleSimonTableauId]]

        const movingCards = fromPile.splice(fromIndex)
        toPile.push(...movingCards)

        tableau[fromPileId as SimpleSimonTableauId] = fromPile
        tableau[toPileId as SimpleSimonTableauId] = toPile

        let nextState: SimpleSimonState = {
          ...state,
          tableau,
          moveCount: state.moveCount + 1,
          score: Math.max(0, state.score + SCORE_DELTAS.move),
        }

        // Check for completed suits and move them to foundations
        let completedMove = findCompletedSequence(nextState)
        while (completedMove) {
          const {
            fromPileId: compFromId,
            fromIndex: compFromIdx,
            toPileId: compToId,
          } = completedMove

          const pile = [
            ...nextState.tableau[compFromId as SimpleSimonTableauId],
          ]
          const sequence = pile.splice(compFromIdx, 13)

          nextState = {
            ...nextState,
            tableau: {
              ...nextState.tableau,
              [compFromId]: pile,
            },
            foundations: {
              ...nextState.foundations,
              [compToId]: sequence,
            },
            score: nextState.score + SCORE_DELTAS.completeSuit,
          }

          completedMove = findCompletedSequence(nextState)
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
        })
      },

      moveCardForce: (move: SimpleSimonMove) => {
        const state = get()
        const { fromPileId, fromIndex, toPileId } = move

        if (fromPileId === toPileId) return

        // Push to history before move
        get().pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const tableau = { ...state.tableau }
        const fromPile = [...tableau[fromPileId as SimpleSimonTableauId]]
        const toPile = [...tableau[toPileId as SimpleSimonTableauId]]

        const movingCards = fromPile.splice(fromIndex)
        toPile.push(...movingCards)

        tableau[fromPileId as SimpleSimonTableauId] = fromPile
        tableau[toPileId as SimpleSimonTableauId] = toPile

        let nextState: SimpleSimonState = {
          ...state,
          tableau,
          moveCount: state.moveCount + 1,
          score: Math.max(0, state.score + SCORE_DELTAS.move),
        }

        // Check for completed suits and move them to foundations
        let completedMove = findCompletedSequence(nextState)
        while (completedMove) {
          const {
            fromPileId: compFromId,
            fromIndex: compFromIdx,
            toPileId: compToId,
          } = completedMove

          const pile = [
            ...nextState.tableau[compFromId as SimpleSimonTableauId],
          ]
          const sequence = pile.splice(compFromIdx, 13)

          nextState = {
            ...nextState,
            tableau: {
              ...nextState.tableau,
              [compFromId]: pile,
            },
            foundations: {
              ...nextState.foundations,
              [compToId]: sequence,
            },
            score: nextState.score + SCORE_DELTAS.completeSuit,
          }

          completedMove = findCompletedSequence(nextState)
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
        })
      },

      newGame: (seed?: number) => {
        const s = seed ?? Math.floor(Math.random() * 1000000)
        set({
          ...createInitialState(s),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        })
      },

      restartGame: () => {
        const { currentSeed } = get()
        set({
          ...createInitialState(currentSeed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        })
      },

      devSetStatus: (status: GameStatus) => {
        const state = get()
        set({ status })
        if (status === 'won') get().recordWin(state.score, !state.usedUndo)
      },
    }),
    {
      name: 'simple-simon-storage',
      partialize: (state) => ({
        tableau: state.tableau,
        foundations: state.foundations,
        score: state.score,
        moveCount: state.moveCount,
        status: state.status,
        usedUndo: state.usedUndo,
        currentSeed: state.currentSeed,
      }),
    },
  ),
)

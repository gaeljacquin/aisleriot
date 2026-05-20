import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canPlayCard,
  canDraw,
  isGameWon,
  isGameLost,
} from '#/lib/games/golf'
import type { GolfState } from '#/lib/games/golf'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { GameStatus } from '#/lib/types'

export interface GolfStore
  extends GolfState, HistorySlice<GolfState>, StatsSlice {
  playCard: (columnId: string) => void
  draw: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

export const useGolfStore = create<GolfStore>()(
  persist(
    (set, get) => ({
      // Game state (initial)
      ...createInitialState(),

      // History slice
      ...createHistorySlice<GolfState>(
        () => get(),
        (partial) => set(partial as Partial<GolfStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<GolfStore>),
      ),

      playCard: (columnId: string) => {
        const state = get()
        if (state.status !== 'playing') return

        const column = state.columns.find((c) => c.id === columnId)
        if (!column || column.cards.length === 0) return

        const topCard = column.cards[column.cards.length - 1]
        if (!canPlayCard(state, topCard)) return

        // Push history
        state.pushHistory({
          columns: state.columns,
          stock: state.stock,
          waste: state.waste,
          score: state.score,
          moveCount: state.moveCount,
          status: state.status,
          usedUndo: state.usedUndo,
          currentSeed: state.currentSeed,
        })

        const newColumns = state.columns.map((c) => {
          if (c.id === columnId) {
            return {
              ...c,
              cards: c.cards.slice(0, c.cards.length - 1),
            }
          }
          return c
        })

        const newWaste = [...state.waste, { ...topCard, faceUp: true }]
        const newScore = state.score + 1
        const newMoveCount = state.moveCount + 1

        const nextState: Partial<GolfState> = {
          columns: newColumns,
          waste: newWaste,
          score: newScore,
          moveCount: newMoveCount,
        }

        const tempState: GolfState = { ...state, ...nextState }

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<GolfStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLost(tempState)) {
          set({ ...nextState, status: 'lost' } as Partial<GolfStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<GolfStore>)
        }
      },

      draw: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canDraw(state)) return

        // Push history
        state.pushHistory({
          columns: state.columns,
          stock: state.stock,
          waste: state.waste,
          score: state.score,
          moveCount: state.moveCount,
          status: state.status,
          usedUndo: state.usedUndo,
          currentSeed: state.currentSeed,
        })

        const drawnCard = state.stock[state.stock.length - 1]
        const newStock = state.stock.slice(0, state.stock.length - 1)
        const newWaste = [...state.waste, { ...drawnCard, faceUp: true }]
        const newMoveCount = state.moveCount + 1

        const nextState: Partial<GolfState> = {
          stock: newStock,
          waste: newWaste,
          moveCount: newMoveCount,
        }

        const tempState: GolfState = { ...state, ...nextState }

        if (isGameLost(tempState)) {
          set({ ...nextState, status: 'lost' } as Partial<GolfStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<GolfStore>)
        }
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          const s = get()
          s.recordWin(s.score, !s.usedUndo)
        }
        set({ status } as Partial<GolfStore>)
      },

      newGame: (seed?: number) => {
        set({
          ...createInitialState(seed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<GolfStore>)
      },

      restartGame: () => {
        const { currentSeed } = get()
        set({
          ...createInitialState(currentSeed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<GolfStore>)
      },
    }),
    {
      name: 'golf-stats',
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

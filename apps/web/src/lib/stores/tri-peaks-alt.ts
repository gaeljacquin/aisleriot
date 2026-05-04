import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canPlayCard,
  canDraw,
  isGameWon,
  isGameLost,
  calculateChainPoints,
} from '#/lib/games/tri-peaks'
import type { TriPeaksState, TriPeaksCellId } from '#/lib/games/tri-peaks'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { GameStatus } from '#/lib/types'

export interface TriPeaksAltStore
  extends TriPeaksState, HistorySlice<TriPeaksState>, StatsSlice {
  playCard: (cellId: TriPeaksCellId) => void
  draw: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

export const useTriPeaksAltStore = create<TriPeaksAltStore>()(
  persist(
    (set, get) => ({
      // Game state (initial)
      ...createInitialState(),

      // History slice
      ...createHistorySlice<TriPeaksState>(
        () => get() as TriPeaksState & HistorySlice<TriPeaksState>,
        (partial) => set(partial as Partial<TriPeaksAltStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get() as StatsSlice,
        (partial) => set(partial as Partial<TriPeaksAltStore>),
      ),

      playCard: (cellId: TriPeaksCellId) => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canPlayCard(state, cellId, true)) return

        // Push current game state snapshot to history before mutating
        const snapshot: TriPeaksState = {
          cells: state.cells,
          stock: state.stock,
          waste: state.waste,
          chain: state.chain,
          score: state.score,
          moveCount: state.moveCount,
          status: state.status,
          usedUndo: state.usedUndo,
          currentSeed: state.currentSeed,
        }
        state.pushHistory(snapshot)

        const cell = state.cells[cellId]
        const newChain = state.chain + 1
        const points = calculateChainPoints(state.chain) // chain before increment
        const newScore = state.score + points

        const updatedCells = {
          ...state.cells,
          [cellId]: { ...cell, removed: true },
        }

        const newWaste = [...state.waste, { ...cell.card, faceUp: true }]

        const nextState: Partial<TriPeaksState> = {
          cells: updatedCells,
          waste: newWaste,
          chain: newChain,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: TriPeaksState = { ...state, ...nextState }

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<TriPeaksAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (state.stock.length === 0 && isGameLost(tempState, true)) {
          set({ ...nextState, status: 'lost' } as Partial<TriPeaksAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<TriPeaksAltStore>)
        }
      },

      draw: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canDraw(state)) return

        // Push snapshot before draw
        const snapshot: TriPeaksState = {
          cells: state.cells,
          stock: state.stock,
          waste: state.waste,
          chain: state.chain,
          score: state.score,
          moveCount: state.moveCount,
          status: state.status,
          usedUndo: state.usedUndo,
          currentSeed: state.currentSeed,
        }
        state.pushHistory(snapshot)

        const drawnCard = state.stock[state.stock.length - 1]
        const newStock = state.stock.slice(0, state.stock.length - 1)
        const newWaste = [...state.waste, { ...drawnCard, faceUp: true }]

        const nextState: Partial<TriPeaksState> = {
          stock: newStock,
          waste: newWaste,
          chain: 0,
          moveCount: state.moveCount + 1,
        }

        const tempState: TriPeaksState = { ...state, ...nextState }

        if (newStock.length === 0 && isGameLost(tempState, true)) {
          set({ ...nextState, status: 'lost' } as Partial<TriPeaksAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<TriPeaksAltStore>)
        }
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          const s = get()
          s.recordWin(s.score, !s.usedUndo)
        }
        set({ status } as Partial<TriPeaksAltStore>)
      },

      newGame: (seed?: number) => {
        set({
          ...createInitialState(seed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<TriPeaksAltStore>)
      },

      restartGame: () => {
        const { currentSeed } = get()
        set({
          ...createInitialState(currentSeed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<TriPeaksAltStore>)
      },
    }),
    {
      name: 'tri-peaks-alt-stats',
      // Only persist the stats slice
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

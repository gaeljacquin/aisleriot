import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canRemoveAlone,
  canPairCells,
  canPairWithWaste,
  canDraw,
  canRecycle as rulesCanRecycle,
  isGameWon,
  isGameLost,
  isKing,
  REMOVE_PAIR_POINTS,
  KING_POINTS,
} from '#/lib/games/pyramid'
import type { PyramidState, PyramidCellId } from '#/lib/games/pyramid'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import { usePyramidSettingsStore } from './pyramid-settings'

export interface PyramidStore extends PyramidState, HistorySlice<PyramidState>, StatsSlice {
  removeAlone: (cellId: PyramidCellId) => void
  removePair: (idA: PyramidCellId, idB: PyramidCellId) => void
  removePairWithWaste: (cellId: PyramidCellId) => void
  removeWasteKing: () => void
  draw: () => void
  recycle: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
}

function snapshot(state: PyramidState): PyramidState {
  return {
    cells: state.cells,
    stock: state.stock,
    waste: state.waste,
    recyclesUsed: state.recyclesUsed,
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
  }
}

export const usePyramidStore = create<PyramidStore>()(
  persist(
    (set, get) => ({
      // Initial game state — recycleLimit from settings store
      ...createInitialState(usePyramidSettingsStore.getState().recycleLimit),

      // History slice
      ...createHistorySlice<PyramidState>(
        () => get() as PyramidState & HistorySlice<PyramidState>,
        (partial) => set(partial as Partial<PyramidStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get() as StatsSlice,
        (partial) => set(partial as Partial<PyramidStore>),
      ),

      removeAlone: (cellId: PyramidCellId) => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canRemoveAlone(state, cellId)) return

        state.pushHistory(snapshot(state))

        const cell = state.cells[cellId]
        const newScore = state.score + KING_POINTS
        const updatedCells = {
          ...state.cells,
          [cellId]: { ...cell, removed: true },
        }

        const nextState: Partial<PyramidState> = {
          cells: updatedCells,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLost(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidStore>)
        }
      },

      removePair: (idA: PyramidCellId, idB: PyramidCellId) => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canPairCells(state, idA, idB)) return

        state.pushHistory(snapshot(state))

        const cellA = state.cells[idA]
        const cellB = state.cells[idB]
        const newScore = state.score + REMOVE_PAIR_POINTS
        const updatedCells = {
          ...state.cells,
          [idA]: { ...cellA, removed: true },
          [idB]: { ...cellB, removed: true },
        }

        const nextState: Partial<PyramidState> = {
          cells: updatedCells,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLost(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidStore>)
        }
      },

      removePairWithWaste: (cellId: PyramidCellId) => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canPairWithWaste(state, cellId)) return

        state.pushHistory(snapshot(state))

        const cell = state.cells[cellId]
        const newScore = state.score + REMOVE_PAIR_POINTS
        const updatedCells = {
          ...state.cells,
          [cellId]: { ...cell, removed: true },
        }
        const newWaste = state.waste.slice(0, state.waste.length - 1)

        const nextState: Partial<PyramidState> = {
          cells: updatedCells,
          waste: newWaste,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLost(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidStore>)
        }
      },

      removeWasteKing: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (state.waste.length === 0) return
        const wasteTop = state.waste[state.waste.length - 1]
        if (!isKing(wasteTop)) return

        state.pushHistory(snapshot(state))

        const newWaste = state.waste.slice(0, state.waste.length - 1)
        const newScore = state.score + KING_POINTS

        const nextState: Partial<PyramidState> = {
          waste: newWaste,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLost(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidStore>)
        }
      },

      draw: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canDraw(state)) return

        state.pushHistory(snapshot(state))

        const drawnCard = state.stock[state.stock.length - 1]
        const newStock = state.stock.slice(0, state.stock.length - 1)
        const newWaste = [...state.waste, { ...drawnCard, faceUp: true }]

        const nextState: Partial<PyramidState> = {
          stock: newStock,
          waste: newWaste,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameLost(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidStore>)
        }
      },

      recycle: () => {
        const state = get()
        if (state.status !== 'playing') return
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit
        if (!rulesCanRecycle(state, recycleLimit)) return

        state.pushHistory(snapshot(state))

        // Reverse waste back to stock, face-down
        const newStock = [...state.waste].reverse().map((c) => ({ ...c, faceUp: false }))

        const nextState: Partial<PyramidState> = {
          stock: newStock,
          waste: [],
          recyclesUsed: state.recyclesUsed + 1,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }

        if (isGameLost(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidStore>)
        }
      },

      newGame: (seed?: number) => {
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit
        set({
          ...createInitialState(recycleLimit, seed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<PyramidStore>)
      },

      restartGame: () => {
        const { currentSeed } = get()
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit
        set({
          ...createInitialState(recycleLimit, currentSeed),
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<PyramidStore>)
      },
    }),
    {
      name: 'pyramid-stats',
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

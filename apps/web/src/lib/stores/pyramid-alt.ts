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
  isGameLostAlt,
  canPairWithStock,
  canPairStockWithWaste,
  isStockTopKing,
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

export interface PyramidAltStore extends PyramidState, HistorySlice<PyramidState>, StatsSlice {
  removeAlone: (cellId: PyramidCellId) => void
  removePair: (idA: PyramidCellId, idB: PyramidCellId) => void
  removePairWithWaste: (cellId: PyramidCellId) => void
  removeWasteKing: () => void
  draw: () => void
  recycle: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  removeAloneFromStock: () => void
  removePairWithStock: (cellId: PyramidCellId) => void
  removePairStockWithWaste: () => void
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

export const usePyramidAltStore = create<PyramidAltStore>()(
  persist(
    (set, get) => ({
      // Initial game state — recycleLimit from settings store
      ...createInitialState(usePyramidSettingsStore.getState().recycleLimit),

      // History slice
      ...createHistorySlice<PyramidState>(
        () => get() as PyramidState & HistorySlice<PyramidState>,
        (partial) => set(partial as Partial<PyramidAltStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get() as StatsSlice,
        (partial) => set(partial as Partial<PyramidAltStore>),
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
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
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
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
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
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
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
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
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

        if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
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

        if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
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
        } as Partial<PyramidAltStore>)
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
        } as Partial<PyramidAltStore>)
      },

      removeAloneFromStock: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (!isStockTopKing(state)) return

        state.pushHistory(snapshot(state))

        const newStock = state.stock.slice(0, state.stock.length - 1)
        const newScore = state.score + KING_POINTS

        const nextState: Partial<PyramidState> = {
          stock: newStock,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
        }
      },

      removePairWithStock: (cellId: PyramidCellId) => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canPairWithStock(state, cellId)) return

        state.pushHistory(snapshot(state))

        const cell = state.cells[cellId]
        const newScore = state.score + REMOVE_PAIR_POINTS
        const updatedCells = {
          ...state.cells,
          [cellId]: { ...cell, removed: true },
        }
        const newStock = state.stock.slice(0, state.stock.length - 1)

        const nextState: Partial<PyramidState> = {
          cells: updatedCells,
          stock: newStock,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
        }
      },

      removePairStockWithWaste: () => {
        const state = get()
        if (state.status !== 'playing') return
        if (!canPairStockWithWaste(state)) return

        state.pushHistory(snapshot(state))

        const newScore = state.score + REMOVE_PAIR_POINTS
        const newStock = state.stock.slice(0, state.stock.length - 1)
        const newWaste = state.waste.slice(0, state.waste.length - 1)

        const nextState: Partial<PyramidState> = {
          stock: newStock,
          waste: newWaste,
          score: newScore,
          moveCount: state.moveCount + 1,
        }

        const tempState: PyramidState = { ...state, ...nextState }
        const recycleLimit = usePyramidSettingsStore.getState().recycleLimit

        if (isGameWon(tempState)) {
          set({ ...nextState, status: 'won' } as Partial<PyramidAltStore>)
          get().recordWin(newScore, !state.usedUndo)
        } else if (isGameLostAlt(tempState, recycleLimit)) {
          set({ ...nextState, status: 'lost' } as Partial<PyramidAltStore>)
          get().recordLoss()
        } else {
          set(nextState as Partial<PyramidAltStore>)
        }
      },
    }),
    {
      name: 'pyramid-alt-stats',
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

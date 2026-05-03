import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canMoveToFoundation,
  canMoveToFreeCell,
  canMoveToTableau,
  getAutoMoveTargets,
  isGameWon,
  SCORE_DELTAS,
} from '#/lib/games/freecell'
import type {
  FreeCellState,
  FreeCellMove,
  FreeCellPileId,
} from '#/lib/games/freecell'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { Card, GameStatus } from '#/lib/types'

export interface FreeCellStore
  extends FreeCellState, HistorySlice<FreeCellState>, StatsSlice {
  moveCard: (move: FreeCellMove) => void
  moveCardForce: (move: FreeCellMove) => void
  newGame: (seed?: number) => void
  restartGame: () => void
  triggerAutoMove: () => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: FreeCellState): FreeCellState {
  return {
    tableau: state.tableau,
    freeCells: state.freeCells,
    foundation: state.foundation,
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
    isAutoMoving: state.isAutoMoving,
  }
}

export const useFreeCellStore = create<FreeCellStore>()(
  persist(
    (set, get) => ({
      // Initial game state
      ...createInitialState(),

      // History slice — penalize undo -5
      ...createHistorySlice<FreeCellState>(
        () => get() as FreeCellState & HistorySlice<FreeCellState>,
        (partial) => set(partial as Partial<FreeCellStore>),
      ),

      // Stats slice
      ...createStatsSlice(
        () => get() as StatsSlice,
        (partial) => set(partial as Partial<FreeCellStore>),
      ),

      triggerAutoMove: () => {
        const state = get()
        if (state.status !== 'playing') return

        const targets = getAutoMoveTargets(state)
        if (targets.length === 0) {
          set({ isAutoMoving: false })
          return
        }

        // Take the first available move
        const move = targets[0]
        const { fromPileId, toPileId } = move

        let tableau = { ...state.tableau }
        let freeCells = { ...state.freeCells }
        let foundation = { ...state.foundation }
        let card: Card | null = null

        if (fromPileId.startsWith('tableau-')) {
          const pile = tableau[fromPileId]
          card = pile[pile.length - 1]
          tableau = { ...tableau, [fromPileId]: pile.slice(0, pile.length - 1) }
        } else if (fromPileId.startsWith('freecell-')) {
          card = freeCells[fromPileId]
          freeCells = { ...freeCells, [fromPileId]: null }
        }

        if (card) {
          const fPile = foundation[toPileId]
          foundation = { ...foundation, [toPileId]: [...fPile, card] }

          const nextState: FreeCellState = {
            ...state,
            tableau,
            freeCells,
            foundation,
            score: state.score + SCORE_DELTAS.toFoundation,
            isAutoMoving: true, // Keep it true to trigger next frame
          }

          if (isGameWon(nextState)) {
            const finalScore = Math.max(0, nextState.score)
            set({
              ...nextState,
              status: 'won',
              isAutoMoving: false,
            } as Partial<FreeCellStore>)
            get().recordWin(finalScore, !state.usedUndo)
          } else {
            set(nextState as Partial<FreeCellStore>)
          }
        }
      },

      moveCard: (move: FreeCellMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPileId, fromIndex, toPileId } = move

        // --- Validate ---
        let isValid = false
        if (toPileId.startsWith('foundation-')) {
          isValid = canMoveToFoundation(state, fromPileId, fromIndex)
        } else if (toPileId.startsWith('freecell-')) {
          isValid =
            canMoveToFreeCell(state, fromPileId, fromIndex) &&
            state.freeCells[toPileId] === null
        } else if (toPileId.startsWith('tableau-')) {
          isValid = canMoveToTableau(state, fromPileId, fromIndex, toPileId)
        }

        if (!isValid) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        // --- Determine score delta ---
        let scoreDelta = 0
        if (toPileId.startsWith('foundation-')) {
          scoreDelta = SCORE_DELTAS.toFoundation
        } else if (toPileId.startsWith('freecell-')) {
          scoreDelta = SCORE_DELTAS.toFreeCell
        } else if (
          toPileId.startsWith('tableau-') &&
          fromPileId.startsWith('freecell-')
        ) {
          scoreDelta = SCORE_DELTAS.fromFreeCellToTableau
        }

        // --- Apply move ---
        let tableau = { ...state.tableau }
        let freeCells = { ...state.freeCells }
        let foundation = { ...state.foundation }

        // Extract cards from source
        let movedCards: Card[] = []

        if (fromPileId.startsWith('tableau-')) {
          const pile = tableau[fromPileId]
          movedCards = pile.slice(fromIndex)
          tableau = { ...tableau, [fromPileId]: pile.slice(0, fromIndex) }
        } else if (fromPileId.startsWith('freecell-')) {
          const card = freeCells[fromPileId]
          if (card) movedCards = [card]
          freeCells = { ...freeCells, [fromPileId]: null }
        }

        // Place cards at destination
        if (toPileId.startsWith('foundation-')) {
          // Only single card to foundation
          const card = movedCards[0]
          foundation = {
            ...foundation,
            [toPileId]: [...foundation[toPileId], card],
          }
        } else if (toPileId.startsWith('freecell-')) {
          const card = movedCards[0]
          freeCells = { ...freeCells, [toPileId]: card }
        } else if (toPileId.startsWith('tableau-')) {
          const targetPile = tableau[toPileId]
          tableau = { ...tableau, [toPileId]: [...targetPile, ...movedCards] }
        }

        const nextState: FreeCellState = {
          ...state,
          tableau,
          freeCells,
          foundation,
          score: state.score + scoreDelta,
          moveCount: state.moveCount + 1,
          isAutoMoving: true, // Start auto-moving aces
        }

        // --- Check win ---
        if (isGameWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({
            ...nextState,
            status: 'won',
            isAutoMoving: false,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<FreeCellStore>)
          get().recordWin(finalScore, !state.usedUndo)
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<FreeCellStore>)
        }
      },

      moveCardForce: (move: FreeCellMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPileId, fromIndex, toPileId } = move

        // Only validate foundation moves (still need correct suit/rank)
        if (toPileId.startsWith('foundation-')) {
          if (!canMoveToFoundation(state, fromPileId, fromIndex)) return
        } else if (toPileId.startsWith('freecell-')) {
          if (state.freeCells[toPileId] !== null) return
          // Only single cards can go to a free cell
          if (fromPileId.startsWith('tableau-')) {
            const pile = state.tableau[fromPileId]
            if (fromIndex !== pile.length - 1) return
          }
        }
        // tableau→tableau: no capacity check, but must be same pile guard
        if (toPileId === fromPileId) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        let scoreDelta = 0
        if (toPileId.startsWith('foundation-')) {
          scoreDelta = SCORE_DELTAS.toFoundation
        } else if (toPileId.startsWith('freecell-')) {
          scoreDelta = SCORE_DELTAS.toFreeCell
        } else if (
          toPileId.startsWith('tableau-') &&
          fromPileId.startsWith('freecell-')
        ) {
          scoreDelta = SCORE_DELTAS.fromFreeCellToTableau
        }

        let tableau = { ...state.tableau }
        let freeCells = { ...state.freeCells }
        let foundation = { ...state.foundation }
        let movedCards: Card[] = []

        if (fromPileId.startsWith('tableau-')) {
          const pile = tableau[fromPileId]
          movedCards = pile.slice(fromIndex)
          tableau = { ...tableau, [fromPileId]: pile.slice(0, fromIndex) }
        } else if (fromPileId.startsWith('freecell-')) {
          const card = freeCells[fromPileId]
          if (card) movedCards = [card]
          freeCells = { ...freeCells, [fromPileId]: null }
        }

        if (toPileId.startsWith('foundation-')) {
          const card = movedCards[0]
          foundation = {
            ...foundation,
            [toPileId]: [...foundation[toPileId], card],
          }
        } else if (toPileId.startsWith('freecell-')) {
          const card = movedCards[0]
          freeCells = { ...freeCells, [toPileId]: card }
        } else if (toPileId.startsWith('tableau-')) {
          const targetPile = tableau[toPileId]
          tableau = { ...tableau, [toPileId]: [...targetPile, ...movedCards] }
        }

        const nextState: FreeCellState = {
          ...state,
          tableau,
          freeCells,
          foundation,
          score: state.score + scoreDelta,
          moveCount: state.moveCount + 1,
          isAutoMoving: true,
        }

        if (isGameWon(nextState)) {
          const finalScore = Math.max(0, nextState.score)
          set({
            ...nextState,
            status: 'won',
            isAutoMoving: false,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<FreeCellStore>)
          get().recordWin(finalScore, !state.usedUndo)
        } else {
          set({
            ...nextState,
            past,
            future,
            canUndo,
            canRedo,
          } as Partial<FreeCellStore>)
        }
      },

      newGame: (seed?: number) => {
        const initial = createInitialState(seed)
        set({
          ...initial,
          isAutoMoving: true, // Trigger initial ace moves
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<FreeCellStore>)
      },

      restartGame: () => {
        const { currentSeed } = get()
        const initial = createInitialState(currentSeed)
        set({
          ...initial,
          isAutoMoving: true, // Trigger initial ace moves
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        } as Partial<FreeCellStore>)
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          get().recordWin(get().score, !get().usedUndo)
        }
        set({ status } as Partial<FreeCellStore>)
      },
    }),
    {
      name: 'freecell-stats',
      version: 1,
      partialize: (state) => ({ stats: state.stats }),
    },
  ),
)

// Set undo penalty to -5 after store creation
useFreeCellStore.getState().setHistoryConfig({
  maxDepth: 'unlimited',
  undoScoreMode: 'penalize',
  undoPenaltyScore: 5,
})

export type { FreeCellPileId, FreeCellMove }

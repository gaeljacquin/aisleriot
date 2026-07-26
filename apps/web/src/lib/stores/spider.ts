import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  createInitialState,
  canMoveToTableau,
  canDealStock,
  findCompletedSequence,
  isGameWon,
  SCORE_DELTAS,
  TABLEAU_IDS,
} from '#/lib/games/spider'
import type {
  SpiderState,
  SpiderMove,
  SpiderTableauId,
  SpiderFoundationId,
} from '#/lib/games/spider'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'
import type { GameStatus } from '#/lib/types'

export interface SpiderStore
  extends SpiderState,
    HistorySlice<SpiderState>,
    StatsSlice {
  moveCard: (move: SpiderMove) => void
  moveCardForce: (move: SpiderMove) => void
  dealStock: () => boolean
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: SpiderState): SpiderState {
  return {
    tableau: { ...state.tableau },
    foundations: { ...state.foundations },
    stock: [...state.stock],
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
  }
}

/**
 * Auto-flips any top card of a tableau column if it's currently face down.
 */
function applyAutoFlips(tableau: SpiderState['tableau']): SpiderState['tableau'] {
  const newTableau = { ...tableau }
  for (const id of TABLEAU_IDS) {
    const pile = newTableau[id]
    if (pile.length > 0) {
      const topIdx = pile.length - 1
      if (!pile[topIdx].faceUp) {
        const updatedPile = [...pile]
        updatedPile[topIdx] = { ...updatedPile[topIdx], faceUp: true }
        newTableau[id] = updatedPile
      }
    }
  }
  return newTableau
}

/**
 * Processes completed 13-card suit sequences on the tableau, moving them
 * to empty foundation slots and auto-flipping exposed top cards.
 */
function processCompletedSequences(
  state: SpiderState,
  recordWinCallback: (score: number, noUndo: boolean) => void,
): SpiderState {
  let currentState = { ...state }
  let completedMove = findCompletedSequence(currentState)

  while (completedMove) {
    const { fromPileId, fromIndex, toPileId } = completedMove
    const fromId = fromPileId as SpiderTableauId
    const toId = toPileId as SpiderFoundationId

    const pile = [...currentState.tableau[fromId]]
    const sequence = pile.splice(fromIndex, 13)

    let updatedTableau = {
      ...currentState.tableau,
      [fromId]: pile,
    }
    updatedTableau = applyAutoFlips(updatedTableau)

    const updatedFoundations = {
      ...currentState.foundations,
      [toId]: sequence,
    }

    currentState = {
      ...currentState,
      tableau: updatedTableau,
      foundations: updatedFoundations,
      score: currentState.score + SCORE_DELTAS.completeSuit,
    }

    completedMove = findCompletedSequence(currentState)
  }

  if (isGameWon(currentState)) {
    currentState.status = 'won'
    recordWinCallback(currentState.score, !currentState.usedUndo)
  }

  return currentState
}

export const useSpiderStore = create<SpiderStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      ...createHistorySlice<SpiderState>(
        () => get(),
        (partial) => set(partial as Partial<SpiderStore>),
      ),

      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<SpiderStore>),
      ),

      moveCard: (move: SpiderMove) => {
        const state = get()
        if (state.status !== 'playing') return

        const { fromPileId, fromIndex, toPileId } = move

        if (!canMoveToTableau(state, fromPileId, fromIndex, toPileId)) {
          return
        }

        get().pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const tableau = { ...state.tableau }
        const fromPile = [...tableau[fromPileId as SpiderTableauId]]
        const toPile = [...tableau[toPileId as SpiderTableauId]]

        const movingCards = fromPile.splice(fromIndex)
        toPile.push(...movingCards)

        tableau[fromPileId as SpiderTableauId] = fromPile
        tableau[toPileId as SpiderTableauId] = toPile

        const autoFlippedTableau = applyAutoFlips(tableau)

        let nextState: SpiderState = {
          ...state,
          tableau: autoFlippedTableau,
          moveCount: state.moveCount + 1,
          score: Math.max(0, state.score + SCORE_DELTAS.move),
        }

        nextState = processCompletedSequences(
          nextState,
          get().recordWin,
        )

        set({
          ...nextState,
          past,
          future,
          canUndo,
          canRedo,
        })
      },

      moveCardForce: (move: SpiderMove) => {
        const state = get()
        const { fromPileId, fromIndex, toPileId } = move

        if (fromPileId === toPileId) return

        get().pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const tableau = { ...state.tableau }
        const fromPile = [...tableau[fromPileId as SpiderTableauId]]
        const toPile = [...tableau[toPileId as SpiderTableauId]]

        const movingCards = fromPile.splice(fromIndex)
        toPile.push(...movingCards)

        tableau[fromPileId as SpiderTableauId] = fromPile
        tableau[toPileId as SpiderTableauId] = toPile

        const autoFlippedTableau = applyAutoFlips(tableau)

        let nextState: SpiderState = {
          ...state,
          tableau: autoFlippedTableau,
          moveCount: state.moveCount + 1,
          score: Math.max(0, state.score + SCORE_DELTAS.move),
        }

        nextState = processCompletedSequences(
          nextState,
          get().recordWin,
        )

        set({
          ...nextState,
          past,
          future,
          canUndo,
          canRedo,
        })
      },

      dealStock: (): boolean => {
        const state = get()
        if (state.status !== 'playing') return false

        if (!canDealStock(state)) {
          return false
        }

        get().pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const stock = [...state.stock]
        const tableau = { ...state.tableau }

        // Pop 10 cards from stock and append 1 face-up card to each of 10 tableau columns
        for (let i = 0; i < TABLEAU_IDS.length; i++) {
          const id = TABLEAU_IDS[i]
          const card = stock.pop()
          if (card) {
            tableau[id] = [...tableau[id], { ...card, faceUp: true }]
          }
        }

        let nextState: SpiderState = {
          ...state,
          stock,
          tableau,
          moveCount: state.moveCount + 1,
        }

        nextState = processCompletedSequences(
          nextState,
          get().recordWin,
        )

        set({
          ...nextState,
          past,
          future,
          canUndo,
          canRedo,
        })

        return true
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
      name: 'spider-storage',
      partialize: (state) => ({
        tableau: state.tableau,
        foundations: state.foundations,
        stock: state.stock,
        score: state.score,
        moveCount: state.moveCount,
        status: state.status,
        usedUndo: state.usedUndo,
        currentSeed: state.currentSeed,
      }),
    },
  ),
)

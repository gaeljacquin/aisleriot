import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Card, GameStatus } from '#/lib/types'
import { canMoveToFoundation, canMoveToTableau } from '../games/acme/rules'
import { isWon as checkWin, isLost as checkLoss } from '../games/acme/win'
import { createInitialState } from '../games/acme/deal'
import type {
  AcmeState,
  AcmeTableauId,
  AcmeFoundationId,
} from '../games/acme/types'
import { TABLEAU_IDS } from '../games/acme/types'
import { createHistorySlice } from './slices/history'
import { createStatsSlice } from './slices/stats'
import type { HistorySlice } from './slices/history'
import type { StatsSlice } from './slices/stats'

interface AcmeMove {
  fromPile: string
  fromIndex: number
  toPile: string
}

interface AcmeStore extends AcmeState, HistorySlice<AcmeState>, StatsSlice {
  moveCard: (move: AcmeMove) => void
  moveCardForce: (move: AcmeMove) => void
  flipStock: () => void
  newGame: (seed?: number) => void
  restartGame: () => void
  devSetStatus: (status: GameStatus) => void
}

function snapshot(state: AcmeState): AcmeState {
  return {
    tableau: state.tableau,
    foundation: state.foundation,
    reserve: state.reserve,
    stock: state.stock,
    waste: state.waste,
    score: state.score,
    moveCount: state.moveCount,
    status: state.status,
    usedUndo: state.usedUndo,
    currentSeed: state.currentSeed,
    redealsUsed: state.redealsUsed,
  }
}

/** Extract the moved card and updated source piles from a move. */
function extractSource(
  move: AcmeMove,
  state: AcmeState,
): {
  movedCards: Card[]
  newWaste: Card[]
  newReserve: Card[]
  newTableau: AcmeState['tableau']
  newFoundation: AcmeState['foundation']
} {
  let movedCards: Card[] = []
  let newWaste = state.waste
  let newReserve = state.reserve
  let newTableau = state.tableau
  let newFoundation = state.foundation

  if (move.fromPile === 'waste') {
    movedCards = [state.waste[move.fromIndex]]
    newWaste = state.waste.slice(0, move.fromIndex)
  } else if (move.fromPile === 'reserve') {
    movedCards = [state.reserve[move.fromIndex]]
    newReserve = state.reserve.slice(0, move.fromIndex)
    if (newReserve.length > 0) {
      newReserve[newReserve.length - 1] = {
        ...newReserve[newReserve.length - 1],
        faceUp: true,
      }
    }
  } else if (move.fromPile.startsWith('tableau-')) {
    const pile = state.tableau[move.fromPile as AcmeTableauId]
    movedCards = pile.slice(move.fromIndex)
    newTableau = {
      ...newTableau,
      [move.fromPile]: pile.slice(0, move.fromIndex),
    }
  } else if (move.fromPile.startsWith('foundation-')) {
    const pile = state.foundation[move.fromPile as AcmeFoundationId]
    movedCards = [pile[pile.length - 1]]
    newFoundation = { ...newFoundation, [move.fromPile]: pile.slice(0, -1) }
  }

  return { movedCards, newWaste, newReserve, newTableau, newFoundation }
}

/** Place moved cards at the destination pile. */
function applyDestination(
  move: AcmeMove,
  movedCards: Card[],
  tableau: AcmeState['tableau'],
  foundation: AcmeState['foundation'],
): {
  newTableau: AcmeState['tableau']
  newFoundation: AcmeState['foundation']
} {
  let newTableau = tableau
  let newFoundation = foundation

  if (move.toPile.startsWith('foundation-')) {
    newFoundation = {
      ...newFoundation,
      [move.toPile]: [
        ...newFoundation[move.toPile as AcmeFoundationId],
        ...movedCards,
      ],
    }
  } else if (move.toPile.startsWith('tableau-')) {
    const targetPile = newTableau[move.toPile as AcmeTableauId]
    newTableau = {
      ...newTableau,
      [move.toPile]: [...targetPile, ...movedCards],
    }
  }

  return { newTableau, newFoundation }
}

/** Auto-fill empty tableau slots from reserve */
function applyAutoFills(
  tableau: AcmeState['tableau'],
  reserve: Card[],
): { autoTableau: AcmeState['tableau']; autoReserve: Card[] } {
  const autoTableau = { ...tableau }
  const autoReserve = [...reserve]

  for (const id of TABLEAU_IDS) {
    if (autoTableau[id].length === 0 && autoReserve.length > 0) {
      const topReserve = autoReserve.pop()!
      autoTableau[id] = [{ ...topReserve, faceUp: true }]
      if (autoReserve.length > 0) {
        autoReserve[autoReserve.length - 1] = {
          ...autoReserve[autoReserve.length - 1],
          faceUp: true,
        }
      }
    }
  }

  return { autoTableau, autoReserve }
}

export const useAcmeStore = create<AcmeStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      ...createHistorySlice<AcmeState>(
        () => get(),
        (partial) => set(partial as Partial<AcmeStore>),
      ),

      ...createStatsSlice(
        () => get(),
        (partial) => set(partial as Partial<AcmeStore>),
      ),

      moveCard: (move: AcmeMove) => {
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
            toPile as AcmeTableauId,
          )
        }
        if (!isValid) return

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const {
          movedCards,
          newWaste,
          newReserve,
          newTableau: srcTableau,
          newFoundation: srcFoundation,
        } = extractSource(move, state)

        const { newTableau: dstTableau, newFoundation: dstFoundation } =
          applyDestination(move, movedCards, srcTableau, srcFoundation)

        // Apply auto-fills for spaces from reserve
        const { autoTableau, autoReserve } = applyAutoFills(
          dstTableau,
          newReserve,
        )

        const nextScore = state.score + 10
        const nextMoveCount = state.moveCount + 1

        const nextState = {
          tableau: autoTableau,
          foundation: dstFoundation,
          reserve: autoReserve,
          waste: newWaste,
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

      moveCardForce: (move: AcmeMove) => {
        const state = get()
        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        const {
          movedCards,
          newWaste,
          newReserve,
          newTableau: srcTableau,
          newFoundation: srcFoundation,
        } = extractSource(move, state)

        const { newTableau: dstTableau, newFoundation: dstFoundation } =
          applyDestination(move, movedCards, srcTableau, srcFoundation)

        const { autoTableau, autoReserve } = applyAutoFills(
          dstTableau,
          newReserve,
        )

        const nextScore = state.score + 10
        const nextMoveCount = state.moveCount + 1

        const nextState = {
          tableau: autoTableau,
          foundation: dstFoundation,
          reserve: autoReserve,
          waste: newWaste,
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

        state.pushHistory(snapshot(state))
        const { past, future, canUndo, canRedo } = get()

        if (state.stock.length > 0) {
          // Draw 1
          const topCard = state.stock[state.stock.length - 1]
          const nextState = {
            stock: state.stock.slice(0, -1),
            waste: [...state.waste, { ...topCard, faceUp: true }],
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
        } else if (state.redealsUsed < 1) {
          // Recycle (One redeal is permitted)
          const nextState = {
            stock: [...state.waste]
              .reverse()
              .map((c) => ({ ...c, faceUp: false })),
            waste: [],
            redealsUsed: state.redealsUsed + 1,
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
        }
      },

      devSetStatus: (status: GameStatus) => {
        if (status === 'won') {
          const s = get()
          s.recordWin(s.score, !s.usedUndo)
        }
        set({ status } as Partial<AcmeStore>)
      },

      newGame: (seed?: number) => {
        set({
          ...createInitialState(seed),
          past: [],
          future: [],
        } as Partial<AcmeStore>)
      },

      restartGame: () => {
        const state = get()
        set({
          ...createInitialState(state.currentSeed),
          past: [],
          future: [],
        } as Partial<AcmeStore>)
      },
    }),
    {
      name: 'acme-storage',
      partialize: (state) => ({
        stats: state.stats,
      }),
    },
  ),
)

export interface HistoryConfig {
  maxDepth: number | 'unlimited'
  undoScoreMode: 'revert' | 'penalize'
}

export interface HistorySlice<TState> {
  past: TState[]
  future: TState[]
  historyConfig: HistoryConfig
  canUndo: boolean
  canRedo: boolean
  pushHistory: (snapshot: TState) => void
  undo: () => void
  redo: () => void
  setHistoryConfig: (config: Partial<HistoryConfig>) => void
}

const UNDO_PENALTY_SCORE = 15

/** Keys that belong to the history slice and should not be copied when restoring snapshots */
const HISTORY_KEYS = new Set([
  'past',
  'future',
  'historyConfig',
  'canUndo',
  'canRedo',
  'pushHistory',
  'undo',
  'redo',
  'setHistoryConfig',
])

function extractGameState<TState>(full: TState & HistorySlice<TState>): TState {
  const snapshot = {} as TState
  for (const key of Object.keys(full as object) as (keyof typeof full)[]) {
    if (!HISTORY_KEYS.has(key as string)) {
      snapshot[key as keyof TState] = full[key as keyof TState]
    }
  }
  return snapshot
}

export function createHistorySlice<TState extends { score: number; usedUndo?: boolean }>(
  get: () => TState & HistorySlice<TState>,
  set: (partial: Partial<TState & HistorySlice<TState>>) => void,
): HistorySlice<TState> {
  return {
    past: [],
    future: [],
    historyConfig: {
      maxDepth: 'unlimited',
      undoScoreMode: 'revert',
    },
    canUndo: false,
    canRedo: false,

    pushHistory: (snapshot: TState) => {
      const { past, historyConfig } = get()
      const { maxDepth } = historyConfig
      let newPast = [...past, snapshot]
      if (maxDepth !== 'unlimited' && newPast.length > maxDepth) {
        newPast = newPast.slice(newPast.length - maxDepth)
      }
      set({ past: newPast, future: [], canUndo: true, canRedo: false } as Partial<
        TState & HistorySlice<TState>
      >)
    },

    undo: () => {
      const state = get()
      const { past, future, historyConfig } = state
      if (past.length === 0) return

      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      const currentSnapshot = extractGameState(state)

      const restoredScore =
        historyConfig.undoScoreMode === 'penalize'
          ? Math.max(0, state.score - UNDO_PENALTY_SCORE)
          : previous.score

      set({
        ...previous,
        score: restoredScore,
        usedUndo: true,
        past: newPast,
        future: [...future, currentSnapshot],
        canUndo: newPast.length > 0,
        canRedo: true,
      } as unknown as Partial<TState & HistorySlice<TState>>)
    },

    redo: () => {
      const state = get()
      const { past, future } = state
      if (future.length === 0) return

      const next = future[future.length - 1]
      const newFuture = future.slice(0, future.length - 1)
      const currentSnapshot = extractGameState(state)

      set({
        ...next,
        past: [...past, currentSnapshot],
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      } as unknown as Partial<TState & HistorySlice<TState>>)
    },

    setHistoryConfig: (config: Partial<HistoryConfig>) => {
      const { historyConfig } = get()
      set({ historyConfig: { ...historyConfig, ...config } } as Partial<
        TState & HistorySlice<TState>
      >)
    },
  }
}

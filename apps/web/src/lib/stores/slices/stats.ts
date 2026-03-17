export interface VariantStats {
  gamesPlayed: number
  gamesWon: number
  cleanWins: number // wins with usedUndo === false
  bestScore: number
}

export interface StatsSlice {
  stats: VariantStats
  recordWin: (score: number, isClean: boolean) => void
  recordLoss: () => void
  resetStats: () => void
}

const initialStats: VariantStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  cleanWins: 0,
  bestScore: 0,
}

export function createStatsSlice(
  get: () => StatsSlice,
  set: (partial: Partial<StatsSlice>) => void,
): StatsSlice {
  return {
    stats: { ...initialStats },

    recordWin: (score: number, isClean: boolean) => {
      const { stats } = get()
      set({
        stats: {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + 1,
          cleanWins: stats.cleanWins + (isClean ? 1 : 0),
          bestScore: Math.max(stats.bestScore, score),
        },
      })
    },

    recordLoss: () => {
      const { stats } = get()
      set({ stats: { ...stats, gamesPlayed: stats.gamesPlayed + 1 } })
    },

    resetStats: () => {
      set({ stats: { ...initialStats } })
    },
  }
}

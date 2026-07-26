import { hasLegalMoves } from './rules'
import type { FortuneFavorState } from './types'
import { FOUNDATION_IDS } from './types'

export function isWon(state: FortuneFavorState): boolean {
  return FOUNDATION_IDS.every((id) => state.foundation[id]?.length === 13)
}

export function isLost(state: FortuneFavorState): boolean {
  if (state.stock.length > 0) return false
  if (hasLegalMoves(state)) return false
  return true
}

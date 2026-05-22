import { hasLegalMoves } from './rules'
import type { AcmeState } from './types'
import { FOUNDATION_IDS } from './types'

export function isWon(state: AcmeState): boolean {
  return FOUNDATION_IDS.every((id) => state.foundation[id].length === 13)
}

export function isLost(state: AcmeState): boolean {
  // If we can still draw or recycle, we haven't lost
  if (state.stock.length > 0) return false
  if (state.redealsUsed < 1 && state.waste.length > 0) return false

  // If we have legal moves, we haven't lost
  if (hasLegalMoves(state)) return false

  return true
}

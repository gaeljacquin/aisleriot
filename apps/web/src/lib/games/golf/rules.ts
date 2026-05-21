import { rankDistance } from '#/lib/utils'
import type { GolfState } from './types'
import type { Card } from '#/lib/types'

export function canPlayCard(state: GolfState, card: Card): boolean {
  if (state.waste.length === 0) return true // Should not happen in Golf as waste starts with 1 card

  const topWaste = state.waste[state.waste.length - 1]
  const dist = rankDistance(card, topWaste)

  // Rule: Wrap-around (A-K) is allowed.
  // A=1, K=13. distance(A, K) = 12.
  // So dist === 1 OR dist === 12 handles everything correctly.
  return dist === 1 || dist === 12
}

export function canDraw(state: GolfState): boolean {
  return state.stock.length > 0
}

export function isGameWon(state: GolfState): boolean {
  return state.columns.every((col) => col.cards.length === 0)
}

export function isGameLost(state: GolfState): boolean {
  if (state.stock.length > 0) return false

  // Check if any column has a playable card at the top (end of array)
  return !state.columns.some((col) => {
    if (col.cards.length === 0) return false
    const topCard = col.cards[col.cards.length - 1]
    return canPlayCard(state, topCard)
  })
}

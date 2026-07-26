import { rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type {
  SpiderState,
  SpiderPileId,
  SpiderTableauId,
  SpiderMove,
} from './types'
import { TABLEAU_IDS, FOUNDATION_IDS } from './types'

export const SCORE_DELTAS = {
  move: -1,
  completeSuit: 100,
} as const

/**
 * Returns true if cards form a valid sequence for MOVING:
 * all face-up, same suit, strictly descending rank by 1.
 */
export function isValidSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false
  if (cards.some((c) => !c.faceUp)) return false
  if (cards.length === 1) return true

  for (let i = 0; i < cards.length - 1; i++) {
    const upper = cards[i]
    const lower = cards[i + 1]
    if (upper.suit !== lower.suit) return false
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) return false
  }
  return true
}

/**
 * Returns true if cards form a complete 13-card suit sequence (K to A).
 */
export function isCompleteSuit(cards: Card[]): boolean {
  if (cards.length !== 13) return false
  if (!isValidSequence(cards)) return false
  return rankValue(cards[0].rank) === 13 && rankValue(cards[12].rank) === 1
}

/**
 * Validates moving cards from `fromPileId` (at `fromIndex`) to `toPileId`.
 */
export function canMoveToTableau(
  state: SpiderState,
  fromPileId: SpiderPileId,
  fromIndex: number,
  toPileId: SpiderPileId,
): boolean {
  if (fromPileId === toPileId) return false
  if (!toPileId.startsWith('tableau-')) return false
  if (!fromPileId.startsWith('tableau-')) return false

  const fromPile = state.tableau[fromPileId as SpiderTableauId]
  if (fromIndex < 0 || fromIndex >= fromPile.length) return false

  const sequence = fromPile.slice(fromIndex)
  if (!isValidSequence(sequence)) return false

  const toPile = state.tableau[toPileId as SpiderTableauId]
  if (toPile.length === 0) {
    // Spaces may be filled with any available card or packed sequence
    return true
  }

  const targetTop = toPile[toPile.length - 1]
  if (!targetTop.faceUp) return false

  // Nothing can be placed on an Ace.
  if (targetTop.rank === 'A') return false

  const seqTop = sequence[0]
  // Build down
  return rankValue(targetTop.rank) - rankValue(seqTop.rank) === 1
}

/**
 * Checks if stock can be dealt:
 * - Stock must have at least 10 cards
 * - All 10 tableau columns must contain at least one card
 */
export function canDealStock(state: SpiderState): boolean {
  if (state.stock.length < 10) return false
  return TABLEAU_IDS.every((id) => state.tableau[id].length > 0)
}

/**
 * Checks all tableau columns for a completed 13-card suit sequence.
 * Returns the move to an empty foundation slot if found.
 */
export function findCompletedSequence(state: SpiderState): SpiderMove | null {
  for (const id of TABLEAU_IDS) {
    const pile = state.tableau[id]
    if (pile.length < 13) continue

    const possibleSequence = pile.slice(-13)
    if (isCompleteSuit(possibleSequence)) {
      const targetFoundationId = FOUNDATION_IDS.find(
        (fid) => state.foundations[fid].length === 0,
      )
      if (targetFoundationId) {
        return {
          fromPileId: id,
          fromIndex: pile.length - 13,
          toPileId: targetFoundationId,
        }
      }
    }
  }
  return null
}

/**
 * Checks if the game is won:
 * All 8 foundations have 13 cards each.
 */
export function isGameWon(state: SpiderState): boolean {
  return FOUNDATION_IDS.every((id) => state.foundations[id].length === 13)
}

/**
 * Helper to determine the earliest index in a tableau pile from which cards can be dragged.
 */
export function draggableFromIndex(state: SpiderState, pileId: string): number {
  if (!pileId.startsWith('tableau-')) return 0
  const pile = state.tableau[pileId as SpiderTableauId]
  if (pile.length === 0) return 0

  let seqStart = pile.length - 1

  for (let i = pile.length - 2; i >= 0; i--) {
    const upper = pile[i]
    const lower = pile[i + 1]

    if (!upper.faceUp || !lower.faceUp) break
    if (upper.suit !== lower.suit) break
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) break

    seqStart = i
  }

  return seqStart
}

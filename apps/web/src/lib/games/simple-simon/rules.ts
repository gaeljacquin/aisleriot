import { rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type {
  SimpleSimonState,
  SimpleSimonPileId,
  SimpleSimonMove,
} from './types'
import { TABLEAU_IDS, FOUNDATION_IDS } from './types'

// ---------------------------------------------------------------------------
// Sequence helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if cards form a valid Simple Simon sequence for MOVING:
 * same suit, strictly descending rank.
 */
export function isValidSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false
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

// ---------------------------------------------------------------------------
// Move validators
// ---------------------------------------------------------------------------

export function canMoveToTableau(
  state: SimpleSimonState,
  fromPileId: SimpleSimonPileId,
  fromIndex: number,
  toPileId: SimpleSimonPileId,
): boolean {
  if (fromPileId === toPileId) return false
  if (!toPileId.startsWith('tableau-')) return false

  const fromPile = state.tableau[fromPileId as any]
  if (!fromPile || fromIndex < 0 || fromIndex >= fromPile.length) return false

  const sequence = fromPile.slice(fromIndex)
  if (!isValidSequence(sequence)) return false

  const toPile = state.tableau[toPileId as any]
  if (toPile.length === 0) return true // Any card/sequence to empty space

  const targetTop = toPile[toPile.length - 1]
  const seqTop = sequence[0]

  // Build down regardless of suit
  // Standard rule: Nothing can be placed on an Ace.
  if (targetTop.rank === 'A') return false

  return rankValue(targetTop.rank) - rankValue(seqTop.rank) === 1
}

// ---------------------------------------------------------------------------
// Auto-move / cleanup
// ---------------------------------------------------------------------------

/**
 * Checks all tableau columns for completed 13-card suit sequences.
 * Returns the first one found or null.
 */
export function findCompletedSequence(
  state: SimpleSimonState,
): SimpleSimonMove | null {
  for (const id of TABLEAU_IDS) {
    const pile = state.tableau[id]
    if (pile.length < 13) continue

    // A completed sequence must be at the end of the pile
    const possibleSequence = pile.slice(-13)
    if (isCompleteSuit(possibleSequence)) {
      // Find an empty foundation slot
      const targetId = FOUNDATION_IDS.find(
        (fid) => state.foundations[fid].length === 0,
      )
      if (targetId) {
        return {
          fromPileId: id,
          fromIndex: pile.length - 13,
          toPileId: targetId,
        }
      }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Win condition
// ---------------------------------------------------------------------------

export function isGameWon(state: SimpleSimonState): boolean {
  return FOUNDATION_IDS.every((id) => state.foundations[id].length === 13)
}

// ---------------------------------------------------------------------------
// Draggable boundary helper
// ---------------------------------------------------------------------------

export function draggableFromIndex(
  state: SimpleSimonState,
  pileId: string,
): number {
  if (!pileId.startsWith('tableau-')) return 0
  const pile = state.tableau[pileId as any]
  if (!pile || pile.length === 0) return 0

  let seqStart = pile.length - 1

  for (let i = pile.length - 2; i >= 0; i--) {
    const upper = pile[i]
    const lower = pile[i + 1]

    // Sequence must be same suit and descending
    if (upper.suit !== lower.suit) break
    if (rankValue(upper.rank) - rankValue(lower.rank) !== 1) break

    seqStart = i
  }

  return seqStart
}

import { oppColor } from '#/lib/utils'
import type { Card, Rank } from '#/lib/types'
import type {
  AgnesBernauerState,
  AgnesBernauerTableauId,
  AgnesBernauerFoundationId,
  AgnesBernauerReserveId,
} from './types'

// ---------------------------------------------------------------------------
// Continuous Rank Helpers
// ---------------------------------------------------------------------------

export function getNextRankUp(rank: Rank): Rank {
  const map: Record<Rank, Rank> = {
    A: '2',
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '7',
    '7': '8',
    '8': '9',
    '9': '10',
    '10': 'J',
    J: 'Q',
    Q: 'K',
    K: 'A',
  }
  return map[rank]
}

export function getNextRankDown(rank: Rank): Rank {
  const map: Record<Rank, Rank> = {
    A: 'K',
    K: 'Q',
    Q: 'J',
    J: '10',
    '10': '9',
    '9': '8',
    '8': '7',
    '7': '6',
    '6': '5',
    '5': '4',
    '4': '3',
    '3': '2',
    '2': 'A',
  }
  return map[rank]
}

export function isNextRankUp(base: Card, next: Card): boolean {
  return next.rank === getNextRankUp(base.rank)
}

export function isNextRankDown(base: Card, next: Card): boolean {
  return next.rank === getNextRankDown(base.rank)
}

// ---------------------------------------------------------------------------
// Sequence helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if cards form a valid Agnes Bernauer tableau sequence:
 * alternating color, strictly descending rank (continuous).
 */
export function isValidTableauSequence(cards: Card[]): boolean {
  if (cards.length === 0) return false
  if (cards.length === 1) return cards[0].faceUp

  for (let i = 0; i < cards.length - 1; i++) {
    const upper = cards[i]
    const lower = cards[i + 1]
    if (!upper.faceUp || !lower.faceUp) return false
    if (!oppColor(upper, lower)) return false
    if (!isNextRankDown(upper, lower)) return false
  }
  return true
}

// ---------------------------------------------------------------------------
// Move validators
// ---------------------------------------------------------------------------

export function canMoveToTableau(
  state: AgnesBernauerState,
  fromPile:
    AgnesBernauerTableauId | AgnesBernauerFoundationId | AgnesBernauerReserveId,
  fromIndex: number,
  toPile: AgnesBernauerTableauId,
): boolean {
  if (fromPile === toPile) return false

  let sequence: Card[]

  if (fromPile.startsWith('reserve-')) {
    const pile = state.reserve[fromPile as AgnesBernauerReserveId]
    if (pile.length === 0 || fromIndex !== pile.length - 1) return false
    sequence = [pile[pile.length - 1]]
  } else if (fromPile.startsWith('tableau-')) {
    const pile = state.tableau[fromPile as AgnesBernauerTableauId]
    if (fromIndex < 0 || fromIndex >= pile.length) return false
    sequence = pile.slice(fromIndex)
  } else if (fromPile.startsWith('foundation-')) {
    const pile = state.foundation[fromPile as AgnesBernauerFoundationId]
    if (pile.length === 0 || fromIndex !== pile.length - 1) return false
    sequence = [pile[pile.length - 1]]
  } else {
    return false
  }

  if (!isValidTableauSequence(sequence)) return false

  const targetPile = state.tableau[toPile]
  const seqTop = sequence[0]

  if (targetPile.length === 0) {
    // Spaces may be filled with a card, or a group starting with a card one rank below the base card.
    return seqTop.rank === getNextRankDown(state.baseRank)
  }

  const targetTop = targetPile[targetPile.length - 1]
  return (
    targetTop.faceUp &&
    oppColor(seqTop, targetTop) &&
    isNextRankDown(targetTop, seqTop)
  )
}

export function canMoveToFoundation(
  state: AgnesBernauerState,
  fromPile:
    AgnesBernauerTableauId | AgnesBernauerFoundationId | AgnesBernauerReserveId,
  fromIndex: number,
): boolean {
  const card = resolveSourceCard(state, fromPile, fromIndex)
  if (card === null) return false
  if (!card.faceUp) return false

  // Find a suitable foundation pile
  for (const fid of Object.keys(
    state.foundation,
  ) as AgnesBernauerFoundationId[]) {
    const pile = state.foundation[fid]
    if (pile.length === 0) {
      // Must be base rank AND match the assigned suit for this foundation
      if (
        card.rank === state.baseRank &&
        state.foundationSuits[fid] === card.suit
      ) {
        return true
      }
    } else {
      const top = pile[pile.length - 1]
      if (card.suit === top.suit && isNextRankUp(top, card)) return true
    }
  }

  return false
}

/** Returns the foundation ID a card can move to, or null if none. */
export function getFoundationTargetId(
  state: AgnesBernauerState,
  card: Card,
): AgnesBernauerFoundationId | null {
  // First look for existing pile of same suit
  for (const fid of Object.keys(
    state.foundation,
  ) as AgnesBernauerFoundationId[]) {
    const pile = state.foundation[fid]
    if (pile.length > 0) {
      const top = pile[pile.length - 1]
      if (card.suit === top.suit && isNextRankUp(top, card)) return fid
    }
  }

  // Then look for the foundation assigned to this suit if it's base rank
  if (card.rank === state.baseRank) {
    for (const fid of Object.keys(
      state.foundationSuits,
    ) as AgnesBernauerFoundationId[]) {
      if (
        state.foundationSuits[fid] === card.suit &&
        state.foundation[fid].length === 0
      ) {
        return fid
      }
    }
  }

  return null
}

function resolveSourceCard(
  state: AgnesBernauerState,
  fromPile:
    AgnesBernauerTableauId | AgnesBernauerFoundationId | AgnesBernauerReserveId,
  fromIndex: number,
): Card | null {
  if (fromPile.startsWith('reserve-')) {
    const pile = state.reserve[fromPile as AgnesBernauerReserveId]
    if (pile.length === 0 || fromIndex !== pile.length - 1) return null
    return pile[pile.length - 1]
  }
  if (fromPile.startsWith('tableau-')) {
    const pile = state.tableau[fromPile as AgnesBernauerTableauId]
    if (pile.length === 0 || fromIndex !== pile.length - 1) return null
    return pile[pile.length - 1]
  }
  return null
}

export function canFlipStock(state: AgnesBernauerState): boolean {
  return state.stock.length > 0
}

export function isGameWon(state: AgnesBernauerState): boolean {
  return Object.values(state.foundation).every((pile) => pile.length === 13)
}

export function draggableFromIndex(
  state: AgnesBernauerState,
  pileId: AgnesBernauerTableauId,
): number {
  const pile = state.tableau[pileId]
  if (pile.length === 0) return 0

  let seqStart = pile.length - 1
  for (let i = pile.length - 2; i >= 0; i--) {
    const upper = pile[i]
    const lower = pile[i + 1]
    if (!upper.faceUp || !lower.faceUp) break
    if (!oppColor(upper, lower)) break
    if (!isNextRankDown(upper, lower)) break
    seqStart = i
  }

  return seqStart
}

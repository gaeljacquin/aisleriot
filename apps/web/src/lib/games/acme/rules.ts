import { rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { AcmeState, AcmeTableauId, AcmeFoundationId } from './types'

export function canMoveToTableau(
  state: AcmeState,
  fromPile: AcmeTableauId | AcmeFoundationId | 'waste' | 'reserve',
  fromIndex: number,
  toPile: AcmeTableauId,
): boolean {
  if (fromPile === toPile) return false

  const card = resolveSourceCard(state, fromPile, fromIndex)
  if (!card) return false
  if (!card.faceUp) return false

  // In Acme, only one card at a time can be moved. So fromIndex must be the last card.
  if (!isTopCard(state, fromPile, fromIndex)) return false

  const targetPile = state.tableau[toPile]

  if (targetPile.length === 0) {
    // "After the reserve is exhausted, spaces may be filled from the waste: never from the tableau."

    // Spaces can never be filled from the tableau (manual move)
    if (fromPile.startsWith('tableau-')) return false

    // Spaces can never be filled from the foundation
    if (fromPile.startsWith('foundation-')) return false

    // Spaces can be filled from the waste ONLY if the reserve is empty
    if (fromPile === 'waste') {
      return state.reserve.length === 0
    }

    // Spaces can be filled from the reserve manually (though store usually auto-fills)
    if (fromPile === 'reserve') {
      return true
    }

    return false
  }

  const targetTop = targetPile[targetPile.length - 1]

  // Build down by suit
  return (
    card.suit === targetTop.suit &&
    rankValue(targetTop.rank) - rankValue(card.rank) === 1
  )
}

export function canMoveToFoundation(
  state: AcmeState,
  fromPile: AcmeTableauId | AcmeFoundationId | 'waste' | 'reserve',
  fromIndex: number,
): boolean {
  const card = resolveSourceCard(state, fromPile, fromIndex)
  if (!card) return false
  if (!card.faceUp) return false

  if (!isTopCard(state, fromPile, fromIndex)) return false

  const foundationId = `foundation-${card.suit}` as unknown as AcmeFoundationId
  const pile = state.foundation[foundationId]

  if (pile.length === 0) {
    // Although Aces are moved at start, if one is somehow moved back or if we change rules:
    return rankValue(card.rank) === 1
  }

  const top = pile[pile.length - 1]
  return rankValue(card.rank) === rankValue(top.rank) + 1
}

export function hasLegalMoves(state: AcmeState): boolean {
  const sources: (AcmeTableauId | AcmeFoundationId | 'waste' | 'reserve')[] = [
    'waste',
    'reserve',
    'tableau-0',
    'tableau-1',
    'tableau-2',
    'tableau-3',
    'foundation-clubs',
    'foundation-diamonds',
    'foundation-hearts',
    'foundation-spades',
  ]

  const tableauDestinations: AcmeTableauId[] = [
    'tableau-0',
    'tableau-1',
    'tableau-2',
    'tableau-3',
  ]

  for (const source of sources) {
    let card: Card | null = null
    let index = -1

    if (source === 'waste') {
      if (state.waste.length > 0) {
        index = state.waste.length - 1
        card = state.waste[index]
      }
    } else if (source === 'reserve') {
      if (state.reserve.length > 0) {
        index = state.reserve.length - 1
        card = state.reserve[index]
      }
    } else if (source.startsWith('tableau-')) {
      const pile = state.tableau[source as AcmeTableauId]
      if (pile.length > 0) {
        index = pile.length - 1
        card = pile[index]
      }
    } else if (source.startsWith('foundation-')) {
      const pile = state.foundation[source as AcmeFoundationId]
      if (pile.length > 0) {
        index = pile.length - 1
        card = pile[index]
      }
    }

    if (!card) continue

    // Check foundation
    if (canMoveToFoundation(state, source, index)) return true

    // Check tableau
    for (const toTableau of tableauDestinations) {
      if (canMoveToTableau(state, source, index, toTableau)) return true
    }
  }

  return false
}

function resolveSourceCard(
  state: AcmeState,
  fromPile: string,
  fromIndex: number,
): Card | null {
  if (fromPile === 'waste') {
    if (state.waste.length === 0 || fromIndex !== state.waste.length - 1)
      return null
    return state.waste[fromIndex]
  }
  if (fromPile === 'reserve') {
    if (state.reserve.length === 0 || fromIndex !== state.reserve.length - 1)
      return null
    return state.reserve[fromIndex]
  }
  if (fromPile.startsWith('tableau-')) {
    const pile = state.tableau[fromPile as AcmeTableauId]
    if (pile.length === 0 || fromIndex < 0 || fromIndex >= pile.length)
      return null
    return pile[fromIndex]
  }
  if (fromPile.startsWith('foundation-')) {
    const pile = state.foundation[fromPile as AcmeFoundationId]
    if (pile.length === 0 || fromIndex !== pile.length - 1) return null
    return pile[fromIndex]
  }
  return null
}

function isTopCard(state: AcmeState, pileId: string, index: number): boolean {
  if (pileId === 'waste') return index === state.waste.length - 1
  if (pileId === 'reserve') return index === state.reserve.length - 1
  if (pileId.startsWith('tableau-')) {
    const pile = state.tableau[pileId as AcmeTableauId]
    return index === pile.length - 1
  }
  if (pileId.startsWith('foundation-')) {
    const pile = state.foundation[pileId as AcmeFoundationId]
    return index === pile.length - 1
  }
  return false
}

import { rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import { FOUNDATION_IDS } from './types'

export function getTargetRank(foundationId: string): number {
  const index = FOUNDATION_IDS.indexOf(foundationId as any)
  if (index === -1) return 0
  // Position 1-12. Target A=1, ..., 10=10, J=11, Q=12.
  return index + 1
}

export function isFoundationFull(foundationId: string, cards: Card[]): boolean {
  if (cards.length === 0) return false
  const targetRank = getTargetRank(foundationId)
  return rankValue(cards[cards.length - 1].rank) === targetRank
}

export function isValidFoundationMove(
  card: Card,
  targetFoundationId: string,
  targetCards: Card[],
): boolean {
  if (isFoundationFull(targetFoundationId, targetCards)) return false
  if (targetCards.length === 0) return false // Should never happen in this game as they are seeded

  const topCard = targetCards[targetCards.length - 1]

  // Same suit
  if (card.suit !== topCard.suit) return false

  // Build up, wrap K to A
  const topRankVal = rankValue(topCard.rank)
  const nextRankVal = topRankVal === 13 ? 1 : topRankVal + 1
  return rankValue(card.rank) === nextRankVal
}

export function isValidTableauMove(card: Card, targetCards: Card[]): boolean {
  if (targetCards.length === 0) return true // Spaces may be filled with any card

  const topCard = targetCards[targetCards.length - 1]
  const topRankVal = rankValue(topCard.rank)
  const cardRankVal = rankValue(card.rank)

  // Build down regardless of suit, wrap A to K
  const nextRankVal = topRankVal === 1 ? 13 : topRankVal - 1
  return cardRankVal === nextRankVal
}

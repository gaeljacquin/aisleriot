import type { Card, Rank } from '#/lib/types'

export function rankValue(rank: Rank): number {
  const map: Record<Rank, number> = {
    A: 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
  }
  return map[rank]
}

export function isRed(card: Card): boolean {
  return card.suit === 'hearts' || card.suit === 'diamonds'
}

export function isBlack(card: Card): boolean {
  return card.suit === 'clubs' || card.suit === 'spades'
}

export function sameColor(a: Card, b: Card): boolean {
  return isRed(a) === isRed(b)
}

export function oppColor(a: Card, b: Card): boolean {
  return !sameColor(a, b)
}

export function rankDistance(a: Card, b: Card): number {
  return Math.abs(rankValue(a.rank) - rankValue(b.rank))
}

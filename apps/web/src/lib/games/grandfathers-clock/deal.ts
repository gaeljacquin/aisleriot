import { createShuffledDeck, rankValue } from '#/lib/utils'
import type { Card } from '#/lib/types'
import type { GrandfathersClockState } from './types'
import { TABLEAU_IDS, FOUNDATION_IDS } from './types'

export function createInitialState(seed?: number): GrandfathersClockState {
  const resolvedSeed = seed ?? Math.floor(Math.random() * 1_000_000)
  const deck = createShuffledDeck(resolvedSeed)

  // Seed cards for foundations (Rank 1-13, Suit 0-3)
  // Suit mapping in aisleriot: 0: Clubs, 1: Diamonds, 2: Hearts, 3: Spades
  // Our seeding:
  // 1: 10 Hearts (Rank 10, Suit 2)
  // 2: J Spades (Rank 11, Suit 3)
  // 3: Q Diamonds (Rank 12, Suit 1)
  // 4: K Clubs (Rank 13, Suit 0)
  // 5: 2 Hearts (Rank 2, Suit 2)
  // 6: 3 Spades (Rank 3, Suit 3)
  // 7: 4 Diamonds (Rank 4, Suit 1)
  // 8: 5 Clubs (Rank 5, Suit 0)
  // 9: 6 Hearts (Rank 6, Suit 2)
  // 10: 7 Spades (Rank 7, Suit 3)
  // 11: 8 Diamonds (Rank 8, Suit 1)
  // 12: 9 Clubs (Rank 9, Suit 0)

  const seedSpecs = [
    { rank: 10, suit: 'hearts' }, // 1
    { rank: 11, suit: 'spades' }, // 2
    { rank: 12, suit: 'diamonds' }, // 3
    { rank: 13, suit: 'clubs' }, // 4
    { rank: 2, suit: 'hearts' }, // 5
    { rank: 3, suit: 'spades' }, // 6
    { rank: 4, suit: 'diamonds' }, // 7
    { rank: 5, suit: 'clubs' }, // 8
    { rank: 6, suit: 'hearts' }, // 9
    { rank: 7, suit: 'spades' }, // 10
    { rank: 8, suit: 'diamonds' }, // 11
    { rank: 9, suit: 'clubs' }, // 12
  ]

  const foundation: Record<string, Card[]> = {}
  const remainingDeck: Card[] = [...deck]

  seedSpecs.forEach((spec, i) => {
    const cardIndex = remainingDeck.findIndex(
      (c) => rankValue(c.rank) === spec.rank && c.suit === spec.suit,
    )
    const [card] = remainingDeck.splice(cardIndex, 1)
    foundation[FOUNDATION_IDS[i]] = [{ ...card, faceUp: true }]
  })

  // Deal remaining 40 cards to tableau
  const tableau: Record<string, Card[]> = {}
  for (let i = 0; i < 8; i++) {
    const cards = remainingDeck
      .splice(0, 5)
      .map((c) => ({ ...c, faceUp: true }))
    tableau[TABLEAU_IDS[i]] = cards
  }

  return {
    tableau,
    foundation,
    score: 0,
    moveCount: 0,
    status: 'playing',
    currentSeed: resolvedSeed,
    usedUndo: false,
  }
}

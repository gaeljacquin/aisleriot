import type { Card, Suit, Rank } from '#/lib/types'

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function createDeck(): Card[] {
  const cards: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ id: `${suit}-${rank}`, suit, rank, faceUp: false })
    }
  }
  return cards
}

export function shuffleDeck(cards: Card[], seed?: number): Card[] {
  const result = [...cards]
  let rng: () => number

  if (seed !== undefined) {
    // Simple seeded LCG pseudo-random number generator
    let state = seed
    rng = () => {
      state = (state * 1664525 + 1013904223) & 0xffffffff
      return (state >>> 0) / 0x100000000
    }
  } else {
    rng = Math.random
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function createMultiDeck(count: number): Card[] {
  const cards: Card[] = []
  for (let deckIndex = 0; deckIndex < count; deckIndex++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push({
          id: `${suit}-${rank}-${deckIndex}`,
          suit,
          rank,
          faceUp: false,
        })
      }
    }
  }
  return cards
}

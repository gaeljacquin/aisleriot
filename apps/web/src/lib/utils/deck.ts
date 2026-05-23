import type { Card, Suit, Rank } from '#/lib/types'

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS: Rank[] = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
]

/**
 * Creates a standard 52-card deck, shuffles it deterministically if a seed is provided,
 * and returns it in our app's Card format.
 */
export function createShuffledDeck(seed?: number): Card[] {
  const cards = createDeck()

  // Deterministic shuffle if seed is provided
  const result =
    seed !== undefined ? shuffleDeck(cards, seed) : shuffleDeck(cards)

  // Generate deterministic IDs based on the final order and seed
  return result.map((card, index) => ({
    ...card,
    id:
      seed !== undefined
        ? `${card.suit}-${card.rank}-${seed}-${index}`
        : `${card.suit}-${card.rank}-${Math.random().toString(36).substring(2, 9)}`,
  }))
}

export function createDeck(): Card[] {
  const cards: Card[] = []

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({
        id: `${suit}-${rank}-${Math.random().toString(36).substring(2, 9)}`,
        suit,
        rank,
        faceUp: false,
      })
    }
  }

  return cards
}

export function shuffleDeck<T>(items: T[], seed?: number): T[] {
  const shuffled = [...items]

  // Simple deterministic pseudo-random generator if seed is provided
  let random: () => number
  if (seed !== undefined) {
    let s = seed
    random = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }
  } else {
    random = Math.random
  }

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function createMultiDeck(count: number): Card[] {
  let allCards: Card[] = []
  for (let i = 0; i < count; i++) {
    allCards = [...allCards, ...createDeck()]
  }
  return allCards
}

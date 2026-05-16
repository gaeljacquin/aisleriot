import { decks } from 'cards'
import type { Card, Suit, Rank } from '#/lib/types'

/**
 * Creates a standard 52-card deck, shuffles it deterministically if a seed is provided,
 * and returns it in our app's Card format.
 */
export function createShuffledDeck(seed?: number): Card[] {
  const deck = new decks.StandardDeck()
  const drawn = deck.draw(52)

  const cards = drawn.map((card) => {
    // @ts-ignore - node-cards types are missing properties
    const suit = card.suit.name as Suit
    // @ts-ignore - node-cards types are missing properties
    const rank = card.rank.abbrn as Rank

    return {
      suit,
      rank,
      faceUp: false,
    }
  })

  // Deterministic shuffle if seed is provided
  const result = seed !== undefined ? shuffleDeck(cards, seed) : shuffleDeck(cards)

  // Generate deterministic IDs based on the final order and seed
  return result.map((card, index) => ({
    ...card,
    id: seed !== undefined 
      ? `${card.suit}-${card.rank}-${seed}-${index}`
      : `${card.suit}-${card.rank}-${Math.random().toString(36).substring(2, 9)}`
  }))
}

/** Legacy helpers mapped to the new cards package */

export function createDeck(): Card[] {
  const deck = new decks.StandardDeck()
  const drawn = deck.draw(52)
  return drawn.map((card) => {
    // @ts-ignore - node-cards types are missing properties
    const rank = card.rank.abbrn as Rank
    // @ts-ignore - node-cards types are missing properties
    const suit = card.suit.name as Suit
    return {
      id: `${suit}-${rank}-${Math.random().toString(36).substring(2, 9)}`,
      suit,
      rank,
      faceUp: false,
    }
  })
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

import { decks } from 'cards'
import type { Card, Suit, Rank } from '#/lib/types'

/**
 * Creates a standard 52-card deck, shuffles it, and returns it in our app's Card format.
 */
export function createShuffledDeck(_seed?: number): Card[] {
  const deck = new decks.StandardDeck()

  // node-cards supports a custom RNG.
  // If a seed is provided, we could use it here.
  // For now, let's stick to the default shuffleAll().
  deck.shuffleAll()

  const drawn = deck.draw(52)

  return drawn.map((card) => {
    // node-cards uses .name for suit and .abbrn for rank ('A', '2', ..., '10', 'J', 'Q', 'K')
    // @ts-ignore - node-cards types are missing properties
    const suit = card.suit.name as Suit
    // @ts-ignore - node-cards types are missing properties
    const rank = card.rank.abbrn as Rank

    return {
      id: `${suit}-${rank}-${Math.random().toString(36).substring(2, 9)}`,
      suit,
      rank,
      faceUp: false,
    }
  })
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

export function shuffleDeck(cards: Card[], _seed?: number): Card[] {
  // Simple Fisher-Yates shuffle for an existing array
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
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

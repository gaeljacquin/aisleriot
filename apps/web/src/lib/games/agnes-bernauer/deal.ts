import { createShuffledDeck } from '#/lib/utils'
import type { Card, Rank, Suit } from '#/lib/types'
import type {
  AgnesBernauerState,
  AgnesBernauerTableauId,
  AgnesBernauerReserveId,
  AgnesBernauerFoundationId,
} from './types'
import { TABLEAU_IDS, RESERVE_IDS } from './types'

export function createInitialState(seed?: number): AgnesBernauerState {
  const deck = createShuffledDeck(seed)

  // 1. Tableau: 1 to 7 cards, all face-up
  const tableau: AgnesBernauerState['tableau'] = {} as any
  let cardIndex = 0
  for (let i = 0; i < 7; i++) {
    const id = TABLEAU_IDS[i]
    const count = i + 1
    const cards = deck
      .slice(cardIndex, cardIndex + count)
      .map((c) => ({ ...c, faceUp: true }))
    tableau[id] = cards
    cardIndex += count
  }

  // 2. Reserve: 7 cards, one per pile, all face-up
  const reserve: AgnesBernauerState['reserve'] = {} as any
  for (let i = 0; i < 7; i++) {
    const id = RESERVE_IDS[i]
    const card = { ...deck[cardIndex++], faceUp: true }
    reserve[id] = [card]
  }

  // 3. Foundation: The next card is the base card
  const baseCard = { ...deck[cardIndex++], faceUp: true }
  const baseRank = baseCard.rank
  const baseSuit = baseCard.suit

  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const otherSuits = suits.filter((s) => s !== baseSuit)

  const foundation: AgnesBernauerState['foundation'] = {
    'foundation-0': [baseCard],
    'foundation-1': [],
    'foundation-2': [],
    'foundation-3': [],
  }

  const foundationSuits: Record<AgnesBernauerFoundationId, Suit> = {
    'foundation-0': baseSuit,
    'foundation-1': otherSuits[0],
    'foundation-2': otherSuits[1],
    'foundation-3': otherSuits[2],
  }

  // 4. Stock: Remaining cards
  const stock = deck.slice(cardIndex).map((c) => ({ ...c, faceUp: false }))

  return {
    tableau,
    foundation,
    reserve,
    stock,
    baseRank,
    foundationSuits, // Add this to state
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: seed,
  }
}

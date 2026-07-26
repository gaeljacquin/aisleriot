import { describe, expect, it } from 'vitest'
import { createInitialState } from './deal'
import { canMoveToTableau, canMoveToFoundation, hasLegalMoves } from './rules'
import { isWon, isLost } from './win'
import type { FortuneFavorState } from './types'
import type { Card } from '#/lib/types'

describe("Fortune's Favor Rules Engine", () => {
  it('initializes deal correctly with 4 Aces in foundations and 12 cards in tableau', () => {
    const state = createInitialState(12345)

    // Check foundations start with 4 Aces
    expect(state.foundation['foundation-clubs']).toHaveLength(1)
    expect(state.foundation['foundation-clubs'][0].rank).toBe('A')
    expect(state.foundation['foundation-diamonds']).toHaveLength(1)
    expect(state.foundation['foundation-diamonds'][0].rank).toBe('A')
    expect(state.foundation['foundation-hearts']).toHaveLength(1)
    expect(state.foundation['foundation-hearts'][0].rank).toBe('A')
    expect(state.foundation['foundation-spades']).toHaveLength(1)
    expect(state.foundation['foundation-spades'][0].rank).toBe('A')

    // Check 12 tableau piles with 1 card each
    for (let i = 0; i < 12; i++) {
      const pileId = `tableau-${i}` as keyof FortuneFavorState['tableau']
      expect(state.tableau[pileId]).toHaveLength(1)
      expect(state.tableau[pileId][0].faceUp).toBe(true)
    }

    // Check 36 cards in stock
    expect(state.stock).toHaveLength(36)
    expect(state.waste).toHaveLength(0)
    expect(state.status).toBe('playing')
  })

  it('validates moving cards down by suit to tableau', () => {
    const state = createInitialState(1)
    // Replace top card of tableau-0 with Jack of Hearts
    const jackHearts: Card = {
      id: 'JH',
      suit: 'hearts',
      rank: 'J',
      faceUp: true,
    }
    const tenHearts: Card = {
      id: '10H',
      suit: 'hearts',
      rank: '10',
      faceUp: true,
    }
    const tenSpades: Card = {
      id: '10S',
      suit: 'spades',
      rank: '10',
      faceUp: true,
    }

    state.tableau['tableau-0'] = [jackHearts]
    state.tableau['tableau-1'] = [tenHearts]
    state.tableau['tableau-2'] = [tenSpades]

    // 10 of Hearts can be moved to Jack of Hearts (tableau-1 to tableau-0)
    expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(true)

    // 10 of Spades CANNOT be moved to Jack of Hearts (different suit)
    expect(canMoveToTableau(state, 'tableau-2', 0, 'tableau-0')).toBe(false)
  })

  it('validates moving cards up by suit to foundation', () => {
    const state = createInitialState(1)
    // foundation-hearts has Ace of Hearts
    const twoHearts: Card = {
      id: '2H',
      suit: 'hearts',
      rank: '2',
      faceUp: true,
    }
    const threeHearts: Card = {
      id: '3H',
      suit: 'hearts',
      rank: '3',
      faceUp: true,
    }

    state.tableau['tableau-0'] = [twoHearts]
    state.tableau['tableau-1'] = [threeHearts]

    // 2 of Hearts can move to foundation-hearts
    expect(canMoveToFoundation(state, 'tableau-0', 0)).toBe(true)

    // 3 of Hearts CANNOT move to foundation-hearts (needs 2 first)
    expect(canMoveToFoundation(state, 'tableau-1', 0)).toBe(false)
  })

  it('disallows manual move to empty space if stock or waste is not empty', () => {
    const state = createInitialState(1)
    state.tableau['tableau-0'] = []
    const card: Card = { id: '2H', suit: 'hearts', rank: '2', faceUp: true }
    state.tableau['tableau-1'] = [card]

    // Stock is non-empty (36 cards)
    expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(false)
  })

  it('allows manual move to empty space when stock and waste are empty', () => {
    const state = createInitialState(1)
    state.stock = []
    state.waste = []
    state.tableau['tableau-0'] = []
    const card: Card = { id: '2H', suit: 'hearts', rank: '2', faceUp: true }
    state.tableau['tableau-1'] = [card]

    expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(true)
  })

  it('detects win state when all foundations have 13 cards', () => {
    const state = createInitialState(1)
    const suits = ['clubs', 'diamonds', 'hearts', 'spades'] as const
    for (const suit of suits) {
      const fId = `foundation-${suit}` as keyof FortuneFavorState['foundation']
      state.foundation[fId] = Array.from({ length: 13 }, (_, i) => ({
        id: `${suit}-${i}`,
        suit,
        rank: 'A',
        faceUp: true,
      }))
    }

    expect(isWon(state)).toBe(true)
  })

  it('detects loss state when stock is empty and no legal moves exist', () => {
    const state = createInitialState(1)
    state.stock = []
    state.waste = []
    // Set all tableau columns to incompatible cards
    for (let i = 0; i < 12; i++) {
      const pileId = `tableau-${i}` as keyof FortuneFavorState['tableau']
      state.tableau[pileId] = [
        { id: `card-${i}`, suit: 'hearts', rank: 'K', faceUp: true },
      ]
    }

    expect(hasLegalMoves(state)).toBe(false)
    expect(isLost(state)).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { canPlayCard } from './rules'
import type { GolfState } from './types'
import type { Card } from '#/lib/types'

describe('Golf Rules - Wrap-around', () => {
  const createBaseState = (wasteRank: string): GolfState => ({
    columns: [],
    stock: [],
    waste: [
      {
        id: `hearts-${wasteRank}`,
        suit: 'hearts',
        rank: wasteRank as any,
        faceUp: true,
      },
    ],
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: 123,
  })

  const createCard = (rank: string): Card => ({
    id: `spades-${rank}`,
    suit: 'spades',
    rank: rank as any,
    faceUp: true,
  })

  it('should allow playing 2 on Ace', () => {
    const state = createBaseState('A')
    const card = createCard('2')
    expect(canPlayCard(state, card)).toBe(true)
  })

  it('should allow playing King on Ace (wrap-around)', () => {
    const state = createBaseState('A')
    const card = createCard('K')
    expect(canPlayCard(state, card)).toBe(true)
  })

  it('should allow playing Ace on King (wrap-around)', () => {
    const state = createBaseState('K')
    const card = createCard('A')
    expect(canPlayCard(state, card)).toBe(true)
  })

  it('should allow playing Queen on King', () => {
    const state = createBaseState('K')
    const card = createCard('Q')
    expect(canPlayCard(state, card)).toBe(true)
  })

  it('should NOT allow playing 3 on Ace', () => {
    const state = createBaseState('A')
    const card = createCard('3')
    expect(canPlayCard(state, card)).toBe(false)
  })
})

import { describe, it, expect } from 'vitest'
import { canPlayCard } from './rules'
import type { TriPeaksState } from './types'

describe('Tri Peaks Rules - Wrap-around', () => {
  const createBaseState = (wasteRank: any, cardRank: any): TriPeaksState => ({
    cells: {
      'cell-0': {
        id: 'cell-0',
        card: {
          id: `spades-${cardRank}`,
          suit: 'spades',
          rank: cardRank,
          faceUp: true,
        },
        blockedBy: [],
        removed: false,
      },
    },
    stock: [],
    waste: [
      {
        id: `hearts-${wasteRank}`,
        suit: 'hearts',
        rank: wasteRank,
        faceUp: true,
      },
    ],
    chain: 0,
    score: 0,
    moveCount: 0,
    status: 'playing',
    usedUndo: false,
    currentSeed: undefined,
  })

  it('should allow playing 2 on Ace without wrap', () => {
    const state = createBaseState('A', '2')
    expect(canPlayCard(state, 'cell-0', false)).toBe(true)
  })

  it('should NOT allow playing King on Ace without wrap', () => {
    const state = createBaseState('A', 'K')
    expect(canPlayCard(state, 'cell-0', false)).toBe(false)
  })

  it('should allow playing King on Ace with wrap', () => {
    const state = createBaseState('A', 'K')
    expect(canPlayCard(state, 'cell-0', true)).toBe(true)
  })

  it('should allow playing Ace on King with wrap', () => {
    const state = createBaseState('K', 'A')
    expect(canPlayCard(state, 'cell-0', true)).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import {
  isValidSequence,
  isCompleteSuit,
  canMoveToTableau,
  canDealStock,
  isGameWon,
  findCompletedSequence,
} from './rules'
import type { Card } from '#/lib/types'
import { createInitialState } from './deal'

describe('Spider Rules', () => {
  const sK: Card = { id: 'sK', suit: 'spades', rank: 'K', faceUp: true }
  const sQ: Card = { id: 'sQ', suit: 'spades', rank: 'Q', faceUp: true }
  const sJ: Card = { id: 'sJ', suit: 'spades', rank: 'J', faceUp: true }
  const s10: Card = { id: 's10', suit: 'spades', rank: '10', faceUp: true }
  const s9: Card = { id: 's9', suit: 'spades', rank: '9', faceUp: true }
  const s8: Card = { id: 's8', suit: 'spades', rank: '8', faceUp: true }
  const s7: Card = { id: 's7', suit: 'spades', rank: '7', faceUp: true }
  const s6: Card = { id: 's6', suit: 'spades', rank: '6', faceUp: true }
  const s5: Card = { id: 's5', suit: 'spades', rank: '5', faceUp: true }
  const s4: Card = { id: 's4', suit: 'spades', rank: '4', faceUp: true }
  const s3: Card = { id: 's3', suit: 'spades', rank: '3', faceUp: true }
  const s2: Card = { id: 's2', suit: 'spades', rank: '2', faceUp: true }
  const sA: Card = { id: 'sA', suit: 'spades', rank: 'A', faceUp: true }

  describe('createInitialState', () => {
    it('should deal 54 cards to tableau and 50 to stock', () => {
      const state = createInitialState(12345)
      const tableauCount = Object.values(state.tableau).reduce(
        (sum, col) => sum + col.length,
        0,
      )
      expect(tableauCount).toBe(54)
      expect(state.stock.length).toBe(50)

      // First 4 columns should have 6 cards, last 6 should have 5 cards
      expect(state.tableau['tableau-0'].length).toBe(6)
      expect(state.tableau['tableau-3'].length).toBe(6)
      expect(state.tableau['tableau-4'].length).toBe(5)
      expect(state.tableau['tableau-9'].length).toBe(5)

      // Top card of each column should be face up, rest face down
      for (const col of Object.values(state.tableau)) {
        expect(col[col.length - 1].faceUp).toBe(true)
        for (let i = 0; i < col.length - 1; i++) {
          expect(col[i].faceUp).toBe(false)
        }
      }
    })
  })

  describe('isValidSequence', () => {
    it('should return true for a single card', () => {
      expect(isValidSequence([sK])).toBe(true)
    })

    it('should return true for descending same-suit sequence', () => {
      expect(isValidSequence([sK, sQ, sJ])).toBe(true)
    })

    it('should return false if any card is face down', () => {
      const faceDownQ = { ...sQ, faceUp: false }
      expect(isValidSequence([sK, faceDownQ])).toBe(false)
    })

    it('should return false for non-descending sequence', () => {
      expect(isValidSequence([sQ, sK])).toBe(false)
    })
  })

  describe('isCompleteSuit', () => {
    it('should return true for complete K to A sequence', () => {
      const sequence = [sK, sQ, sJ, s10, s9, s8, s7, s6, s5, s4, s3, s2, sA]
      expect(isCompleteSuit(sequence)).toBe(true)
    })

    it('should return false for incomplete sequence', () => {
      const sequence = [sK, sQ, sJ, s10, s9, s8, s7, s6, s5, s4, s3, s2]
      expect(isCompleteSuit(sequence)).toBe(false)
    })
  })

  describe('canMoveToTableau', () => {
    it('should allow moving any valid sequence to an empty column', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = []
      state.tableau['tableau-1'] = [sK, sQ]
      expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(true)
    })

    it('should allow building down by rank', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = [sK]
      state.tableau['tableau-1'] = [sQ]
      expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(true)
    })

    it('should NOT allow building on Ace', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = [sA]
      state.tableau['tableau-1'] = [s2]
      expect(canMoveToTableau(state, 'tableau-1', 0, 'tableau-0')).toBe(false)
    })
  })

  describe('canDealStock', () => {
    it('should return true when stock has >= 10 cards and all columns are non-empty', () => {
      const state = createInitialState(1)
      expect(canDealStock(state)).toBe(true)
    })

    it('should return false if any tableau column is empty', () => {
      const state = createInitialState(1)
      state.tableau['tableau-0'] = []
      expect(canDealStock(state)).toBe(false)
    })
  })

  describe('findCompletedSequence & isGameWon', () => {
    it('should find completed 13-card sequence', () => {
      const state = createInitialState(1)
      const sequence = [sK, sQ, sJ, s10, s9, s8, s7, s6, s5, s4, s3, s2, sA]
      state.tableau['tableau-0'] = sequence
      const move = findCompletedSequence(state)
      expect(move).not.toBeNull()
      expect(move?.fromPileId).toBe('tableau-0')
      expect(move?.toPileId).toBe('foundation-0')
    })

    it('should return isGameWon true when all 8 foundations are filled', () => {
      const state = createInitialState(1)
      const sequence = [sK, sQ, sJ, s10, s9, s8, s7, s6, s5, s4, s3, s2, sA]
      for (const id of Object.keys(state.foundations) as (keyof typeof state.foundations)[]) {
        state.foundations[id] = sequence
      }
      expect(isGameWon(state)).toBe(true)
    })
  })
})

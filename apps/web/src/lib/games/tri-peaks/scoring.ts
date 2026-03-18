/**
 * Chain scoring: first card = 1 pt, each subsequent = previous + 1 (1, 2, 3, 4...).
 * Chain resets on draw.
 * @param chain - the current chain length (0-indexed: 0 means no card played yet in this chain)
 */
export function calculateChainPoints(chain: number): number {
  return chain + 1
}

export const UNDO_PENALTY = 15

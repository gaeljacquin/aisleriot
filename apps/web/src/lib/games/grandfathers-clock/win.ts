import type { GrandfathersClockState } from './types'
import { FOUNDATION_IDS } from './types'
import { isFoundationFull } from './rules'

export function isWon(state: GrandfathersClockState): boolean {
  return FOUNDATION_IDS.every((id) =>
    isFoundationFull(id, state.foundation[id]),
  )
}

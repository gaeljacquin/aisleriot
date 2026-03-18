export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export interface MoveRecord {
  type: string
  timestamp: number
  payload: unknown
}

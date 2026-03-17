export type GameVariantId = 'klondike' | 'freecell' | 'pyramid' | 'tri-peaks'

export interface GameVariant {
  id: GameVariantId
  name: string
  description: string
  color: string
  rules: string[]
}

export const gameVariants: GameVariant[] = [
  {
    id: 'klondike',
    name: 'Klondike',
    description: 'The classic solitaire game played around the world.',
    color: 'bg-rose-100 dark:bg-rose-950',
    rules: [
      'The goal is to move all 52 cards to four foundation piles, one per suit, built up from Ace to King.',
      'Cards in the tableau are arranged in 7 columns. You may place a card onto a tableau column if it is one rank lower and the opposite color of the top card.',
      'The stock pile can be flipped to the waste pile one card at a time. The top card of the waste pile may be moved to the tableau or foundations.',
      'An empty tableau column may only be filled with a King or a sequence starting with a King.',
    ],
  },
  {
    id: 'freecell',
    name: 'FreeCell',
    description: 'A skill-based variant where almost every deal is winnable.',
    color: 'bg-orange-100 dark:bg-orange-950',
    rules: [
      'All 52 cards are dealt face-up into 8 tableau columns at the start of the game.',
      'The goal is to move all cards to the four foundation piles, built up by suit from Ace to King.',
      'Four free cells act as temporary holding spots — you may move any single card to an empty free cell at any time.',
      'Cards in the tableau are built in descending order, alternating colors. More cards can be moved at once when free cells and empty columns are available.',
      'Empty tableau columns can hold any card or sequence.',
    ],
  },
  {
    id: 'pyramid',
    name: 'Pyramid',
    description: 'Match pairs of cards that sum to 13 to clear the pyramid.',
    color: 'bg-sky-100 dark:bg-sky-950',
    rules: [
      'Cards are dealt into a pyramid of 7 rows. Each card is available once both cards overlapping it from the row below have been removed.',
      'The goal is to remove all cards from the pyramid and the stock by pairing cards whose ranks sum to 13.',
      'Valid pairs: Ace (1) + Queen (12), 2 + Jack (11), 3 + 10, 4 + 9, 5 + 8, 6 + 7. A King (13) may be removed alone.',
      'You may draw from the stock pile and pair it with an available card in the pyramid, or set it aside in the waste.',
      'The game is won when the pyramid is completely cleared.',
    ],
  },
  {
    id: 'tri-peaks',
    name: 'Tri Peaks',
    description: 'Clear three peaks by chaining cards one rank apart.',
    color: 'bg-purple-100 dark:bg-purple-950',
    rules: [
      'Cards are arranged into three overlapping pyramids (peaks) of 4 rows each, plus a stock pile of 24 cards.',
      'The goal is to clear all cards from the peaks by sending them to the discard pile.',
      'A face-up peak card may be moved to the discard pile if it is one rank higher or lower than the current top of the discard pile — suit does not matter.',
      'When no moves are available, draw a card from the stock to the discard pile to continue the chain.',
      'Building long chains without drawing from the stock earns bonus points.',
    ],
  },
]

export function getVariant(id: GameVariantId): GameVariant {
  const variant = gameVariants.find((v) => v.id === id)
  if (!variant) throw new Error(`Unknown variant: ${id}`)
  return variant
}

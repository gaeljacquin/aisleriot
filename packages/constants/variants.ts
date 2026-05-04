export type GameVariantId = 'klondike-draw-1' | 'klondike-draw-3' | 'freecell' | 'pyramid' | 'pyramid-alt' | 'tri-peaks' | 'tri-peaks-alt'

export interface GameVariant {
  id: GameVariantId
  name: string
  subtitle: string
  blurb: string
  rules: string[]
  color: string
}

export const gameVariants: GameVariant[] = [
  {
    id: 'klondike-draw-1',
    name: 'Klondike',
    subtitle: 'Draw 1',
    blurb: 'The classic. Build foundations from Ace to King by suit, one card from the stock at a time.',
    color: 'bg-rose-100 dark:bg-rose-950',
    rules: [
      'The goal is to move all 52 cards to four foundation piles, one per suit, built up from Ace to King.',
      'Cards in the tableau are arranged in 7 columns. You may place a card onto a tableau column if it is one rank lower and the opposite color of the top card.',
      'Click the stock pile to flip one card at a time to the waste pile. The top card of the waste pile may be moved to the tableau or foundations.',
      'An empty tableau column may only be filled with a King or a sequence starting with a King.',
      'When the stock is empty, click the recycling indicator to flip the waste pile back into the stock.',
    ],
  },
  {
    id: 'klondike-draw-3',
    name: 'Klondike Alt',
    subtitle: 'Draw 3',
    blurb: 'The classic with bite. Three cards turn from the stock; only the top card is in play.',
    color: 'bg-cyan-100 dark:bg-cyan-950',
    rules: [
      'The goal is to move all 52 cards to four foundation piles, one per suit, built up from Ace to King.',
      'Cards in the tableau are arranged in 7 columns. You may place a card onto a tableau column if it is one rank lower and the opposite color of the top card.',
      'Click the stock pile to flip three cards at a time to the waste pile. Only the top (rightmost) waste card may be played.',
      'An empty tableau column may only be filled with a King or a sequence starting with a King.',
      'When the stock is empty, click the recycling indicator to flip the waste pile back into the stock. A -100 score penalty applies per recycle.',
    ],
  },
  {
    id: 'pyramid',
    name: 'Pyramid',
    subtitle: 'Pairs to thirteen',
    blurb: 'Remove pairs that sum to 13 from a 28-card pyramid. Kings go alone.',
    color: 'bg-sky-100 dark:bg-sky-950',
    rules: [
      'Cards are dealt into a pyramid of 7 rows. Each card is available once both cards overlapping it from the row below have been removed.',
      'The goal is to remove all 28 cards from the pyramid by pairing cards whose ranks sum to 13.',
      'Valid pairs: Ace (1) + Queen (12), 2 + Jack (11), 3 + 10, 4 + 9, 5 + 8, 6 + 7. A King (13) may be removed alone.',
      'Click the stock to draw a card to the waste pile. The top waste card can be paired with an available pyramid card. When the stock is empty you may recycle the waste back into the stock a limited number of times.',
      'The game is won when the pyramid is completely cleared.',
    ],
  },
  {
    id: 'pyramid-alt',
    name: 'Pyramid Alt',
    subtitle: 'Direct pairing',
    blurb: 'Pyramid with a twist: match the visible stock top directly with pyramid cards.',
    color: 'bg-pink-100 dark:bg-pink-950',
    rules: [
      'Cards are dealt into a pyramid of 7 rows, plus a stock pile. The top card of the stock is always visible face-up.',
      'The goal is to remove all 28 pyramid cards by pairing cards whose ranks sum to 13.',
      'The visible stock top card can be paired directly with any available pyramid card or with the waste top — no draw required.',
      'A King anywhere (pyramid or stock top) is removed alone without pairing.',
      'Use the arrow button to draw the stock top to the waste without pairing. When the stock is empty, recycle the waste back into the stock (limited times).',
      'The game is won when the pyramid is completely cleared.',
    ],
  },
  {
    id: 'tri-peaks',
    name: 'Tri Peaks',
    subtitle: 'Three peaks, one waste',
    blurb: 'Clear the three pyramids by playing cards one rank above or below the waste pile.',
    color: 'bg-purple-100 dark:bg-purple-950',
    rules: [
      'Cards are arranged into three overlapping pyramids (peaks) of 4 rows each, plus a stock pile of 24 cards.',
      'The goal is to clear all cards from the peaks by sending them to the discard pile.',
      'A face-up peak card may be moved to the discard pile if it is one rank higher or lower than the current top of the discard pile — suit does not matter. Wrap-around is disabled: Kings and Aces are not adjacent.',
      'When no moves are available, draw a card from the stock to the discard pile to continue the chain.',
      'Building long chains without drawing from the stock earns bonus points.',
    ],
  },
  {
    id: 'tri-peaks-alt',
    name: 'Tri Peaks Alt',
    subtitle: 'Wrap-around peaks',
    blurb: 'Tri Peaks with a flow: Kings and Aces are adjacent for longer chains.',
    color: 'bg-emerald-100 dark:bg-emerald-950',
    rules: [
      'Cards are arranged into three overlapping pyramids (peaks) of 4 rows each, plus a stock pile of 24 cards.',
      'The goal is to clear all cards from the peaks by sending them to the discard pile.',
      'A face-up peak card may be moved to the discard pile if it is one rank higher or lower than the current top — wrap-around enabled: Kings and Aces are adjacent.',
      'When no moves are available, draw a card from the stock to the discard pile to continue the chain.',
      'Building long chains without drawing from the stock earns bonus points.',
    ],
  },
  {
    id: 'freecell',
    name: 'FreeCell',
    subtitle: 'Open cell strategy',
    blurb: 'All cards are visible from the start. Use the free cells to help maneuver cards to the foundation.',
    color: 'bg-orange-100 dark:bg-orange-950',
    rules: [
      'All 52 cards are dealt face-up into 8 tableau columns at the start of the game.',
      'The goal is to move all cards to the four foundation piles, built up by suit from Ace to King.',
      'Four free cells act as temporary holding spots — you may move any single card to an empty free cell at any time.',
      'Cards in the tableau are built in descending order, alternating colors. More cards can be moved at once when free cells and empty columns are available.',
      'Empty tableau columns can hold any card or sequence.',
    ],
  },
]

export function getVariant(id: GameVariantId): GameVariant {
  const variant = gameVariants.find((v) => v.id === id)
  if (!variant) throw new Error(`Unknown variant: ${id}`)
  return variant
}

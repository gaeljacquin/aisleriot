const gameVariantIds = [
  "klondike-draw-1",
  "klondike-draw-3",
  "freecell",
  "pyramid",
  "pyramid-alt",
  "tri-peaks",
  "tri-peaks-alt",
  "golf",
  "grandfathers-clock",
  "simple-simon",
  "acme",
  "agnes-bernauer",
  "spider",
]

export type GameVariantId = (typeof gameVariantIds)[number]

export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'

export interface GameVariant {
  id: GameVariantId
  name: string
  subtitle: string
  blurb: string
  rules: string[]
  color: string
  most_popular?: boolean
  gael_favorite?: boolean
  your_favorite?: boolean
  placeholder?: boolean
  foundation_base_rank?: Rank | null
}

const gameVariantsUnordered: GameVariant[] = [
  {
    id: "klondike-draw-1",
    name: "Klondike (Easy)",
    subtitle: "Draw 1",
    blurb:
      "The classic. Build foundations from Ace to King by suit, one card from the stock at a time.",
    color: "bg-rose-100 dark:bg-rose-950",
    rules: [
      "The goal is to move all 52 cards to four foundation piles, one per suit, built up from Ace to King.",
      "Cards in the tableau are arranged in 7 columns. You may place a card onto a tableau column if it is one rank lower and the opposite color of the top card.",
      "Click the stock pile to flip one card at a time to the waste pile. The top card of the waste pile may be moved to the tableau or foundations.",
      "An empty tableau column may only be filled with a King or a sequence starting with a King.",
      "When the stock is empty, click the recycling indicator to flip the waste pile back into the stock.",
    ],
    most_popular: true,
    foundation_base_rank: 'A',
  },
  {
    id: "klondike-draw-3",
    name: "Klondike",
    subtitle: "Draw 3",
    blurb:
      "The classic with bite. Three cards turn from the stock; only the top card is in play.",
    color: "bg-cyan-100 dark:bg-cyan-950",
    rules: [
      "The goal is to move all 52 cards to four foundation piles, one per suit, built up from Ace to King.",
      "Cards in the tableau are arranged in 7 columns. You may place a card onto a tableau column if it is one rank lower and the opposite color of the top card.",
      "Click the stock pile to flip three cards at a time to the waste pile. Only the top (rightmost) waste card may be played.",
      "An empty tableau column may only be filled with a King or a sequence starting with a King.",
      "When the stock is empty, click the recycling indicator to flip the waste pile back into the stock. A -100 score penalty applies per recycle.",
    ],
    most_popular: true,
    foundation_base_rank: 'A',
  },
  {
    id: "pyramid",
    name: "Pyramid",
    subtitle: "Pairs to thirteen",
    blurb:
      "Remove pairs that sum to 13 from a 28-card pyramid. Kings go alone.",
    color: "bg-sky-100 dark:bg-sky-950",
    rules: [
      "Cards are dealt into a pyramid of 7 rows. Each card is available once both cards overlapping it from the row below have been removed.",
      "The goal is to remove all 28 cards from the pyramid by pairing cards whose ranks sum to 13.",
      "Valid pairs: Ace (1) + Queen (12), 2 + Jack (11), 3 + 10, 4 + 9, 5 + 8, 6 + 7. A King (13) may be removed alone.",
      "Click the stock to draw a card to the waste pile. The top waste card can be paired with an available pyramid card. When the stock is empty you may recycle the waste back into the stock a limited number of times.",
      "The game is won when the pyramid is completely cleared.",
    ],
    most_popular: true,
    gael_favorite: true,
  },
  {
    id: "pyramid-alt",
    name: "Pyramid (Easy)",
    subtitle: "Direct pairing",
    blurb:
      "Pyramid with a twist: match the visible stock top directly with pyramid cards.",
    color: "bg-pink-100 dark:bg-pink-950",
    rules: [
      "Cards are dealt into a pyramid of 7 rows, plus a stock pile. The top card of the stock is always visible face-up.",
      "The goal is to remove all 28 pyramid cards by pairing cards whose ranks sum to 13.",
      "The visible stock top card can be paired directly with any available pyramid card or with the waste top — no draw required.",
      "A King anywhere (pyramid or stock top) is removed alone without pairing.",
      "Use the arrow button to draw the stock top to the waste without pairing. When the stock is empty, recycle the waste back into the stock (limited times).",
      "The game is won when the pyramid is completely cleared.",
    ],
    most_popular: true,
    gael_favorite: true,
  },
  {
    id: "tri-peaks",
    name: "Tri Peaks",
    subtitle: "Three peaks, one waste",
    blurb:
      "Clear the three pyramids by playing cards one rank above or below the waste pile.",
    color: "bg-purple-100 dark:bg-purple-950",
    rules: [
      "Cards are arranged into three overlapping pyramids (peaks) of 4 rows each, plus a stock pile of 24 cards.",
      "The goal is to clear all cards from the peaks by sending them to the discard pile.",
      "A face-up peak card may be moved to the discard pile if it is one rank higher or lower than the current top of the discard pile — suit does not matter. Wrap-around is disabled: Kings and Aces are not adjacent.",
      "When no moves are available, draw a card from the stock to the discard pile to continue the chain.",
      "Building long chains without drawing from the stock earns bonus points.",
    ],
    most_popular: true,
    gael_favorite: true,
  },
  {
    id: "tri-peaks-alt",
    name: "Tri Peaks (Easy)",
    subtitle: "Wrap-around peaks",
    blurb:
      "Tri Peaks with a flow: Kings and Aces are adjacent for longer chains.",
    color: "bg-emerald-100 dark:bg-emerald-950",
    rules: [
      "Cards are arranged into three overlapping pyramids (peaks) of 4 rows each, plus a stock pile of 24 cards.",
      "The goal is to clear all cards from the peaks by sending them to the discard pile.",
      "A face-up peak card may be moved to the discard pile if it is one rank higher or lower than the current top — wrap-around enabled: Kings and Aces are adjacent.",
      "When no moves are available, draw a card from the stock to the discard pile to continue the chain.",
      "Building long chains without drawing from the stock earns bonus points.",
    ],
    most_popular: true,
    gael_favorite: true,
  },
  {
    id: "golf",
    name: "Golf",
    subtitle: "Clear the columns",
    blurb:
      "Move all cards from the columns to the waste by rank. Speed and precision are key.",
    color: "bg-green-100 dark:bg-green-950",
    rules: [
      "Seven columns of five cards are dealt face-up. The goal is to move all cards to the waste pile.",
      "The waste pile starts with one card from the stock. Any face-up card at the bottom of a column can be moved to the waste if it is one rank higher or lower than the current top card.",
      "Suit does not matter. Wrap-around is disabled: you cannot place an Ace on a King, or a King on an Ace.",
      "In this version, Kings are 'stopped': once a King is on the waste pile, no card can be placed on top of it.",
      "Click the stock to draw a new card to the waste. There are no redeals.",
    ],
    gael_favorite: true,
  },
  {
    id: "freecell",
    name: "FreeCell",
    subtitle: "Open cell strategy",
    blurb:
      "All cards are visible from the start. Use the free cells to help maneuver cards to the foundation.",
    color: "bg-orange-100 dark:bg-orange-950",
    rules: [
      "All 52 cards are dealt face-up into 8 tableau columns at the start of the game.",
      "The goal is to move all cards to the four foundation piles, built up by suit from Ace to King.",
      "Four free cells act as temporary holding spots — you may move any single card to an empty free cell at any time.",
      "Cards in the tableau are built in descending order, alternating colors. More cards can be moved at once when free cells and empty columns are available.",
      "Empty tableau columns can hold any card or sequence.",
    ],
    most_popular: true,
    foundation_base_rank: 'A',
  },
  {
    id: "grandfathers-clock",
    name: "Grandfather's Clock",
    subtitle: "Build the clock",
    blurb:
      "Arrange cards in a circular clock face. Build foundations up by suit to match the hour.",
    color: "bg-amber-100 dark:bg-amber-950",
    rules: [
      "The goal is to move all cards to the 12 foundation piles (the 'Clock'), built up by suit to their respective 'hour' rank (Ace for 1, 10 for 10, Jack for 11, Queen for 12).",
      "Foundations are seeded with specific cards (e.g., 9 of Clubs at 12 o'clock). Ranking is continuous: King builds to Ace.",
      "The tableau has 8 columns of 5 cards each. Build down in rank regardless of suit. Ace wraps to King.",
      "Only one card can be moved at a time.",
      "Empty tableau columns can be filled with any available card.",
    ],
  },
  {
    id: "simple-simon",
    name: "Simple Simon",
    subtitle: "Spider Lite",
    blurb:
      "A Spider-like variant with all cards visible. Build descending suit sequences to clear them.",
    color: "bg-blue-100 dark:bg-blue-950",
    rules: [
      "All 52 cards are dealt face-up into 10 columns of varying heights.",
      "The goal is to build four 13-card descending suit sequences (King to Ace) on the tableau.",
      "You can build down regardless of suit. For example, any 5 can be placed on any 6.",
      "Only sequences of the same suit can be moved as a unit. Groups of cards not of the same suit cannot be moved.",
      "Completed 13-card suit sequences are automatically removed from the tableau.",
      "Empty columns can be filled with any available card or valid sequence.",
      "Nothing can be placed on an Ace.",
    ],
    gael_favorite: true,
    foundation_base_rank: 'A',
  },
  {
    id: "acme",
    name: "Acme",
    subtitle: "Canfield type",
    blurb:
      "A Canfield variation. Build four foundations up from Ace to King. Spaces automatically fill from the reserve.",
    color: "bg-indigo-100 dark:bg-indigo-950",
    rules: [
      "The goal is to move all 52 cards to four foundation piles, built up by suit from Ace to King.",
      "Four Aces are removed from the deck and placed on the foundations to start.",
      "The tableau has four columns, starting with one card each. Build down by suit.",
      "The reserve contains 13 cards. Empty tableau spaces are automatically filled from the reserve.",
      "When the reserve is empty, spaces may be filled from the waste, but never from the tableau.",
      "Only one card can be moved at a time.",
      "Turn one card at a time from the stock to the waste. One redeal is permitted.",
    ],
    foundation_base_rank: 'A',
  },
  {
    id: "agnes-bernauer",
    name: "Agnes Bernauer",
    subtitle: "Reserve Strategy",
    blurb:
      "A Klondike variant with continuous building and reserve piles. The foundations start with a random base rank.",
    color: "bg-amber-100 dark:bg-amber-950",
    rules: [
      "The goal is to move all cards to the foundations. Foundations build up in suit from a variable base card.",
      "Tableau builds down in alternating colors. Ranking is continuous: King builds on Ace.",
      "Foundation ranking is also continuous: Ace builds on King.",
      "Empty tableau spaces can only be filled by cards or sequences starting with the rank one below the base rank.",
      "Click the stock to deal one card to each of the seven reserve piles. Reserve cards are available for play to the tableau or foundations.",
    ],
    gael_favorite: true,
    foundation_base_rank: null,
  },
  {
    id: "spider",
    name: "Spider",
    subtitle: "One Suit",
    blurb:
      "Build 8 descending suit sequences from King to Ace on a 10-column tableau.",
    color: "bg-purple-100 dark:bg-purple-950",
    rules: [
      "Two decks of 104 cards, all of the same suit (Spades).",
      "The tableau has 10 columns: 6 cards in the first 4 columns, 5 cards in the remaining 6. The top card of each column is face up.",
      "Build down in rank regardless of suit. Cards of the same suit in descending sequence can be moved as a unit.",
      "Click the stock to deal 1 card face-up to each tableau column. All tableau columns must contain at least 1 card to deal.",
      "Completed 13-card suit sequences (King to Ace) are automatically removed from the tableau to foundations.",
      "The game is won when all 8 suit sequences are completed.",
    ],
    most_popular: true,
    gael_favorite: true,
    foundation_base_rank: 'A',
  },
]

export const gameVariants: GameVariant[] = gameVariantsUnordered.sort((a, b) =>
  a.name.localeCompare(b.name)
)

export function getVariant(id: GameVariantId): GameVariant {
  const variant = gameVariants.find((v) => v.id === id)
  if (!variant) throw new Error(`Unknown variant: ${id}`)
  return variant
}

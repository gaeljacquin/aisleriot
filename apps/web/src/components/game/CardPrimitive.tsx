// @ts-expect-error - react-free-playing-cards does not have types
import ReactCard from 'react-free-playing-cards/lib/TcN'
import type { Suit, Rank } from '#/lib/types'

interface CardPrimitiveProps {
  suit: Suit
  rank: Rank
  faceUp: boolean
  className?: string
}

const SUIT_MAP: Record<Suit, string> = {
  clubs: 'c',
  diamonds: 'd',
  hearts: 'h',
  spades: 's',
}

const RANK_MAP: Record<Rank, string> = {
  A: 'A',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': 'T',
  J: 'J',
  Q: 'Q',
  K: 'K',
}

export default function CardPrimitive({ suit, rank, faceUp, className }: CardPrimitiveProps) {
  const cardCode = `${RANK_MAP[rank]}${SUIT_MAP[suit]}`

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <ReactCard
        card={cardCode}
        back={!faceUp}
        height="100%"
        style={{ display: 'block', width: '100%' }}
      />
    </div>
  )
}

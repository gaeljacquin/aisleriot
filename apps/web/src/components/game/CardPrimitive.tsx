// @ts-expect-error - react-free-playing-cards does not have types
import ReactCard from 'react-free-playing-cards'
import type { Suit, Rank } from '#/lib/types'
import { cn } from '@workspace/ui/lib/utils'
import { useCardSettingsStore } from '#/stores/card-settings'
import type { CardStyle } from '#/stores/card-settings'

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

const DECK_TYPE_MAP: Record<CardStyle, string | undefined> = {
  basic: undefined,
  'four-color': 'four-color',
  large: 'big-face',
  'large-four-color': 'big-face four-color',
}

export default function CardPrimitive({
  suit,
  rank,
  faceUp,
  className,
}: CardPrimitiveProps) {
  const cardCode = `${RANK_MAP[rank]}${SUIT_MAP[suit]}`
  const cardStyle = useCardSettingsStore((s) => s.cardStyle)

  if (!faceUp) {
    return (
      <div
        className={cn(
          'relative h-full w-full rounded-lg border-2 border-slate-800 bg-linear-to-br from-slate-700 to-slate-900 shadow-sm',
          className,
        )}
      >
        {/* Diamond pattern */}
        <div className="pointer-events-none absolute inset-0 rounded-lg opacity-20">
          <div className="h-full w-full rounded-lg bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <ReactCard
        card={cardCode}
        deckType={DECK_TYPE_MAP[cardStyle]}
        back={false}
        height="100%"
        style={{ display: 'block', width: '100%' }}
      />
    </div>
  )
}

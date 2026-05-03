import { lazy, Suspense } from 'react'
import type { Suit, Rank } from '#/lib/types'
import { cn } from '@workspace/ui/lib/utils'
import { useCardSettingsStore } from '#/stores/card-settings'
import type { CardStyle, CardBack } from '#/stores/card-settings'

// Lazy load the different deck types from the library's sub-paths
// react-free-playing-cards does not have types, but the default export is the card component
// @ts-expect-error - no types
const TcN = lazy(() =>
  import('react-free-playing-cards/lib/TcN').then((m) => ({
    default: m.default?.default || m.default || m,
  })),
)
// @ts-expect-error - no types
const TcB = lazy(() =>
  import('react-free-playing-cards/lib/TcB').then((m) => ({
    default: m.default?.default || m.default || m,
  })),
)
// @ts-expect-error - no types
const FcN = lazy(() =>
  import('react-free-playing-cards/lib/FcN').then((m) => ({
    default: m.default?.default || m.default || m,
  })),
)
// @ts-expect-error - no types
const FcB = lazy(() =>
  import('react-free-playing-cards/lib/FcB').then((m) => ({
    default: m.default?.default || m.default || m,
  })),
)

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

const DECK_COMPONENTS: Record<CardStyle, React.ElementType> = {
  basic: TcN,
  large: TcB,
  'four-color': FcN,
  'large-four-color': FcB,
}

const CARD_BACK_STYLES: Record<CardBack, React.CSSProperties> = {
  default: {
    background: 'linear-gradient(135deg, hsl(215 25% 27%), hsl(215 25% 15%))',
  },
  classic: {
    background: 'linear-gradient(135deg, hsl(354 50% 30%), hsl(354 60% 18%))',
  },
  lattice: {
    background:
      'repeating-linear-gradient(45deg, hsl(44 56% 54% / 0.4) 0 2px, hsl(158 64% 11%) 2px 8px)',
    backgroundColor: 'hsl(158 64% 11%)',
  },
  monogram: {
    background: 'linear-gradient(135deg, hsl(158 64% 11%), hsl(158 70% 5%))',
  },
}

export default function CardPrimitive({
  suit,
  rank,
  faceUp,
  className,
}: CardPrimitiveProps) {
  const cardCode = `${RANK_MAP[rank]}${SUIT_MAP[suit]}`
  const { cardStyle, cardBack } = useCardSettingsStore()

  if (!faceUp) {
    return (
      <div
        className={cn(
          'relative h-full w-full rounded-lg border-2 border-slate-800 shadow-sm',
          className,
        )}
        style={CARD_BACK_STYLES[cardBack]}
      >
        {/* Pattern Overlays */}
        {cardBack === 'default' && (
          <div className="pointer-events-none absolute inset-0 rounded-lg opacity-20">
            <div className="h-full w-full rounded-lg bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
          </div>
        )}
        {(cardBack === 'classic' || cardBack === 'monogram') && (
          <div className="pointer-events-none absolute inset-0 rounded-lg opacity-10">
            <div className="h-full w-full rounded-lg bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
          </div>
        )}
      </div>
    )
  }

  const DeckComponent = DECK_COMPONENTS[cardStyle]

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Suspense
        fallback={
          <div className="h-full w-full rounded-lg bg-white opacity-50" />
        }
      >
        <DeckComponent
          card={cardCode}
          back={false}
          height="100%"
          // @ts-expect-error - style prop mismatch
          style={{ display: 'block', width: '100%' }}
        />
      </Suspense>
    </div>
  )
}

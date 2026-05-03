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

const DECK_COMPONENTS: Record<
  Exclude<CardStyle, 'minimal'>,
  React.ElementType
> = {
  basic: TcN,
  large: TcB,
  'four-color': FcN,
  'large-four-color': FcB,
}

const SUIT_GLYPH: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

function MinimalCard({ suit, rank }: { suit: Suit; rank: Rank }) {
  const isRed = suit === 'hearts' || suit === 'diamonds'
  const glyph = SUIT_GLYPH[suit]
  const colorClass = isRed ? 'text-rose-600' : 'text-slate-900'

  return (
    <div className="relative h-full w-full rounded-lg border border-gold/40 bg-white p-1 text-slate-900 shadow-sm transition-transform duration-200">
      {/* corner top-left */}
      <div
        className={cn(
          'absolute left-1 top-1 flex flex-col items-center leading-none',
          colorClass,
        )}
      >
        <span className="font-serif font-bold text-[1em]">{rank}</span>
        <span className="text-[0.8em]">{glyph}</span>
      </div>
      {/* corner bottom-right (rotated) */}
      <div
        className={cn(
          'absolute bottom-1 right-1 flex rotate-180 flex-col items-center leading-none',
          colorClass,
        )}
      >
        <span className="font-serif font-bold text-[1em]">{rank}</span>
        <span className="text-[0.8em]">{glyph}</span>
      </div>
      {/* center pip */}
      <div
        className={cn(
          'absolute inset-0 grid place-items-center opacity-90',
          colorClass,
        )}
      >
        <span className="text-[2.2em] leading-none drop-shadow-sm">
          {glyph}
        </span>
      </div>
    </div>
  )
}

export const CARD_BACK_STYLES: Record<CardBack, string> = {
  default: 'linear-gradient(135deg, hsl(215 25% 27%), hsl(215 25% 15%))',
  classic: 'linear-gradient(135deg, hsl(354 50% 30%), hsl(354 60% 18%))',
  lattice: 'hsl(158 64% 11%)',
  monogram: 'linear-gradient(135deg, hsl(158 64% 11%), hsl(158 70% 5%))',
  royal: 'linear-gradient(135deg, hsl(354 45% 28%), hsl(354 55% 18%))',
}

export function CardBackComponent({
  className,
  backOverride,
}: {
  className?: string
  backOverride?: CardBack
}) {
  const { cardBack: globalBack } = useCardSettingsStore()
  const back = backOverride ?? globalBack

  return (
    <div
      className={cn(
        'relative h-full w-full rounded-lg border-2 border-slate-800 shadow-sm overflow-hidden',
        className,
      )}
      style={{ background: CARD_BACK_STYLES[back] }}
    >
      {/* Pattern Overlays */}
      {back === 'default' && (
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
        </div>
      )}
      {(back === 'classic' || back === 'monogram') && (
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
        </div>
      )}
      {back === 'lattice' && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, hsl(44 56% 54% / 0.4) 0 2px, transparent 2px 8px)',
          }}
        />
      )}
      {back === 'royal' && (
        <div
          className="absolute inset-1 rounded-sm border border-gold/40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, hsl(44 56% 54% / 0.18) 0 2px, transparent 2px 8px), repeating-linear-gradient(-45deg, hsl(44 56% 54% / 0.18) 0 2px, transparent 2px 8px)',
          }}
        />
      )}
    </div>
  )
}

export default function CardPrimitive({
  suit,
  rank,
  faceUp,
  className,
}: CardPrimitiveProps) {
  const cardCode = `${RANK_MAP[rank]}${SUIT_MAP[suit]}`
  const { cardStyle } = useCardSettingsStore()

  if (!faceUp) {
    return <CardBackComponent className={className} />
  }

  if (cardStyle === 'minimal') {
    return (
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <MinimalCard suit={suit} rank={rank} />
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

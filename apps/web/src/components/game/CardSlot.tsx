import { cn } from '@workspace/ui/lib/utils'
import type { PileRole, Suit, Rank } from '#/lib/types'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

interface CardSlotProps {
  role: PileRole
  label?: string
  suit?: Suit
  baseRank?: Rank | string | null
  showLogo?: boolean
  className?: string
}

export default function CardSlot({
  role: _role,
  label,
  suit,
  baseRank,
  showLogo,
  className,
}: CardSlotProps) {
  const glyph = suit ? SUIT_SYMBOLS[suit] : null

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-green-700 bg-green-900',
        className,
      )}
      style={{
        width: 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
      aria-label="empty card slot"
    >
      {/* Green Logo Hint */}
      {showLogo && (
        <div
          className="w-1/2 h-1/2 pointer-events-none select-none bg-green-600/90"
          style={{
            maskImage: 'url(/g-logo.png)',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: 'url(/g-logo.png)',
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          }}
        />
      )}

      {/* Center base rank - big font */}
      {(baseRank || label) && (
        <span
          className={cn(
            'font-display text-[4rem] font-bold text-green-600 pointer-events-none select-none text-center leading-none uppercase',
          )}
        >
          {baseRank || label}
        </span>
      )}

      {/* Corners - suit glyphs */}
      {glyph && (
        <>
          <div
            className={cn(
              'absolute left-2 top-2 text-[1.2rem] select-none pointer-events-none text-green-600',
            )}
          >
            {glyph}
          </div>
          <div
            className={cn(
              'absolute right-2 bottom-2 text-[1.2rem] select-none rotate-180 pointer-events-none text-green-600',
            )}
          >
            {glyph}
          </div>
        </>
      )}
    </div>
  )
}

import { cn } from '@workspace/ui/lib/utils'
import type { Suit, Rank } from '#/lib/types'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

interface AgnesBernauerFoundationSlotProps {
  suit: Suit
  baseRank: Rank
  className?: string
}

export default function AgnesBernauerFoundationSlot({
  suit,
  baseRank,
  className,
}: AgnesBernauerFoundationSlotProps) {
  const isRed = suit === 'hearts' || suit === 'diamonds'
  const glyph = SUIT_SYMBOLS[suit]
  const colorClass = isRed ? 'text-rose-600/30' : 'text-slate-400/20'

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
      aria-label={`foundation slot for ${suit}, starting at ${baseRank}`}
    >
      {/* Center base rank - big font */}
      <span className="font-display text-[4rem] font-bold text-green-700/40 select-none uppercase pointer-events-none">
        {baseRank}
      </span>

      {/* Corners - suit glyphs */}
      <div
        className={cn(
          'absolute left-2 top-2 text-[1.2rem] select-none pointer-events-none',
          colorClass,
        )}
      >
        {glyph}
      </div>
      <div
        className={cn(
          'absolute right-2 bottom-2 text-[1.2rem] select-none rotate-180 pointer-events-none',
          colorClass,
        )}
      >
        {glyph}
      </div>
    </div>
  )
}

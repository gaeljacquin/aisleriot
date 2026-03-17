import { cn } from '@workspace/ui/lib/utils'
import type { Suit, Rank } from '#/lib/types'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

interface CardProps {
  suit: Suit
  rank: Rank
  faceUp: boolean
  highlighted?: boolean
  onClick?: () => void
  className?: string
}

export default function Card({ suit, rank, faceUp, highlighted, onClick, className }: CardProps) {
  const isRed = suit === 'hearts' || suit === 'diamonds'
  const symbol = SUIT_SYMBOLS[suit]

  if (!faceUp) {
    return (
      <div
        className={cn(
          'relative flex h-28 w-20 select-none items-center justify-center rounded-lg border border-slate-600',
          'bg-linear-to-br from-slate-700 to-slate-900',
          onClick && 'cursor-pointer',
          className,
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        aria-label="face-down card"
      >
        {/* subtle diamond pattern */}
        <div className="pointer-events-none absolute inset-0 rounded-lg opacity-20">
          <div className="h-full w-full rounded-lg bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex h-28 w-20 select-none flex-col rounded-lg border border-slate-200 bg-white shadow-sm',
        isRed ? 'text-red-600' : 'text-slate-900',
        highlighted && 'ring-2 ring-primary ring-offset-1',
        onClick && 'cursor-pointer hover:brightness-95 active:scale-95',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={`${rank} of ${suit}`}
    >
      {/* Top-left rank + suit */}
      <div className="pointer-events-none flex flex-col items-start px-1 pt-0.5 leading-none">
        <span className="text-xs font-bold">{rank}</span>
        <span className="text-xs">{symbol}</span>
      </div>

      {/* Center suit symbol */}
      <div className="pointer-events-none flex flex-1 items-center justify-center">
        <span className="text-3xl leading-none">{symbol}</span>
      </div>

      {/* Bottom-right rank + suit (rotated) */}
      <div className="pointer-events-none flex rotate-180 flex-col items-start px-1 pb-0.5 leading-none">
        <span className="text-xs font-bold">{rank}</span>
        <span className="text-xs">{symbol}</span>
      </div>
    </div>
  )
}

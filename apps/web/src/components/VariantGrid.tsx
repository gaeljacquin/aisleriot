import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight02Icon,
  ChampionIcon,
  Clock01Icon,
  Refresh01Icon,
} from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import { gameVariants } from '@workspace/constants'
import type { GameVariant } from '@workspace/constants'
import { MiniBoard } from './MiniBoard'

interface VariantGridProps {
  onSelect: (variant: GameVariant) => void
}

export function VariantGrid({ onSelect }: VariantGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {gameVariants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant)}
          className={cn(
            'group relative flex flex-col gap-5 rounded-2xl border p-6 text-left transition-all duration-300 cursor-pointer',
            'border-gold/20 bg-felt-light/40 hover:-translate-y-1 hover:border-gold/40 hover:bg-felt-light/60 hover:shadow-card-lift',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-cream md:text-3xl">
                {variant.name}
              </h2>
              <p className="mt-0.5 font-serif text-[11px] uppercase tracking-[0.25em] text-gold/80">
                {variant.subtitle}
              </p>
            </div>
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              className="h-5 w-5 text-gold/60 transition-all group-hover:translate-x-1 group-hover:text-gold"
              strokeWidth={1.75}
            />
          </div>

          <div className="flex h-28 items-center justify-center rounded-md border border-gold/10 bg-felt-deep/50 p-3">
            <div className="flex w-full items-center justify-center overflow-hidden">
              <MiniBoard id={variant.id} />
            </div>
          </div>

          <p className="font-serif text-sm leading-relaxed text-cream-dim">
            {variant.blurb}
          </p>

          <div className="h-px w-full bg-linear-to-r from-transparent via-gold/20 to-transparent" />

          <dl className="grid grid-cols-3 gap-2 text-center">
            <div>
              <dt className="flex items-center justify-center gap-1 font-serif text-[10px] uppercase tracking-wider text-cream-dim">
                <HugeiconsIcon icon={Refresh01Icon} className="h-3 w-3" />{' '}
                Played
              </dt>
              <dd className="mt-1 font-serif text-base text-cream">?</dd>
            </div>
            <div>
              <dt className="flex items-center justify-center gap-1 font-serif text-[10px] uppercase tracking-wider text-cream-dim">
                <HugeiconsIcon icon={ChampionIcon} className="h-3 w-3" /> Win %
              </dt>
              <dd className="mt-1 font-serif text-base text-gold">N/A</dd>
            </div>
            <div>
              <dt className="flex items-center justify-center gap-1 font-serif text-[10px] uppercase tracking-wider text-cream-dim">
                <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" /> Best
              </dt>
              <dd className="mt-1 font-serif text-base text-cream">0:00</dd>
            </div>
          </dl>
        </button>
      ))}
    </div>
  )
}

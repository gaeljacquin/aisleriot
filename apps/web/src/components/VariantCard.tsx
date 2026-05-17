import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import type { GameVariant } from '@workspace/constants'
import { MiniBoard } from './MiniBoard'

interface VariantCardProps {
  variant: GameVariant
  onClick?: () => void
  className?: string
}

export function VariantCard({ variant, onClick, className }: VariantCardProps) {
  return (
    <button
      type="button"
      className={cn(
        'group relative flex w-full flex-col gap-5 rounded-2xl border p-6 text-left transition-all duration-300',
        'border-gold/20 bg-felt-light/40 shadow-card',
        onClick &&
          'cursor-pointer hover:-translate-y-1 hover:border-gold/40 hover:bg-felt-light/60 hover:shadow-card-lift',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg text-cream md:text-xl">
            {variant.name}
          </h2>
        </div>
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          className="h-5 w-5 text-gold/60 transition-all group-hover:translate-x-1 group-hover:text-gold"
          strokeWidth={1.75}
        />
      </div>

      <div className="flex h-48 items-center justify-center rounded-md border border-gold/10 bg-felt-deep/50 p-3">
        <div className="flex w-full items-center justify-center overflow-hidden">
          <MiniBoard id={variant.id} />
        </div>
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      {/* Placeholder for stats - could be real stats later */}
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div>
          <dt className="flex items-center justify-center gap-1 font-serif text-[10px] uppercase tracking-wider text-cream-dim">
            Played
          </dt>
          <dd className="mt-1 font-serif text-base text-cream">?</dd>
        </div>
        <div>
          <dt className="flex items-center justify-center gap-1 font-serif text-[10px] uppercase tracking-wider text-cream-dim">
            Win %
          </dt>
          <dd className="mt-1 font-serif text-base text-gold">N/A</dd>
        </div>
        <div>
          <dt className="flex items-center justify-center gap-1 font-serif text-[10px] uppercase tracking-wider text-cream-dim">
            Best
          </dt>
          <dd className="mt-1 font-serif text-base text-cream">0:00</dd>
        </div>
      </dl>
    </button>
  )
}

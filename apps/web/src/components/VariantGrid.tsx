import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight02Icon,
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

          <div className="flex h-28 items-center justify-center rounded-md border border-gold/10 bg-felt-deep/50 p-3">
            <div className="flex w-full items-center justify-center overflow-hidden">
              <MiniBoard id={variant.id} />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

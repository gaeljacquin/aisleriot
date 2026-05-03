import { cn } from '@workspace/ui/lib/utils'
import { gameVariants } from '@workspace/constants'
import type { GameVariant } from '@workspace/constants'

interface VariantGridProps {
  onSelect: (variant: GameVariant) => void
  showDescription?: boolean
}

export function VariantGrid({
  onSelect,
  showDescription = true,
}: VariantGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {gameVariants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant)}
          className={cn(
            'group flex flex-col gap-2 cursor-pointer rounded-2xl border p-5 text-left transition-all',
            'border-gold/10 bg-felt-deep/40 hover:border-gold/40 hover:bg-felt-light/20 shadow-sm hover:shadow-card',
          )}
        >
          <span className="font-serif text-lg font-bold tracking-tight text-gold transition-colors group-hover:text-gold-soft">
            {variant.name}
          </span>
          {showDescription && (
            <span className="font-serif text-sm leading-relaxed text-cream-dim transition-colors group-hover:text-cream">
              {variant.description}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

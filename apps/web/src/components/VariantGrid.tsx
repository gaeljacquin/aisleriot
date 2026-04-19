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
    <div className="grid grid-cols-2 gap-3">
      {gameVariants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          onClick={() => onSelect(variant)}
          className={cn(
            'flex flex-col gap-1.5 cursor-pointer border border-border p-5 text-left transition-colors hover:brightness-95',
            variant.color,
          )}
        >
          <span className="text-sm font-semibold text-foreground">
            {variant.name}
          </span>
          {showDescription && (
            <span className="text-xs text-muted-foreground">
              {variant.description}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

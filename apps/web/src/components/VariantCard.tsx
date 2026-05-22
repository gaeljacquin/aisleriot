import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight02Icon,
  Bookmark02Icon,
  BookmarkAdd02Icon,
  BookmarkCheck02Icon,
  BookmarkMinus01Icon,
} from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import type { GameVariant } from '@workspace/constants'
import { MiniBoard } from './MiniBoard'
import { useFavoritesStore } from '@/stores/favorites'

interface VariantCardProps {
  variant: GameVariant
  onClick?: () => void
  className?: string
}

export function VariantCard({ variant, onClick, className }: VariantCardProps) {
  const isPlaceholder = !!variant.placeholder
  const canClick = onClick && !isPlaceholder
  const { favorites, toggleFavorite } = useFavoritesStore()
  const isFavorite = favorites.includes(variant.id)
  const [isHeartHovered, setIsHeartHovered] = useState(false)

  return (
    <button
      type="button"
      disabled={isPlaceholder}
      className={cn(
        'group relative flex w-full flex-col gap-5 rounded-2xl border p-6 text-left transition-all duration-300',
        'border-gold/20 bg-felt-light/40 shadow-card',
        canClick &&
          'cursor-pointer hover:-translate-y-1 hover:border-gold/40 hover:bg-felt-light/60 hover:shadow-card-lift',
        isPlaceholder && 'cursor-not-allowed opacity-80',
        className,
      )}
      onClick={canClick ? onClick : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-lg text-cream md:text-xl">
            {variant.name}
          </h2>
          {!isPlaceholder && (
            <div
              className="relative z-10"
              onMouseEnter={() => setIsHeartHovered(true)}
              onMouseLeave={() => setIsHeartHovered(false)}
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(variant.id)
              }}
            >
              <HugeiconsIcon
                icon={
                  isFavorite
                    ? isHeartHovered
                      ? BookmarkMinus01Icon
                      : BookmarkCheck02Icon
                    : isHeartHovered
                      ? BookmarkAdd02Icon
                      : Bookmark02Icon
                }
                className={cn(
                  'h-5 w-5 transition-all duration-200 text-gold',
                  !isFavorite &&
                    !isHeartHovered &&
                    'opacity-30 group-hover:opacity-100',
                )}
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>
        {!isPlaceholder && (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            className="h-5 w-5 text-gold/60 transition-all group-hover:translate-x-1 group-hover:text-gold"
            strokeWidth={1.75}
          />
        )}
      </div>

      <div className="flex h-48 items-center justify-center rounded-md border border-gold/10 bg-felt-deep/50 p-3">
        <div className="flex h-full w-full items-center justify-center overflow-hidden">
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

      {isPlaceholder && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <span className="rounded-full bg-gold/10 px-3 py-1 font-serif text-[10px] uppercase tracking-widest text-gold ring-1 ring-gold/30">
            Coming Soon
          </span>
        </div>
      )}
    </button>
  )
}

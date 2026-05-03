import { cn } from '@workspace/ui/lib/utils'
import type { GameVariantId } from '@workspace/constants'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'

interface MiniBoardProps {
  id: GameVariantId
}

export function MiniBoard({ id }: MiniBoardProps) {
  const cls = 'rounded-[2px] border border-gold/40 bg-felt-light/20 shadow-sm'
  const cardBack = 'bg-rose-900/40'
  const cardFace = 'bg-felt-light/40'

  if (id === 'klondike-draw-1' || id === 'klondike-draw-3') {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            <div className={cn(cls, 'h-7 w-5', cardBack)} />
            <div className={cn(cls, 'h-7 w-5', cardFace)} />
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn(cls, 'h-7 w-5 opacity-60')} />
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col -space-y-[18px]">
              {Array.from({ length: i + 1 }).map((_, j) => (
                <div
                  key={j}
                  className={cn(
                    cls,
                    'h-6 w-[18px]',
                    j < i ? cardBack : cardFace,
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'tri-peaks' || id === 'tri-peaks-alt') {
    return (
      <div className="flex w-full flex-col items-center gap-0">
        {/* The 28-card peaks layout - precisely spread */}
        <div className="relative h-[47px] w-full max-w-[160px]">
          {/* Row 1: 3 Peaks (portrait orientation) */}
          <div
            className={cn(
              cls,
              'absolute left-[15.2%] top-0 h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[45.6%] top-0 h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[76%] top-0 h-[20px] w-[14px]',
              cardBack,
            )}
          />

          {/* Row 2: 6 cards */}
          <div
            className={cn(
              cls,
              'absolute left-[10.1%] top-[9px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[20.3%] top-[9px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[40.5%] top-[9px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[50.7%] top-[9px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[70.9%] top-[9px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[81.1%] top-[9px] h-[20px] w-[14px]',
              cardBack,
            )}
          />

          {/* Row 3: 9 cards */}
          <div
            className={cn(
              cls,
              'absolute left-[5.1%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[15.2%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[25.3%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[35.5%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[45.6%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[55.7%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[65.9%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[76%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />
          <div
            className={cn(
              cls,
              'absolute left-[86.1%] top-[18px] h-[20px] w-[14px]',
              cardBack,
            )}
          />

          {/* Row 4: 10 face-up base cards */}
          <div className="absolute inset-x-0 top-[27px] flex justify-between">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(cls, 'h-[20px] w-[14px] shrink-0', cardFace)}
              />
            ))}
          </div>
        </div>

        {/* Stock and Waste - moved down but close gap */}
        <div className="mt-2.5 flex gap-2">
          <div className={cn(cls, 'h-[20px] w-[14px]', cardBack)} />
          <div className={cn(cls, 'h-[20px] w-[14px]', cardFace)} />
        </div>
      </div>
    )
  }

  if (id === 'freecell') {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn(cls, 'h-6 w-5 opacity-60')} />
            ))}
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn(cls, 'h-6 w-5 opacity-60')} />
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col -space-y-4">
              {Array.from({ length: i < 4 ? 7 : 6 }).map((_, j) => (
                <div key={j} className={cn(cls, 'h-5 w-4', cardFace)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // pyramid
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center -space-y-[18px]">
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="flex gap-0.5">
            {Array.from({ length: row + 1 }).map((_, i) => (
              <div key={i} className={cn(cls, 'h-6 w-5', cardFace)} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className={cn(cls, 'h-6 w-5', cardBack)} />
        {id === 'pyramid-alt' && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/10 text-gold shadow-sm">
            <HugeiconsIcon icon={ArrowRight02Icon} className="h-3.5 w-3.5" />
          </div>
        )}
        <div className={cn(cls, 'h-6 w-5', cardFace)} />
      </div>
    </div>
  )
}

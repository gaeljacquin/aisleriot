import { cn } from '@workspace/ui/lib/utils'
import type { GameVariantId } from '@workspace/constants'
import type { Suit, Rank } from '#/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { PREVIEW_DEALS } from '#/lib/games/preview-deals'
import CardPrimitive from './game/CardPrimitive'

interface MiniBoardProps {
  id: GameVariantId
}

function MiniCard({
  suit,
  rank,
  faceUp,
  className,
  style,
}: {
  suit?: Suit
  rank?: Rank
  faceUp: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cn('relative rounded-[1px] overflow-hidden', className)}
      style={style}
    >
      <CardPrimitive
        suit={suit || 'spades'}
        rank={rank || 'A'}
        faceUp={faceUp}
        className="h-full w-full"
      />
    </div>
  )
}

export function MiniBoard({ id }: MiniBoardProps) {
  const deal = PREVIEW_DEALS[id]

  if (!deal) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-md border border-gold/10 bg-felt-deep/20 text-cream-dim/40 italic">
        Preview unavailable
      </div>
    )
  }

  if (id === 'klondike-draw-1' || id === 'klondike-draw-3') {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            <MiniCard faceUp={deal.stock.faceUp} className="h-9 w-6.5" />
            {Array.isArray(deal.waste) ? (
              <div className="flex -space-x-5">
                {deal.waste.map((card: any, i: number) => (
                  <MiniCard
                    key={i}
                    suit={card.suit}
                    rank={card.rank}
                    faceUp={card.faceUp}
                    className="h-9 w-6.5"
                  />
                ))}
              </div>
            ) : (
              <MiniCard
                suit={deal.waste.suit}
                rank={deal.waste.rank}
                faceUp={deal.waste.faceUp}
                className="h-9 w-6.5"
              />
            )}
          </div>
          <div className="flex gap-1">
            {deal.foundations.map((card: any, i: number) => (
              <div
                key={i}
                className="h-9 w-6.5 rounded-[1px] border border-gold/10 bg-white/5"
              >
                {card && (
                  <MiniCard
                    suit={card.suit}
                    rank={card.rank}
                    faceUp={card.faceUp}
                    className="h-full w-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-0.5">
          {deal.tableau.map((column: any[], i: number) => (
            <div key={i} className="flex flex-col -space-y-7">
              {column.map((card, j) => (
                <MiniCard
                  key={j}
                  suit={card.suit}
                  rank={card.rank}
                  faceUp={card.faceUp}
                  className="h-8 w-6"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'tri-peaks' || id === 'tri-peaks-alt') {
    const peaks = deal.peaks
    return (
      <div className="flex w-full flex-col items-center gap-1">
        <div className="relative h-20 w-full max-w-64">
          {/* Row 1: 3 Peaks */}
          <MiniCard
            {...peaks[0]}
            className="absolute left-[15.2%] top-0 h-8 w-6"
          />
          <MiniCard
            {...peaks[1]}
            className="absolute left-[45.6%] top-0 h-8 w-6"
          />
          <MiniCard
            {...peaks[2]}
            className="absolute left-[76%] top-0 h-8 w-6"
          />

          {/* Row 2: 6 cards */}
          <MiniCard
            {...peaks[3]}
            className="absolute left-[10.1%] top-[12px] h-8 w-6"
          />
          <MiniCard
            {...peaks[4]}
            className="absolute left-[20.3%] top-[12px] h-8 w-6"
          />
          <MiniCard
            {...peaks[5]}
            className="absolute left-[40.5%] top-[12px] h-8 w-6"
          />
          <MiniCard
            {...peaks[6]}
            className="absolute left-[50.7%] top-[12px] h-8 w-6"
          />
          <MiniCard
            {...peaks[7]}
            className="absolute left-[70.9%] top-[12px] h-8 w-6"
          />
          <MiniCard
            {...peaks[8]}
            className="absolute left-[81.1%] top-[12px] h-8 w-6"
          />

          {/* Row 3: 9 cards */}
          {[9, 10, 11, 12, 13, 14, 15, 16, 17].map((idx, i) => (
            <MiniCard
              key={idx}
              {...peaks[idx]}
              className="absolute h-8 w-6 top-[24px]"
              style={{ left: `${5.1 + i * 10.125}%` }}
            />
          ))}

          {/* Row 4: 10 cards */}
          <div className="absolute inset-x-0 top-[36px] flex justify-between">
            {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map((idx) => (
              <MiniCard key={idx} {...peaks[idx]} className="h-8 w-6" />
            ))}
          </div>
        </div>

        <div className="mt-2.5 flex gap-2">
          <MiniCard faceUp={deal.stock.faceUp} className="h-8 w-6" />
          <MiniCard
            suit={deal.waste.suit}
            rank={deal.waste.rank}
            faceUp={deal.waste.faceUp}
            className="h-8 w-6"
          />
        </div>
      </div>
    )
  }

  if (id === 'grandfathers-clock') {
    const clockRadius = 48
    const clockPositions = [
      { angle: 0 }, // 12
      { angle: 30 }, // 1
      { angle: 60 }, // 2
      { angle: 90 }, // 3
      { angle: 120 }, // 4
      { angle: 150 }, // 5
      { angle: 180 }, // 6
      { angle: 210 }, // 7
      { angle: 240 }, // 8
      { angle: 270 }, // 9
      { angle: 300 }, // 10
      { angle: 330 }, // 11
    ]

    // Sort foundation cards to match the 12, 1, 2... order if they aren't already
    const foundationCards = [...deal.foundation]
    const rotatedFoundations = [
      foundationCards[11], // 12 o'clock
      ...foundationCards.slice(0, 11),
    ]

    return (
      <div className="flex w-full items-center justify-between gap-2 px-1">
        {/* Tableau - 2 rows of 4 */}
        <div className="grid grid-cols-4 gap-x-1 gap-y-1">
          {deal.tableau.map((column: any[], i: number) => (
            <div key={i} className="flex flex-col -space-y-4">
              {column.map((card: any, j: number) => (
                <MiniCard key={j} {...card} className="h-7.5 w-5.5" />
              ))}
            </div>
          ))}
        </div>

        {/* Clock Foundations */}
        <div className="relative h-32 w-32 shrink-0">
          {clockPositions.map((pos, i) => {
            const card = rotatedFoundations[i]
            const sin = Math.sin((pos.angle * Math.PI) / 180)
            const cos = Math.cos((pos.angle * Math.PI) / 180)
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(50% + ${sin * clockRadius}px)`,
                  top: `calc(50% - ${cos * clockRadius}px)`,
                }}
              >
                <div className="h-5.5 w-4 rounded-[0.5px] border border-gold/10 bg-white/5">
                  <MiniCard {...card} className="h-full w-full" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (id === 'golf') {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <div className="flex justify-between gap-0.5 px-0.5">
          {deal.columns.map((column: any[], i: number) => (
            <div key={i} className="flex flex-col -space-y-6">
              {column.map((card: any, j: number) => (
                <MiniCard key={j} {...card} className="h-8 w-6" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <MiniCard faceUp={deal.stock.faceUp} className="h-9 w-6.5" />
          <MiniCard {...deal.waste} className="h-9 w-6.5" />
        </div>
      </div>
    )
  }

  if (id === 'freecell') {
    return (
      <div className="flex w-full flex-col gap-2.5">
        <div className="flex justify-between">
          <div className="flex gap-1">
            {deal.freecells.map((card: any, i: number) => (
              <div
                key={i}
                className="h-9 w-7 rounded-[1px] border border-gold/10 bg-white/5"
              >
                {card && <MiniCard {...card} className="h-full w-full" />}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {deal.foundations.map((card: any, i: number) => (
              <div
                key={i}
                className="h-9 w-7 rounded-[1px] border border-gold/10 bg-white/5"
              >
                {card && <MiniCard {...card} className="h-full w-full" />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between gap-0.5">
          {deal.columns.map((column: any[], i: number) => (
            <div key={i} className="flex flex-col -space-y-7">
              {column.map((card, j) => (
                <MiniCard
                  key={j}
                  suit={card.suit}
                  rank={card.rank}
                  faceUp={card.faceUp}
                  className="h-8 w-6"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (id === 'simple-simon') {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex justify-center gap-1 mb-1">
          {deal.foundations.map((card: any, i: number) => (
            <div
              key={i}
              className="h-8 w-5.5 rounded-[0.5px] border border-gold/10 bg-white/5"
            >
              {card && (
                <MiniCard
                  suit={card.suit}
                  rank={card.rank}
                  faceUp={card.faceUp}
                  className="h-full w-full"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-0.5">
          {deal.tableau.map((column: any[], i: number) => (
            <div key={i} className="flex flex-col -space-y-5.5">
              {column.map((card: any, j: number) => (
                <MiniCard
                  key={j}
                  suit={card.suit}
                  rank={card.rank}
                  faceUp={card.faceUp}
                  className="h-7 w-5"
                />
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
      <div className="flex flex-col items-center -space-y-7.5">
        {deal.pyramid.map((row: any[], i: number) => (
          <div key={i} className="flex gap-0.5">
            {row.map((card, j) => (
              <MiniCard
                key={j}
                suit={card.suit}
                rank={card.rank}
                faceUp={card.faceUp}
                className="h-9 w-6.5"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <MiniCard faceUp={deal.stock.faceUp} className="h-9 w-6.5" />
        {id === 'pyramid-alt' && (
          <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold/10 text-gold shadow-sm">
            <HugeiconsIcon icon={ArrowRight02Icon} className="h-3.5 w-3.5" />
          </div>
        )}
        <MiniCard
          suit={deal.waste.suit}
          rank={deal.waste.rank}
          faceUp={deal.waste.faceUp}
          className="h-9 w-6.5"
        />
      </div>
    </div>
  )
}

import Card from '../Card'
import StockEmptyIndicator from '../StockEmptyIndicator'
import { cn } from '@workspace/ui/lib/utils'

interface SpiderStockProps {
  stockCount: number
  onClick: () => void
  disabled?: boolean
}

export default function SpiderStock({
  stockCount,
  onClick,
  disabled,
}: SpiderStockProps) {
  if (stockCount > 0) {
    const dealsRemaining = Math.floor(stockCount / 10)
    return (
      <div
        className={cn(
          'relative rounded-lg cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0',
          disabled && 'opacity-70 cursor-not-allowed',
        )}
        style={{
          width: 'var(--card-width)',
          height: 'var(--card-height)',
        }}
        onClick={onClick}
        role="button"
        aria-label={`Stock pile, ${stockCount} cards (${dealsRemaining} deals) remaining`}
      >
        <Card suit="spades" rank="A" faceUp={false} />
        <div className="absolute -bottom-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full border border-gold/40 bg-felt-deep px-1.5 text-xs font-bold text-gold shadow-md">
          {dealsRemaining}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: 'var(--card-width)',
        height: 'var(--card-height)',
      }}
    >
      <StockEmptyIndicator canRecycle={false} onClick={onClick} />
    </div>
  )
}

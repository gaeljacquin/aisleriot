import { cn } from '@workspace/ui/lib/utils'
import { CardBackComponent } from './CardPrimitive'

interface StockProps {
  count: number
  onClick: () => void
  disabled?: boolean
}

export default function Stock({ count, onClick, disabled }: StockProps) {
  const isEmpty = count === 0

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled ?? isEmpty}
      aria-label={`Stock pile, ${count} cards remaining`}
      className={cn(
        'group relative flex items-center justify-center rounded-lg transition-all p-0',
        isEmpty
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer hover:shadow-card-lift active:scale-95',
      )}
      style={{
        width: 'var(--card-width, 7rem)',
        height: 'var(--card-height, 10rem)',
      }}
    >
      <CardBackComponent className="group-hover:brightness-110 transition-all" />
    </button>
  )
}

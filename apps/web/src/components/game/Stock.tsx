import { cn } from '@workspace/ui/lib/utils'

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
        'relative flex h-28 w-20 items-center justify-center rounded-lg border border-slate-600',
        'bg-linear-to-br from-slate-700 to-slate-900 transition-opacity',
        isEmpty
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer hover:brightness-110',
      )}
    >
      {/* Diamond pattern */}
      <div className="pointer-events-none absolute inset-0 rounded-lg opacity-20">
        <div className="h-full w-full rounded-lg bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_5px)]" />
      </div>
    </button>
  )
}

import { cn } from '@workspace/ui/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'
import ViewportDebugger from '@/components/ViewportDebugger'

import type { GameStatus } from '#/lib/types'

interface StatProps {
  label: string
  value: string | number
}

function StatBadge({ label, value }: StatProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-felt-deep/50 px-3 py-1 shadow-sm">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-dim">
        {label}
      </span>
      <span className="font-serif text-sm font-bold text-gold">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: GameStatus }) {
  if (status === 'playing' || status === 'idle') return null

  const isWon = status === 'won'

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-card-lift animate-in fade-in zoom-in duration-500',
        isWon
          ? 'border-gold/50 bg-gold/10 text-gold shadow-gold/20'
          : 'border-destructive/50 bg-destructive/10 text-destructive shadow-destructive/20',
      )}
    >
      <span className="font-serif text-sm font-black tracking-widest uppercase">
        {isWon ? 'Victory' : 'Game Over'}
      </span>
    </div>
  )
}

interface TopBarProps {
  title: string
  subtitle?: string
  stats?: StatProps[]
  status?: GameStatus
  className?: string
}

export function TopBar({
  title,
  subtitle,
  stats,
  status,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-gold/10 pb-6',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-3xl font-normal tracking-tight text-slate-950 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-950 dark:text-white/70">
              {subtitle}
            </span>
          )}
        </div>

        {status && <StatusBadge status={status} />}
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <ViewportDebugger />
        {stats && (
          <div className="flex flex-wrap gap-2">
            {stats.map((stat) => (
              <StatBadge key={stat.label} {...stat} />
            ))}
          </div>
        )}
        <div className="h-8 w-px bg-gold/10 hidden sm:block" />
        <ThemeToggle size="sm" />
      </div>
    </header>
  )
}

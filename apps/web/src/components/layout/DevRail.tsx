import { cn } from '@workspace/ui/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'

interface DevAction {
  icon: any
  label: string
  onClick: () => void
  active?: boolean
}

interface DevRailProps {
  actions: DevAction[]
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export function DevRail({
  actions,
  orientation = 'vertical',
  className,
}: DevRailProps) {
  if (import.meta.env.PROD) return null

  return (
    <div
      className={cn(
        'relative flex gap-2 p-1.5 rounded-full border border-rose-950/40 shadow-card-lift overflow-hidden',
        'bg-linear-to-b from-rose-700 to-rose-900 dark:from-rose-800 dark:to-rose-950',
        orientation === 'vertical'
          ? 'flex-col items-center'
          : 'flex-row items-center',
        className,
      )}
    >
      {/* Noise Overlay for skeuomorphic felt effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-image-noise" />

      <div
        className={cn(
          'relative flex gap-2',
          orientation === 'vertical'
            ? 'flex-col items-center'
            : 'flex-row items-center',
        )}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              'group flex items-center justify-center rounded-full border transition-all cursor-pointer',
              'w-10 h-10',
              action.active
                ? 'border-white/40 bg-white/20 shadow-inner'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30',
            )}
            title={action.label}
          >
            <HugeiconsIcon
              icon={action.icon}
              size={18}
              className={cn(
                'transition-transform group-hover:scale-110 group-active:scale-95',
                action.active
                  ? 'text-white'
                  : 'text-rose-200/70 group-hover:text-white',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

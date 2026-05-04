import { cn } from '@workspace/ui/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useLocation } from '@tanstack/react-router'
import { ArrowLeft02Icon, Settings01Icon } from '@hugeicons/core-free-icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'

export interface ActionItem {
  icon: any
  label: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
}

interface ActionRailProps {
  actions: ActionItem[]
  devActions?: ActionItem[]
  orientation?: 'vertical' | 'horizontal'
  className?: string
  showBackLink?: boolean
  showSettingsLink?: boolean
  showDivider?: boolean
}

export function ActionRail({
  actions,
  devActions = [],
  orientation = 'horizontal',
  className,
  showBackLink = true,
  showSettingsLink = true,
  showDivider = true,
}: ActionRailProps) {
  const location = useLocation()
  const isProd = import.meta.env.PROD

  const tooltipSide = orientation === 'vertical' ? 'right' : 'top'

  return (
    <div
      className={cn(
        'relative flex gap-2 p-1.5 rounded-full border border-gold/40 shadow-card-lift overflow-hidden',
        'bg-linear-to-b from-felt-light to-felt-deep dark:from-felt-light/40 dark:to-felt-deep/60',
        'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]',
        orientation === 'vertical'
          ? 'flex-col items-center'
          : 'flex-row items-center',
        className,
      )}
    >
      {/* Noise Overlay for skeuomorphic felt effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-image-noise" />

      <div
        className={cn(
          'relative flex gap-2',
          orientation === 'vertical'
            ? 'flex-col items-center'
            : 'flex-row items-center',
        )}
      >
        {/* Main Actions */}
        {actions.map((action) => {
          // Skip settings if we're showing it as a link at the bottom/end
          if (action.label === 'Settings' && showSettingsLink) return null

          return (
            <Tooltip key={action.label}>
              <TooltipTrigger
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  'group flex items-center justify-center rounded-full border transition-all cursor-pointer',
                  'w-11 h-11',
                  action.active
                    ? 'border-gold/40 bg-gold/20 shadow-inner'
                    : 'border-gold/10 bg-white/5 hover:bg-gold/10 hover:border-gold/40',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                )}
              >
                <HugeiconsIcon
                  icon={action.icon}
                  size={20}
                  className={cn(
                    'transition-all group-hover:scale-105 group-active:scale-95',
                    action.active
                      ? 'text-gold'
                      : 'text-gold/80 group-hover:text-gold',
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side={tooltipSide}>{action.label}</TooltipContent>
            </Tooltip>
          )
        })}

        {/* Dev Actions Separator */}
        {!isProd && devActions.length > 0 && showDivider && (
          <div
            className={cn(
              'bg-gold/20',
              orientation === 'vertical' ? 'h-px w-6 my-1' : 'w-px h-6 mx-1',
            )}
          />
        )}

        {/* Dev Actions */}
        {!isProd &&
          devActions.map((action) => (
            <Tooltip key={action.label}>
              <TooltipTrigger
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  'group flex items-center justify-center rounded-full border transition-all cursor-pointer',
                  'w-11 h-11',
                  action.active
                    ? 'border-gold/40 bg-gold/20 shadow-inner'
                    : 'border-gold/10 bg-white/5 hover:bg-gold/10 hover:border-gold/40',
                  'disabled:opacity-30 disabled:cursor-not-allowed',
                )}
              >
                <HugeiconsIcon
                  icon={action.icon}
                  size={20}
                  className={cn(
                    'transition-all group-hover:scale-105 group-active:scale-95',
                    action.active
                      ? 'text-gold'
                      : 'text-gold/80 group-hover:text-gold',
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side={tooltipSide}>{action.label}</TooltipContent>
            </Tooltip>
          ))}

        {/* Links Separator */}
        {(showSettingsLink || showBackLink) && showDivider && (
          <div
            className={cn(
              'bg-gold/20',
              orientation === 'vertical' ? 'h-px w-6 my-1' : 'w-px h-6 mx-1',
            )}
          />
        )}

        {/* Settings Link */}
        {showSettingsLink && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  to="/settings"
                  search={{ returnTo: location.pathname }}
                  className={cn(
                    'group flex items-center justify-center rounded-full border border-gold/20 bg-felt-deep/30 transition-all hover:bg-gold/10 hover:border-gold hover:shadow-sm cursor-pointer',
                    'w-11 h-11',
                  )}
                />
              }
            >
              <HugeiconsIcon
                icon={Settings01Icon}
                size={20}
                className="text-gold transition-transform group-hover:rotate-45"
              />
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>Settings</TooltipContent>
          </Tooltip>
        )}

        {/* Game Menu Backlink */}
        {showBackLink && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  to="/new-game"
                  className={cn(
                    'group flex items-center justify-center rounded-full border border-gold/20 bg-felt-deep/30 transition-all hover:bg-gold/10 hover:border-gold hover:shadow-sm cursor-pointer',
                    'w-11 h-11',
                  )}
                />
              }
            >
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                size={20}
                className="text-gold transition-transform group-hover:-translate-x-0.5"
              />
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>Game Menu</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

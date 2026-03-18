import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'

interface BackLinkProps {
  label?: string
  destination?: string
  textColor?: string
}

export default function BackLink({ label = 'Main Menu', destination = '/', textColor }: BackLinkProps) {
  return (
    <Link
      to={destination}
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium no-underline transition-colors',
        textColor ?? 'text-muted-foreground hover:text-foreground',
      )}
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
      {label}
    </Link>
  )
}

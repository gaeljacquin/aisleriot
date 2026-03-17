import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'

interface BackLinkProps {
  label?: string
}

export default function BackLink({ label = 'Return to Main Menu' }: BackLinkProps) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
      {label}
    </Link>
  )
}

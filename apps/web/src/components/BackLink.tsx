import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'

interface BackLinkProps {
  label?: string
  destination?: string
  variant?: 'subtle' | 'button' | 'compact'
}

export default function BackLink({
  label = 'Main Menu',
  destination = '/',
  variant = 'button',
}: BackLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'subtle') {
    return (
      <Link
        to={destination}
        className="inline-flex items-center gap-2 text-sm font-medium text-cream-dim no-underline transition-colors hover:text-gold"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
        <span className="font-serif">{label}</span>
      </Link>
    )
  }

  const isCompact = variant === 'compact'

  return (
    <Link
      to={destination}
      className={cn(
        'group relative flex items-center justify-center gap-3 rounded-xl border border-gold/40 bg-felt-light/40 font-serif no-underline transition-all hover:border-gold hover:shadow-card-lift',
        isCompact
          ? 'px-4 py-2 text-sm font-medium'
          : 'w-48 py-4 text-base font-bold text-cream',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        animate={isHovered ? { x: [0, -4, 0] } : { x: 0 }}
        transition={{
          duration: 0.6,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className="flex items-center text-gold"
      >
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          className={cn(isCompact ? 'size-4' : 'size-5')}
        />
      </motion.span>
      <span
        className={cn(
          isCompact ? 'text-cream-dim group-hover:text-cream' : 'text-cream',
        )}
      >
        {label}
      </span>
    </Link>
  )
}

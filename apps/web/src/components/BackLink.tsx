import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'

interface BackLinkProps {
  label?: string
  destination?: string
  textColor?: string
}

export default function BackLink({
  label = 'Main Menu',
  destination = '/',
  textColor,
}: BackLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  // If textColor is provided, use the old subtle style (for game pages)
  if (textColor) {
    return (
      <Link
        to={destination}
        className={cn(
          'inline-flex items-center gap-2 text-sm font-medium no-underline transition-colors',
          textColor,
        )}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
        <span className="font-serif">{label}</span>
      </Link>
    )
  }

  // Otherwise, use the new high-fidelity style (for non-game pages)
  return (
    <Link
      to={destination}
      className="group relative flex w-48 items-center justify-center gap-4 rounded-xl border border-gold/40 bg-felt-light/40 py-4 text-base font-bold text-cream no-underline transition-all hover:border-gold hover:shadow-card-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        animate={isHovered ? { x: [0, -6, 0] } : { x: 0 }}
        transition={{
          duration: 0.6,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className="flex items-center text-gold"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className="size-5" />
      </motion.span>
      <span className="font-serif">{label}</span>
    </Link>
  )
}

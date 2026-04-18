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
        {label}
      </Link>
    )
  }

  // Otherwise, use the new Red Button style (for non-game pages)
  return (
    <Link
      to={destination}
      className="flex w-44 items-center justify-center gap-4 rounded py-3.5 text-base font-bold text-white no-underline transition-colors bg-[#DC143C] hover:bg-[#B21031]"
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
        className="flex items-center"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} className="size-5" />
      </motion.span>
      {label}
    </Link>
  )
}

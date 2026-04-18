import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import type { TargetAndTransition } from 'motion/react'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import {
  ArrowDown02Icon,
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  ArrowUpLeft01Icon,
} from '@hugeicons/core-free-icons'
import { appInfo } from '@workspace/constants'

export const Route = createFileRoute('/')({ component: Home })

const transition = {
  duration: 0.6,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

const menuItems: {
  label: string
  arrow: IconSvgElement
  bg: string
  to: string
  hovered: TargetAndTransition
  external: boolean
}[] = [
  {
    label: 'New Game',
    arrow: ArrowRight02Icon,
    bg: 'bg-primary',
    to: '/new-game',
    hovered: { x: [0, 10, 0], transition },
    external: false,
  },
  {
    label: 'How to Play',
    arrow: ArrowDownRight01Icon,
    bg: 'bg-pink-500',
    to: '/how-to-play',
    hovered: { x: [0, 10, 0], y: [0, 10, 0], transition },
    external: false,
  },
  {
    label: 'Settings',
    arrow: ArrowUpRight01Icon,
    bg: 'bg-orange-500',
    to: '/settings',
    hovered: { x: [0, 10, 0], y: [0, -10, 0], transition },
    external: false,
  },
  {
    label: 'Credits',
    arrow: ArrowDown02Icon,
    bg: 'bg-indigo-500',
    to: '/credits',
    hovered: { y: [0, 10, 0], transition },
    external: false,
  },
  {
    label: 'More Games',
    arrow: ArrowUpLeft01Icon,
    bg: 'bg-[#DC143C]',
    to: 'https://tr.ee/uBF_3IDko-',
    hovered: { x: [0, -10, 0], y: [0, -10, 0], transition },
    external: true,
  },
]

function MenuItem({
  label,
  arrow,
  bg,
  to,
  external,
  hovered,
}: (typeof menuItems)[number]) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      className="flex items-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="inline-block w-6 text-center text-base font-medium text-foreground"
        animate={isHovered ? hovered : { x: 0, y: 0 }}
      >
        <HugeiconsIcon icon={arrow} />
      </motion.span>
      <Link
        to={to}
        className={`flex w-44 items-center justify-center rounded py-3.5 text-base font-bold text-white no-underline hover:text-white ${bg}`}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {label}
      </Link>
    </motion.div>
  )
}

function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <img
        src="/logo.png"
        alt={appInfo.title}
        className="mb-14 w-60 rounded-xl object-contain dark:hidden"
      />
      <img
        src="/logo-dark.png"
        alt={appInfo.title}
        className="mb-14 hidden w-60 rounded-xl object-contain dark:block"
      />

      <div className="flex flex-col gap-6">
        {menuItems.map((item) => (
          <MenuItem key={item.label} {...item} />
        ))}
      </div>
    </main>
  )
}

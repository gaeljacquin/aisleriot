import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CheckmarkCircle02Icon,
  Loading03Icon,
  HelpCircleIcon,
  Download04Icon,
} from '@hugeicons/core-free-icons'
import { cn } from '@workspace/ui/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { toast } from '@workspace/ui/components/sonner'
import BackLink from '@/components/BackLink'
import { ConfirmModal } from '@/components/ConfirmModal'
import { useDevModeStore } from '@/stores/dev-mode'
import NotFound from '@/components/NotFound'

export const Route = createFileRoute('/bonus-content')({
  component: BonusContent,
})

type DLCStatus = 'idle' | 'downloading' | 'installed'

interface DLCPack {
  id: number
  name: string
  includedGames: string[]
  comingSoon?: boolean
  isDev?: boolean
}

const DLC_PACKS: DLCPack[] = [
  {
    id: 1,
    name: 'DLC Pack 1',
    includedGames: [
      'Beleaguered Castle',
      'Bakers Game',
      'Aunt Mary',
      'East Haven',
      'Eagle Wing',
    ],
  },
  {
    id: 2,
    name: 'DLC Pack 2',
    includedGames: [
      'West Haven',
      'Hopscotch',
      'Eight Off',
      'Thumb And Pouch',
      'Labyrinth',
      'Will O The Wisp',
    ],
  },
  {
    id: 3,
    name: 'DLC Pack 3',
    includedGames: [
      'Spider',
      'Klondike Three Decks',
      'Spider Three Decks',
      'Sea Haven Towers',
      'Helsinki',
    ],
    comingSoon: true,
  },
  {
    id: 0,
    name: 'DLC Pack 0',
    includedGames: ['Crazy 8s', 'Speed', 'War', 'Bridge'],
    isDev: true,
  },
]

function BonusContent() {
  const { isDevMode } = useDevModeStore()
  const [statuses, setStatuses] = useState<Record<number, DLCStatus>>({})
  const [confirmingPack, setConfirmingPack] = useState<DLCPack | null>(null)

  const isVercelPreview =
    typeof process !== 'undefined' && process.env.VERCEL_ENV === 'preview'
  const isDev = import.meta.env.DEV || isDevMode || isVercelPreview

  if (!isDev) {
    return <NotFound />
  }

  const handleDownload = (pack: DLCPack) => {
    if (
      pack.comingSoon ||
      statuses[pack.id] === 'installed' ||
      statuses[pack.id] === 'downloading'
    ) {
      return
    }
    setConfirmingPack(pack)
  }

  const startDownload = (pack: DLCPack) => {
    setStatuses((prev) => ({ ...prev, [pack.id]: 'downloading' }))

    if (pack.id === 0) {
      setTimeout(() => {
        toast.error(`Failed to download ${pack.name}`, {
          description: 'A network error occurred. Please try again later.',
        })
        setStatuses((prev) => ({ ...prev, [pack.id]: 'idle' }))
      }, 5000)
      return
    }

    setTimeout(() => {
      toast.success(`${pack.name} is now available!`, {
        description: 'Enjoy!',
      })
      setStatuses((prev) => ({ ...prev, [pack.id]: 'installed' }))
    }, 5000)
  }

  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-6 py-12 sm:py-15">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--color-felt-shadow)/0.7)]"
      />

      <div className="mx-auto w-full max-w-xl lg:max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
            Bonus Content
          </h1>
        </header>

        <div className="grid gap-4 md:grid-cols-2 w-full max-w-4xl mx-auto">
          {DLC_PACKS.map((pack) => {
            const status = statuses[pack.id]
            const isDownloading = status === 'downloading'
            const isInstalled = status === 'installed'
            const isDisabled = pack.comingSoon || isDownloading || isInstalled

            return (
              <div
                key={pack.id}
                className={cn(
                  'group relative flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 text-left h-full overflow-hidden',
                  pack.comingSoon
                    ? 'border-gold/30 bg-felt-dark/80 shadow-glow-gold/10 opacity-85'
                    : isInstalled
                      ? 'border-gold/60 bg-gold/10 shadow-glow-gold/10'
                      : isDownloading
                        ? 'border-gold/20 bg-felt-light/20'
                        : 'border-gold/30 bg-felt-light/40 hover:border-gold/60 hover:shadow-card-lift',
                )}
              >
                <div className="flex w-full items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3
                      className={cn(
                        'font-serif text-xl font-bold',
                        isInstalled ? 'text-gold' : 'text-cream',
                      )}
                    >
                      {pack.name}
                    </h3>
                    {pack.isDev && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-400 border border-red-500/30">
                        Dev Only
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl border shrink-0',
                      isInstalled
                        ? 'border-gold/40 bg-gold/20 text-gold'
                        : pack.comingSoon
                          ? 'border-gold/20 bg-felt-deep/40 text-gold/70 group-hover:text-gold group-hover:border-gold/40 opacity-50'
                          : 'border-gold/20 bg-felt-deep/40 text-gold/70 group-hover:text-gold group-hover:border-gold/40',
                    )}
                  >
                    {isInstalled ? (
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        className="h-5 w-5"
                        strokeWidth={2}
                      />
                    ) : isDownloading ? (
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        className="h-5 w-5 animate-spin"
                        strokeWidth={2}
                      />
                    ) : pack.comingSoon ? (
                      <HugeiconsIcon
                        icon={HelpCircleIcon}
                        className="h-5 w-5"
                        strokeWidth={1.5}
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={Download04Icon}
                        className="h-5 w-5"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full" />

                <div className="grid grid-cols-2 gap-2 w-full mt-auto">
                  <Dialog>
                    <DialogTrigger
                      render={
                        <button
                          disabled={pack.comingSoon}
                          className={cn(
                            'h-12 w-full rounded-xl border font-serif font-bold transition-all text-center text-sm truncate px-1 outline-none',
                            pack.comingSoon
                              ? 'border-gold/30 bg-felt-light/40 text-cream-dim hover:border-gold/60 hover:text-cream opacity-50 cursor-not-allowed'
                              : 'border-gold/30 bg-felt-light/40 text-cream-dim hover:border-gold/60 hover:text-cream cursor-pointer',
                          )}
                        >
                          {pack.comingSoon ? '???' : 'Content'}
                        </button>
                      }
                    />
                    <DialogContent className="border border-gold/40 bg-felt-deep/95 p-8 shadow-card-lift backdrop-blur-md">
                      <DialogHeader className="mb-2">
                        <DialogTitle className="font-serif text-2xl font-bold text-gold">
                          {pack.name}
                        </DialogTitle>
                        <DialogDescription className="font-serif text-sm text-gold/60 uppercase tracking-widest mt-1">
                          What's included
                        </DialogDescription>
                      </DialogHeader>
                      <ul className="space-y-3 font-serif text-cream-dim">
                        {pack.includedGames.map((game) => (
                          <li key={game} className="flex items-center gap-3">
                            <div className="size-1.5 rounded-full bg-gold/40" />
                            {game}
                          </li>
                        ))}
                      </ul>
                    </DialogContent>
                  </Dialog>

                  <button
                    disabled={isDisabled}
                    onClick={() => handleDownload(pack)}
                    className={cn(
                      'h-12 w-full rounded-xl border font-serif font-bold transition-all flex items-center justify-center text-center text-sm px-1',
                      isInstalled
                        ? 'border-gold/40 bg-gold/10 text-gold cursor-default'
                        : isDownloading
                          ? 'border-gold/20 bg-felt-light/40 text-gold/50 cursor-wait'
                          : pack.comingSoon
                            ? 'border-gold/40 bg-gold text-felt-deep opacity-50 cursor-not-allowed'
                            : 'border-gold/40 bg-gold text-felt-deep hover:bg-gold-soft cursor-pointer shadow-sm hover:shadow-card',
                    )}
                  >
                    <span className="truncate">
                      {isInstalled
                        ? 'Available'
                        : isDownloading
                          ? 'Downloading...'
                          : pack.comingSoon
                            ? 'Coming soon'
                            : 'Download'}
                    </span>
                  </button>
                </div>

                {isDownloading && (
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-felt-deep/40 overflow-hidden">
                    <div className="h-full bg-gold animate-[progress_5s_linear_forwards]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <BackLink />
        </motion.div>
      </div>

      <ConfirmModal
        open={confirmingPack !== null}
        onOpenChange={(open) => !open && setConfirmingPack(null)}
        title={confirmingPack?.name ?? ''}
        description={`Would you like to download ${confirmingPack?.name}?`}
        confirmLabel="Confirm"
        onConfirm={() => {
          if (confirmingPack) {
            startDownload(confirmingPack)
          }
        }}
      />

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </main>
  )
}

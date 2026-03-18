import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { KlondikeBoard } from '@/components/game/klondike'

export const Route = createFileRoute('/klondike-draw-1')({ component: SolitaireDraw1 })

function SolitaireDraw1() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 py-10">
      <div className="relative mb-6 flex items-center">
        <BackLink label="Game Menu" destination="/new-game" textColor="text-primary-foreground/70 hover:text-primary-foreground" />
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-rose-100 px-4 py-1 text-2xl font-bold text-rose-900 dark:bg-rose-950 dark:text-rose-100">
          Klondike (Draw 1)
        </h1>
      </div>

      <div className="flex flex-1 flex-col">
        <KlondikeBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <HowToPlayModal
        variant={getVariant('klondike-draw-1')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

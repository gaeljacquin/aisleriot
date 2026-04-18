import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { KlondikeDraw3Board } from '@/components/game/klondike'

export const Route = createFileRoute('/klondike-draw-3')({
  component: SolitaireDraw3,
})

function SolitaireDraw3() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 py-10">
      <div className="relative mb-9 flex items-center">
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-rose-100 px-4 py-1 text-2xl font-bold text-rose-900 dark:bg-rose-950 dark:text-rose-100">
          Klondike (Draw 3)
        </h1>
      </div>

      <div className="flex flex-1 flex-col">
        <KlondikeDraw3Board onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <div className="mt-12 flex justify-center">
        <BackLink label="Game Menu" destination="/new-game" />
      </div>

      <HowToPlayModal
        variant={getVariant('klondike-draw-3')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

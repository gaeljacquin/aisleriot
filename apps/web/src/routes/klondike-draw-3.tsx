import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { KlondikeDraw3Board } from '@/components/game/klondike'

export const Route = createFileRoute('/klondike-draw-3')({ component: SolitaireDraw3 })

function SolitaireDraw3() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 py-10">
      <div className="relative mb-6 flex items-center">
        <BackLink label="Game Menu" destination="/new-game" />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-foreground">
          Klondike (Draw 3)
        </h1>
      </div>

      <div className="flex flex-1 flex-col">
        <KlondikeDraw3Board onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <HowToPlayModal
        variant={getVariant('klondike-draw-3')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

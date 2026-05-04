import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { KlondikeDraw3Board } from '@/components/game/klondike'

export const Route = createFileRoute('/klondike-draw-3')({
  component: SolitaireDraw3,
})

function SolitaireDraw3() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <KlondikeDraw3Board onHowToPlay={() => setHowToPlayOpen(true)} />

      <HowToPlayModal
        variant={getVariant('klondike-draw-3')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { KlondikeBoard } from '@/components/game/klondike'

export const Route = createFileRoute('/klondike-draw-1')({
  component: SolitaireDraw1,
})

function SolitaireDraw1() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <KlondikeBoard onHowToPlay={() => setHowToPlayOpen(true)} />

      <HowToPlayModal
        variant={getVariant('klondike-draw-1')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

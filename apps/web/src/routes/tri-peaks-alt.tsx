import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { TriPeaksAltBoard } from '@/components/game/tri-peaks'

export const Route = createFileRoute('/tri-peaks-alt')({ component: TriPeaksAlt })

function TriPeaksAlt() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col px-6 py-10">
      <div className="mb-6">
        <BackLink label="New Game" destination="/new-game" />
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Tri Peaks Alt</h1>
      </div>

      <div className="flex flex-1 flex-col">
        <TriPeaksAltBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <HowToPlayModal
        variant={getVariant('tri-peaks-alt')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

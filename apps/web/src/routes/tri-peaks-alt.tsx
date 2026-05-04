import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { TriPeaksAltBoard } from '@/components/game/tri-peaks'

export const Route = createFileRoute('/tri-peaks-alt')({
  component: TriPeaksAlt,
})

function TriPeaksAlt() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <TriPeaksAltBoard onHowToPlay={() => setHowToPlayOpen(true)} />

      <HowToPlayModal
        variant={getVariant('tri-peaks-alt')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { TriPeaksAltBoard } from '@/components/game/tri-peaks'

export const Route = createFileRoute('/tri-peaks-alt')({
  component: TriPeaksAlt,
})

function TriPeaksAlt() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 py-10">
      <div className="relative mb-9 flex items-center">
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-emerald-100 px-4 py-1 text-2xl font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          Tri Peaks Alt
        </h1>
      </div>

      <div className="flex flex-1 flex-col">
        <TriPeaksAltBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <div className="mt-12 flex justify-center">
        <BackLink label="Game Menu" destination="/new-game" />
      </div>

      <HowToPlayModal
        variant={getVariant('tri-peaks-alt')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

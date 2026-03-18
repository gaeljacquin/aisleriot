import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { PyramidAltBoard } from '@/components/game/pyramid'

export const Route = createFileRoute('/pyramid-alt')({ component: PyramidAlt })

function PyramidAlt() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 py-10">
      <div className="relative mb-6 flex items-center">
        <BackLink label="Game Menu" destination="/new-game" />
        <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-foreground">Pyramid Alt</h1>
      </div>

      <div className="flex flex-1 flex-col">
        <PyramidAltBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <HowToPlayModal
        variant={getVariant('pyramid-alt')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

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
        <BackLink label="Game Menu" destination="/new-game" textColor="text-primary-foreground/70 hover:text-primary-foreground" />
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-pink-100 px-4 py-1 text-2xl font-bold text-pink-900 dark:bg-pink-950 dark:text-pink-100">Pyramid Alt</h1>
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

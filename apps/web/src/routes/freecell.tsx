import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { FreeCellBoard } from '@/components/game/freecell'

export const Route = createFileRoute('/freecell')({ component: FreeCell })

function FreeCell() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 py-10">
      <div className="relative mb-6 flex items-center">
        <BackLink label="Game Menu" destination="/new-game" textColor="text-primary-foreground/70 hover:text-primary-foreground" />
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-orange-100 px-4 py-1 text-2xl font-bold text-orange-900 dark:bg-orange-950 dark:text-orange-100">
          FreeCell
        </h1>
      </div>

      <div className="flex flex-1 flex-col">
        <FreeCellBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <HowToPlayModal
        variant={getVariant('freecell')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
// import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { FreeCellBoard } from '@/components/game/freecell'

export const Route = createFileRoute('/freecell')({ component: FreeCell })

function FreeCell() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 pb-10 pt-16">
      {/* <div className="relative mb-14 flex items-center">
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-indigo-100 px-4 py-1 text-2xl font-bold text-indigo-900 dark:bg-indigo-950 dark:text-indigo-100">
          FreeCell
        </h1>
      </div> */}

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

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
// import BackLink from '@/components/BackLink'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { PyramidBoard } from '@/components/game/pyramid'

export const Route = createFileRoute('/pyramid')({ component: Pyramid })

function Pyramid() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-full flex-col bg-primary px-6 pb-10 pt-16">
      {/* <div className="relative mb-14 flex items-center">
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-red-100 px-4 py-1 text-2xl font-bold text-red-900 dark:bg-red-950 dark:text-red-100">
          Pyramid
        </h1>
      </div> */}

      <div className="flex flex-1 flex-col">
        <PyramidBoard onHowToPlay={() => setHowToPlayOpen(true)} />
      </div>

      <HowToPlayModal
        variant={getVariant('pyramid')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

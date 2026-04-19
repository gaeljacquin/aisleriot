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
    <main className="flex h-full flex-col bg-primary px-6 pb-10 pt-16">
      <div className="relative mb-14 flex items-center">
        <h1 className="absolute left-1/2 -translate-x-1/2 rounded-lg bg-sky-100 px-4 py-1 text-2xl font-bold text-sky-900 dark:bg-sky-950 dark:text-sky-100">
          Pyramid Alt
        </h1>
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

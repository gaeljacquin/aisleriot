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
    <main className="flex h-screen flex-col overflow-hidden">
      <PyramidBoard onHowToPlay={() => setHowToPlayOpen(true)} />

      <HowToPlayModal
        variant={getVariant('pyramid')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

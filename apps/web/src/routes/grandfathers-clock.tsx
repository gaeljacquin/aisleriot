import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import { GrandfathersClockBoard } from '@/components/game/grandfathers-clock'

export const Route = createFileRoute('/grandfathers-clock')({
  component: GrandfathersClockPage,
})

function GrandfathersClockPage() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <GrandfathersClockBoard onHowToPlay={() => setHowToPlayOpen(true)} />

      <HowToPlayModal
        variant={getVariant('grandfathers-clock')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

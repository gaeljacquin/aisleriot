import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getVariant } from '@workspace/constants'
import { HowToPlayModal } from '@/components/HowToPlayModal'
import SpiderBoard from '@/components/game/spider/SpiderBoard'

export const Route = createFileRoute('/spider')({
  component: Spider,
})

function Spider() {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false)

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <SpiderBoard onHowToPlay={() => setHowToPlayOpen(true)} />

      <HowToPlayModal
        variant={getVariant('spider')}
        open={howToPlayOpen}
        onOpenChange={setHowToPlayOpen}
      />
    </main>
  )
}

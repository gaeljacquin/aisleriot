import { createFileRoute } from '@tanstack/react-router'
import BackLink from '@/components/BackLink'

export const Route = createFileRoute('/freecell')({ component: FreeCell })

function FreeCell() {
  return (
    <main className="flex h-full flex-col px-6 py-10">
      <div className="mb-10">
        <BackLink label='New Game' destination='/new-game' />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <h1 className="text-3xl font-bold text-foreground">FreeCell</h1>
        <p className="text-sm text-muted-foreground">Coming Soon</p>
      </div>
    </main>
  )
}

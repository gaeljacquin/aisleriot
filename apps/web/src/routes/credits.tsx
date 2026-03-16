import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/credits')({ component: Credits })

function Credits() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white gap-6">
      <h1 className="text-2xl font-bold">Credits</h1>
      <Link to="/" className="text-sm text-blue-500 no-underline hover:underline">
        ← Back
      </Link>
    </main>
  )
}

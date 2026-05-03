import { createFileRoute } from '@tanstack/react-router'
import BackLink from '@/components/BackLink'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-6 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
            About Aisleriot
          </h1>
          <p className="mt-3 font-serif text-sm text-cream-dim">
            A small starter with room to grow.
          </p>
        </header>

        <section className="space-y-6 rounded-2xl border border-gold/10 bg-felt-deep/40 p-8 shadow-card">
          <p className="font-serif text-lg leading-relaxed text-cream">
            Aisleriot is a high-fidelity solitaire collection built for the
            modern web. It combines classic gameplay with a refined, tactile
            aesthetic inspired by traditional gaming tables.
          </p>
          <p className="font-serif text-base leading-relaxed text-cream-dim">
            Built using TanStack Start, React, and Tailwind CSS, it offers
            type-safe routing, seamless state management, and an immersive,
            responsive experience across all devices.
          </p>
        </section>

        <div className="mt-20 flex justify-center">
          <BackLink />
        </div>
      </div>
    </main>
  )
}

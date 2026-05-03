import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { appInfo } from '@workspace/constants'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import BackLink from '@/components/BackLink'

export const Route = createFileRoute('/credits')({ component: Credits })

function Credits() {
  return (
    <main className="relative flex min-h-full flex-col overflow-y-auto px-6 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <header className="mb-16 text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-gold sm:text-5xl">
              Credits
            </h1>
          </header>

          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col items-center space-y-4 rounded-2xl border border-gold/10 bg-felt-deep/40 p-6 transition-all hover:border-gold/30">
                <Avatar className="size-24 border-2 border-gold/20 shadow-card">
                  <AvatarImage src="/gael-himself.webp" />
                  <AvatarFallback className="bg-felt-light font-serif text-gold">
                    GJ
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h4 className="font-serif text-lg font-medium text-cream">
                    Developer
                  </h4>
                  <p className="font-serif text-sm text-cream-dim">
                    {appInfo.author}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4 rounded-2xl border border-gold/10 bg-felt-deep/40 p-6 transition-all hover:border-gold/30">
                <Avatar className="size-24 border-2 border-gold/20 shadow-card">
                  <AvatarImage src="/fireworks.webp" />
                  <AvatarFallback className="bg-felt-light font-serif text-gold">
                    ♥
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h4 className="font-serif text-lg font-medium text-cream">
                    Testers
                  </h4>
                  <p className="font-serif text-sm text-cream-dim">
                    Friends & Family
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-linear-to-r from-transparent via-gold/30 to-transparent" />

            <p className="text-center font-serif text-base italic text-cream-dim">
              Thank you for playing!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <BackLink />
        </motion.div>
      </div>
    </main>
  )
}

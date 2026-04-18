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
    <div className="flex min-h-full flex-col p-8">
      <div className="flex flex-1 flex-col items-center justify-center pb-24 overflow-auto">
        <motion.div
          className="mx-auto max-w-4xl space-y-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="mb-12 text-center text-4xl font-black text-foreground md:text-6xl">
            Credits
          </h1>

          <div className="space-y-12 text-foreground">
            <div className="flex flex-col items-center justify-center gap-12 md:flex-row md:gap-16">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="size-20">
                  <AvatarImage src="/gael-himself.webp" />
                  <AvatarFallback>GJ</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Developer</h4>
                  <p className="text-muted-foreground">{appInfo.author}</p>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <Avatar className="size-20">
                  <AvatarImage src="/fireworks.webp" />
                  <AvatarFallback>♥</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h4 className="text-lg font-semibold">Testers</h4>
                  <p className="text-muted-foreground">Friends &amp; Family</p>
                </div>
              </div>
            </div>

            <p className="text-center text-md text-foreground">
              Thank you for playing!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-14"
        >
          <BackLink />
        </motion.div>
      </div>
    </div>
  )
}

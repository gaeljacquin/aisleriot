import { Skeleton } from '@workspace/ui/components/skeleton'
import { cn } from '@workspace/ui/lib/utils'

interface VariantCardSkeletonProps {
  className?: string
}

export function VariantCardSkeleton({ className }: VariantCardSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 rounded-2xl border border-gold/10 bg-felt-light/20 p-6 shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 bg-gold/10" />
        </div>
      </div>

      <div className="flex h-48 items-center justify-center rounded-md border border-gold/5 bg-felt-deep/30 p-3">
        <Skeleton className="h-32 w-full max-w-40 bg-gold/5" />
      </div>

      <div className="h-px w-full bg-gold/10" />

      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2 text-center">
            <Skeleton className="mx-auto h-2 w-10 bg-gold/5" />
            <Skeleton className="mx-auto h-4 w-8 bg-gold/10" />
          </div>
        ))}
      </div>
    </div>
  )
}

import type { GameVariant } from '@workspace/constants'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'

interface HowToPlayModalProps {
  variant: GameVariant | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HowToPlayModal({
  variant,
  open,
  onOpenChange,
}: HowToPlayModalProps) {
  if (!variant) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[500px] border border-gold/40 bg-felt-deep/95 p-8 shadow-card-lift backdrop-blur-md"
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="font-serif text-3xl font-bold tracking-tight text-gold">
            {variant.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-cream-dim">
              How to Play
            </h3>
            <ol className="space-y-4 pl-4 font-serif">
              {variant.rules.map((rule, i) => (
                <li
                  key={i}
                  className="list-decimal text-sm/relaxed text-cream marker:text-gold marker:font-bold"
                >
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <DialogFooter className="mt-8">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full h-12 rounded-xl border border-gold/40 bg-gold font-serif font-bold text-felt-deep shadow-sm transition-all hover:bg-gold-soft hover:shadow-card cursor-pointer"
          >
            OK
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

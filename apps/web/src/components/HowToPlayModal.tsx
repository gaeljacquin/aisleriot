import type { GameVariant } from '@workspace/constants'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-bold text-gold">
            {variant?.name}
          </DialogTitle>
          <DialogDescription className="font-serif text-cream-dim">
            {variant?.description}
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-4 pl-4 pt-1 font-serif">
          {variant?.rules.map((rule, i) => (
            <li key={i} className="list-decimal text-sm/relaxed text-cream">
              {rule}
            </li>
          ))}
        </ol>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

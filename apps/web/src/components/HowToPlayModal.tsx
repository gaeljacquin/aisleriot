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
          <DialogTitle>{variant?.name}</DialogTitle>
          <DialogDescription>{variant?.description}</DialogDescription>
        </DialogHeader>
        <ol className="space-y-3 pl-4 pt-1">
          {variant?.rules.map((rule, i) => (
            <li
              key={i}
              className="list-decimal text-sm/relaxed text-foreground"
            >
              {rule}
            </li>
          ))}
        </ol>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}

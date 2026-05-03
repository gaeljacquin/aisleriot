import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmModalProps) {
  function handleConfirm() {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[400px] border border-gold/40 bg-felt-deep/95 p-8 shadow-card-lift backdrop-blur-md"
      >
        <DialogHeader className="mb-6 text-center">
          <DialogTitle className="font-serif text-3xl font-bold tracking-tight text-gold">
            {title}
          </DialogTitle>
          <DialogDescription className="font-serif text-base text-cream-dim">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-center gap-4 sm:justify-center">
          <DialogClose
            render={
              <button className="h-12 flex-1 rounded-xl border border-gold/20 bg-felt-light/40 font-serif font-bold text-cream-dim transition-all hover:bg-gold/10 hover:text-gold cursor-pointer" />
            }
          >
            Cancel
          </DialogClose>
          <button
            onClick={handleConfirm}
            className="h-12 flex-1 rounded-xl border border-gold/40 bg-gold font-serif font-bold text-felt-deep shadow-sm transition-all hover:bg-gold-soft hover:shadow-card cursor-pointer"
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

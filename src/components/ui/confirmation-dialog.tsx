import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ConfirmationDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isConfirming?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  isConfirming = false,
  onOpenChange,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="px-6 py-6 md:px-7">
          <DialogHeader className="px-0 pt-0">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="max-w-lg">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isConfirming}
            >
              {cancelLabel}
            </Button>
            <Button
              className="border border-rose-400/20 bg-rose-500/12 text-rose-300 shadow-[0_18px_35px_-22px_rgba(244,63,94,0.28)] hover:bg-rose-500/18 hover:text-rose-500"
              onClick={() => void onConfirm()}
              disabled={isConfirming}
            >
              {isConfirming ? 'Excluindo...' : confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

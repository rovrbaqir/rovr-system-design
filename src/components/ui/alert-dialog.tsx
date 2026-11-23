import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A question naming the action: "Delete this note?" */
  title: string;
  /** What will be lost and whether it can be undone. */
  description: React.ReactNode;
  /** The verb from the title: "Delete note". Never "OK" or "Yes". */
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ButtonProps["variant"];
  onConfirm: () => void | Promise<void>;
}

/** A blocking confirmation for an action that cannot be undone. It does not close on outside click. */
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, cancelLabel = "Cancel", variant = "destructive-solid", onConfirm }: ConfirmDialogProps) {
  const [pending, setPending] = React.useState(false);
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="rovr-backdrop fixed inset-0 z-50" />
        <BaseAlertDialog.Popup
          className={cn(
            "rovr-dialog fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-5 rounded-2xl rovr-chrome p-6 text-popover-foreground outline-none",
          )}
        >
          <div className="flex flex-col gap-1.5">
            <BaseAlertDialog.Title className="text-display-sm">{title}</BaseAlertDialog.Title>
            <BaseAlertDialog.Description className="text-body text-muted-foreground">{description}</BaseAlertDialog.Description>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <BaseAlertDialog.Close render={<Button variant="secondary">{cancelLabel}</Button>} />
            <Button
              variant={variant}
              loading={pending}
              onClick={async () => {
                setPending(true);
                try {
                  await onConfirm();
                  onOpenChange(false);
                } finally {
                  setPending(false);
                }
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export function DialogContent({
  className,
  children,
  size = "md",
  hideClose,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup> & { size?: "sm" | "md" | "lg"; hideClose?: boolean }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="rovr-backdrop fixed inset-0 z-50" />
      <BaseDialog.Popup
        className={cn(
          "rovr-dialog fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col gap-5 overflow-y-auto",
          "rounded-2xl rovr-chrome p-6 text-popover-foreground outline-none",
          { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[size],
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <BaseDialog.Close
            aria-label="Close"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "absolute top-4 right-4 text-muted-foreground")}
          >
            <X />
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof BaseDialog.Title>) {
  return <BaseDialog.Title className={cn("text-display-sm", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof BaseDialog.Description>) {
  return <BaseDialog.Description className={cn("text-body text-muted-foreground", className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

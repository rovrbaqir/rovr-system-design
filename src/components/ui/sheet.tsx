import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export const Sheet = BaseDialog.Root;
export const SheetTrigger = BaseDialog.Trigger;
export const SheetClose = BaseDialog.Close;

/** A panel that slides in from an edge. Use for detail views and filters that keep the page in context. */
export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup> & { side?: "right" | "left" | "bottom" }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="rovr-backdrop fixed inset-0 z-50" />
      <BaseDialog.Popup
        className={cn(
          "fixed z-50 flex flex-col gap-5 overflow-y-auto border-border rovr-chrome p-6 text-popover-foreground outline-none",
          "rovr-sheet",
          side === "right" &&
            "inset-y-2 right-2 w-[min(28rem,calc(100vw-1rem))] rounded-2xl border data-[starting-style]:translate-x-[calc(100%+1rem)] data-[ending-style]:translate-x-[calc(100%+1rem)]",
          side === "left" &&
            "inset-y-2 left-2 w-[min(28rem,calc(100vw-1rem))] rounded-2xl border data-[starting-style]:-translate-x-[calc(100%+1rem)] data-[ending-style]:-translate-x-[calc(100%+1rem)]",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
          className,
        )}
        {...props}
      >
        {children}
        <BaseDialog.Close
          aria-label="Close"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "absolute top-4 right-4 text-muted-foreground")}
        >
          <X />
        </BaseDialog.Close>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}
export function SheetTitle({ className, ...props }: React.ComponentProps<typeof BaseDialog.Title>) {
  return <BaseDialog.Title className={cn("text-display-sm", className)} {...props} />;
}
export function SheetDescription({ className, ...props }: React.ComponentProps<typeof BaseDialog.Description>) {
  return <BaseDialog.Description className={cn("text-body text-muted-foreground", className)} {...props} />;
}
export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex justify-end gap-2", className)} {...props} />;
}

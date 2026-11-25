import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const widths = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
} as const;

export interface AppModalProps {
  /** Whether the modal is shown. */
  isOpen: boolean;
  /** Called when the person closes it: the close button, Escape or a press outside. */
  onClose: () => void;
  /** Plain title for the header row. */
  title?: string;
  /** Custom header content, used instead of `title`. Put a `DialogTitle` in it so the modal has a name. */
  header?: React.ReactNode;
  /** Set to false to drop the header row. The body then owns the title and the close button. */
  showHeader?: boolean;
  /** Width of a centred modal. Use `className` for a width outside the scale. */
  width?: keyof typeof widths;
  /** `center` is a dialog. `right` docks a full-height panel to the right edge. */
  placement?: "center" | "right";
  /** Covers the modal with a spinner and blocks closing while work is in flight. */
  isLoading?: boolean;
  /** Hides the close button. Pressing outside then no longer closes the modal either. */
  noCloseButton?: boolean;
  /** Puts the close button in the top right corner instead of in the header row, so the header can use the full width. Centred modals only. */
  closeButtonCorner?: boolean;
  /** Stops a press outside from closing the modal. Defaults to the value of `noCloseButton`. */
  noBackgroundClick?: boolean;
  /** Rendered after the body, at the bottom of the modal. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Classes for the panel, such as a custom max width or `p-0`. */
  className?: string;
  headerClassName?: string;
  /** Classes for the body wrapper. */
  bodyClassName?: string;
}

/**
 * The modal both apps build on: a header row with the title on the left and
 * close on the right, a body, an optional footer and a loading cover.
 * `placement="right"` turns it into a panel docked to the right edge.
 */
export function AppModal({
  isOpen,
  onClose,
  title,
  header,
  showHeader = true,
  width = "md",
  placement = "center",
  isLoading = false,
  noCloseButton = false,
  closeButtonCorner = false,
  noBackgroundClick = noCloseButton,
  footer,
  children,
  className,
  headerClassName,
  bodyClassName,
}: AppModalProps) {
  const isRight = placement === "right";
  const corner = !isRight && !noCloseButton && closeButtonCorner;

  const closeButton = (
    <DialogClose
      disabled={isLoading}
      render={
        <Button variant="ghost" size="icon-sm" aria-label="Close" className={cn("shrink-0 text-muted-foreground", corner && "absolute top-4 right-4 z-[1]")}>
          <X />
        </Button>
      }
    />
  );

  const content = (
    <>
      <LoadingOverlay open={isLoading} />
      {showHeader && (
        <>
          {corner && closeButton}
          <div
            className={cn(
              "flex shrink-0",
              corner ? "flex-col items-stretch pr-14" : "items-start justify-between gap-4",
              isRight && "p-4 pb-0",
              headerClassName,
            )}
          >
            {header ?? <DialogTitle className="text-title-sm">{title}</DialogTitle>}
            {!noCloseButton && !corner && closeButton}
          </div>
        </>
      )}
      <div className={cn("flex min-h-0 w-full flex-1 flex-col", isRight ? "overflow-hidden" : "overflow-auto", bodyClassName)}>{children}</div>
      {footer}
    </>
  );

  return (
    <Dialog
      open={isOpen}
      disablePointerDismissal={noBackgroundClick}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
    >
      {isRight ? (
        <SheetContent
          side="right"
          // The sheet's own corner button is replaced by the one in the header row, which can be hidden or disabled.
          className={cn("w-[calc(100vw-1rem)] max-w-2xl gap-0 overflow-hidden p-0 [&>[aria-label=Close]]:hidden", className)}
        >
          {content}
        </SheetContent>
      ) : (
        <DialogContent hideClose className={cn("gap-0 overflow-hidden", widths[width], className)}>
          {content}
        </DialogContent>
      )}
    </Dialog>
  );
}

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** A line under the title: who or what the form is about. */
  description?: React.ReactNode;
  /** Tailwind max-width class, such as `max-w-[560px]`. */
  widthClass?: string;
  bodyClassName?: string;
  /** Right-aligned actions: secondary first, primary last. */
  footer?: React.ReactNode;
  /** Blocks Escape and the close button while work is in flight. */
  closeDisabled?: boolean;
  children: React.ReactNode;
}

/**
 * Dialog shell for forms: title and description on the left with a round
 * close on the right, a scrolling body, and a tinted footer bar with the
 * actions aligned right.
 */
export function FormModal({ isOpen, onClose, title, description, widthClass = "max-w-[560px]", bodyClassName, footer, closeDisabled = false, children }: FormModalProps) {
  const close = closeDisabled ? () => undefined : onClose;
  return (
    <AppModal isOpen={isOpen} onClose={close} showHeader={false} className={cn("p-0", widthClass)} bodyClassName="overflow-hidden">
      <div className="flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col">
        <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="min-w-0">
            <DialogTitle className="text-title-md">{title}</DialogTitle>
            {description ? <DialogDescription className="mt-1 text-caption">{description}</DialogDescription> : null}
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={close} disabled={closeDisabled} className="-mt-1 -mr-2 text-muted-foreground">
            <X />
          </Button>
        </header>
        <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 pb-6", bodyClassName)}>{children}</div>
        {footer ? <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-secondary px-6 py-4">{footer}</footer> : null}
      </div>
    </AppModal>
  );
}

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Lines under the title: badges, identifiers, dates. */
  subtitle?: React.ReactNode;
  /** Right-aligned actions pinned to the bottom. */
  footer?: React.ReactNode;
  /** Tailwind max-width class, such as `max-w-[480px]`. */
  widthClass?: string;
  children: React.ReactNode;
}

/**
 * Right-hand detail drawer: a header with the title, subtitle and close over
 * a rule, a scrolling body, and a tinted footer with the actions aligned right.
 */
export function SideDrawer({ isOpen, onClose, title, subtitle, footer, widthClass = "max-w-[480px]", children }: SideDrawerProps) {
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      className={widthClass}
      header={
        <div className="min-w-0">
          <DialogTitle className="text-title-md">{title}</DialogTitle>
          {subtitle ? <div className="mt-1 text-caption text-muted-foreground">{subtitle}</div> : null}
        </div>
      }
      headerClassName="border-b border-border px-5 pt-5 pb-4"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer ? <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-secondary px-5 py-4">{footer}</footer> : null}
    </AppModal>
  );
}

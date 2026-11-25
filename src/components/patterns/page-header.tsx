import * as React from "react";
import { ArrowLeft, Bell, Bug, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface PageTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Sub-pages: a round back button before the title. `label` is its accessible name, such as "Back to claims". */
  back?: { label: string; onClick: () => void };
  title: React.ReactNode;
  /** Only when it tells the person something the title does not. */
  description?: React.ReactNode;
  /** Page-level actions (Refresh, Export) on the right. */
  actions?: React.ReactNode;
}

/** Title row at the top of a page: an optional back button, the title and description on the left, actions on the right. */
export const PageTitle = React.forwardRef<HTMLDivElement, PageTitleProps>(function PageTitle({ back, title, description, actions, className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex flex-wrap items-center justify-between gap-3", className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        {back ? (
          <Button variant="outline" size="icon-sm" aria-label={back.label} title={back.label} onClick={back.onClick}>
            <ChevronLeft />
          </Button>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-title-lg text-foreground">{title}</h1>
          {description ? <p className="text-caption text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
});

export interface InnerHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "content"> {
  /**
   * `bar` is the sticky bar of an inner page: back link on the left, actions on the right.
   * `stacked` is the older page header: the page name with the back link under it.
   */
  variant?: "bar" | "stacked";
  /** Where the back link goes. Renders an anchor. */
  backHref?: string;
  /** Called when the back link is pressed. Without `backHref` the link renders as a button. */
  onBack?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Text of the back link: the page it returns to. */
  backTitle?: string;
  /** Custom content shown instead of the back link. */
  content?: React.ReactNode;
  /** `stacked` only: the page name above the back link. */
  title?: React.ReactNode;
  /** `bar` only: extra content to the left of the account cluster, such as a filter or a status. */
  extra?: React.ReactNode;
  /** `bar` only: the account cluster on the far right. Pass `HeaderActions`. */
  actions?: React.ReactNode;
  /** Classes for the right side of the bar. */
  rightClassName?: string;
}

/**
 * Header of a page inside a section. The bar sticks to the top of its scroll
 * container: a back link with the parent page's name (or custom content) on
 * the left, extra content and the account cluster on the right.
 */
export const InnerHeader = React.forwardRef<HTMLElement, InnerHeaderProps>(function InnerHeader(
  { variant = "bar", backHref, onBack, backTitle, content, title, extra, actions, rightClassName, className, ...props },
  ref,
) {
  if (variant === "stacked") {
    return (
      <header ref={ref} className={cn("flex w-full flex-col items-start justify-start p-3 py-4 text-foreground", className)} {...props}>
        {title ? <span className="text-display-sm font-normal">{title}</span> : null}
        {content ?? (
          <Button
            variant="link"
            className="text-body text-foreground"
            onClick={onBack}
            {...(backHref ? { render: <a href={backHref} />, nativeButton: false } : {})}
          >
            <ChevronLeft />
            {backTitle}
          </Button>
        )}
      </header>
    );
  }

  const linkClass = "flex min-h-8 items-center justify-center gap-1 rounded-xs text-sm text-foreground rovr-focus";
  const link = (
    <>
      <ArrowLeft aria-hidden className="size-4" />
      <span>{backTitle}</span>
    </>
  );

  return (
    <header ref={ref} className={cn("sticky top-0 z-20 flex min-h-12 w-full items-center justify-between gap-4 overflow-visible bg-background pt-2.5 text-foreground", className)} {...props}>
      {content ?? (
        <div className="flex w-full items-center">
          {backHref ? (
            <a href={backHref} onClick={onBack} className={linkClass}>
              {link}
            </a>
          ) : (
            <button type="button" onClick={onBack} className={cn(linkClass, "cursor-pointer")}>
              {link}
            </button>
          )}
        </div>
      )}
      <div className={cn("flex min-w-[120px] items-center justify-end", rightClassName)}>
        {extra}
        {actions}
      </div>
    </header>
  );
});

export interface HeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text of the report button. */
  reportLabel?: string;
  /** Called when the report button is pressed. Open the error report form from here. */
  onReportError?: () => void;
  /** Unread notifications. `true` shows a dot on the bell, a number shows a count. */
  unread?: boolean | number;
  /** Content of the notifications popover. Without it the bell is a plain button. */
  notifications?: React.ReactNode;
  /** Called when the notifications popover opens or closes. */
  onNotificationsOpenChange?: (open: boolean) => void;
  /** An account button or menu after the bell. It overlaps the bell slightly, as the round buttons do in the app. */
  account?: React.ReactNode;
}

/** The cluster at the right end of a patient-app header: report an error, then the notifications bell and its popover. */
export const HeaderActions = React.forwardRef<HTMLDivElement, HeaderActionsProps>(function HeaderActions(
  { reportLabel = "Report an error", onReportError, unread, notifications, onNotificationsOpenChange, account, className, ...props },
  ref,
) {
  const count = typeof unread === "number" ? unread : 0;
  const hasUnread = unread === true || count > 0;
  const bellLabel = count > 0 ? `Notifications, ${count} unread` : hasUnread ? "Notifications, unread" : "Notifications";

  const bell = (
    <Button variant="ghost" size="icon-lg" aria-label={bellLabel} className="relative">
      <Bell className="size-6" />
      {hasUnread &&
        (count > 0 ? (
          <Badge variant="count" tone="info" aria-hidden className="absolute top-1 right-0.5">
            {count > 99 ? "99+" : count}
          </Badge>
        ) : (
          <span aria-hidden className="absolute top-2.5 right-2.5 size-2.5 rounded-full bg-primary ring-2 ring-background" />
        ))}
    </Button>
  );

  return (
    <div ref={ref} className={cn("flex w-fit items-center justify-center gap-1", className)} {...props}>
      <Button variant="ghost" size="sm" onClick={onReportError} className="px-2.5 font-normal shadow-[inset_0_0_0_1px_var(--border-strong)] hover:text-accent-foreground">
        <Bug className="size-3!" />
        {reportLabel}
      </Button>
      <div className="flex items-center -space-x-2">
        {notifications ? (
          <Popover onOpenChange={onNotificationsOpenChange}>
            <PopoverTrigger render={bell} />
            <PopoverContent align="end" side="bottom" sideOffset={8} className="w-[450px] p-2">
              {notifications}
            </PopoverContent>
          </Popover>
        ) : (
          bell
        )}
        {account}
      </div>
    </div>
  );
});

import * as React from "react";
import { RefreshCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LoadErrorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Says what did not load, e.g. "Couldn't load calls". */
  title: string;
  /** Optional second line, usually the error's message. */
  detail?: string | null;
  /** Shows the "Try again" button and runs when it is pressed. */
  onRetry?: () => void;
  /** `compact` fits inside a KPI strip. `full` fills a list section and stacks, centred, on small screens. */
  variant?: "compact" | "full";
}

/** Stands in for a section whose data failed to load, with a way to load it again. */
export const LoadError = React.forwardRef<HTMLDivElement, LoadErrorProps>(function LoadError(
  { title, detail, onRetry, variant = "full", className, ...props },
  ref,
) {
  const compact = variant === "compact";
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "flex w-full items-center justify-center rounded-lg border border-destructive/25 bg-destructive/4 dark:bg-destructive/6",
        compact ? "p-4" : "px-6 py-10",
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-4", compact ? "flex-row" : "flex-col text-center sm:flex-row sm:text-left")}>
        <span
          aria-hidden
          className={cn("flex shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive-fg dark:bg-destructive/15", compact ? "size-9" : "size-12")}
        >
          <TriangleAlert className={compact ? "size-4" : "size-5"} />
        </span>

        <div className="min-w-0 flex-1">
          <p className={cn("font-semibold text-foreground", compact ? "text-label" : "text-title-sm")}>{title}</p>
          {detail ? <p className={cn("mt-0.5 text-muted-foreground", compact ? "text-caption" : "text-body-sm")}>{detail}</p> : null}
        </div>

        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCcw aria-hidden />
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
});

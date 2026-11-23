import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  info: "bg-accent text-accent-foreground",
  warning: "bg-warning/12 text-warning-fg",
  danger: "bg-destructive/12 text-destructive-fg",
  neutral: "bg-surface-inverse text-inverse-foreground",
} as const;

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: keyof typeof tones;
  action?: React.ReactNode;
  onDismiss?: () => void;
}

/** A page-wide message above the content: scheduled downtime, an expired session, read-only mode. One at a time. */
export function Banner({ tone = "info", action, onDismiss, className, children, ...props }: BannerProps) {
  return (
    <div role="status" className={cn("flex min-h-10 flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-body-sm font-medium", tones[tone], className)} {...props}>
      <span>{children}</span>
      {action}
      {onDismiss && (
        <button type="button" aria-label="Dismiss" onClick={onDismiss} className="grid size-6 cursor-pointer place-items-center rounded-full rovr-focus hover:bg-black/10">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

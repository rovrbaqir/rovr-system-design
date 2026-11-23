import * as React from "react";
import { cn } from "@/lib/utils";

export function Timeline({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return <ol className={cn("flex flex-col", className)} {...props} />;
}

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** When it happened, already formatted. */
  time: string;
  title: React.ReactNode;
  icon?: React.ReactNode;
  /** Marks the entry the reader should notice first, such as the latest or an abnormal one. */
  emphasis?: boolean;
}

/** One entry in an encounter history or activity log. */
export function TimelineItem({ time, title, icon, emphasis, className, children, ...props }: TimelineItemProps) {
  return (
    <li className={cn("group grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3", className)} {...props}>
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border bg-surface [&_svg]:size-3",
            emphasis ? "border-primary text-primary" : "border-border-strong text-muted-foreground",
          )}
        >
          {icon ?? <span className={cn("size-1.5 rounded-full", emphasis ? "bg-primary" : "bg-subtle-foreground")} />}
        </span>
        <span className="w-px flex-1 bg-border group-last:hidden" />
      </div>
      <div className="flex flex-col gap-1 pb-6 group-last:pb-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <p className="text-title-sm">{title}</p>
          <time className="text-caption text-muted-foreground text-data">{time}</time>
        </div>
        {children && <div className="text-body-sm text-muted-foreground">{children}</div>}
      </div>
    </li>
  );
}

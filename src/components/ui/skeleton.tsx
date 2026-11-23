import * as React from "react";
import { cn } from "@/lib/utils";

/** Placeholder with the shape of the content it stands in for. Size it with className. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-sm bg-secondary-hover", className)} {...props}>
      <div className="rovr-shimmer absolute inset-0" />
    </div>
  );
}

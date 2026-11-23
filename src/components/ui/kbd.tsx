import * as React from "react";
import { cn } from "@/lib/utils";

/** A keyboard key, for shortcut hints. */
export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn("inline-grid h-5 min-w-5 place-items-center rounded-xs border border-border-strong bg-surface px-1 font-sans text-[0.6875rem] font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

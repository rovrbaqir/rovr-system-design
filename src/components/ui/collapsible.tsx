import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Collapsible = BaseCollapsible.Root;

export function CollapsibleTrigger({ className, children, ...props }: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      className={cn("group flex cursor-pointer items-center gap-1.5 rounded-xs text-label rovr-focus hover:text-accent-foreground", className)}
      {...props}
    >
      <ChevronRight className="size-4 text-muted-foreground transition-[rotate] duration-(--dur-base) ease-out group-data-[panel-open]:rotate-90" />
      {children}
    </BaseCollapsible.Trigger>
  );
}

export function CollapsibleContent({ className, children, ...props }: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-(--dur-slow) ease-out",
        "data-[starting-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0",
      )}
      {...props}
    >
      <div className={cn("pt-3", className)}>{children}</div>
    </BaseCollapsible.Panel>
  );
}

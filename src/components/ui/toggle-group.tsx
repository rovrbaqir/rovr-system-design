import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "@/lib/utils";

/** A set of on/off buttons: filters, text formatting, days of the week. Pass `multiple` to allow several. */
export function ToggleGroup({ className, ...props }: React.ComponentProps<typeof BaseToggleGroup>) {
  return <BaseToggleGroup className={cn("flex flex-wrap gap-1.5", className)} {...props} />;
}

export function Toggle({ className, ...props }: React.ComponentProps<typeof BaseToggle>) {
  return (
    <BaseToggle
      className={cn(
        "inline-flex h-control-sm cursor-pointer items-center gap-1.5 rounded-full border border-border-strong px-3 text-[0.8125rem] font-medium whitespace-nowrap select-none",
        "rovr-focus rovr-press text-muted-foreground hover:text-foreground",
        "data-[pressed]:border-primary data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

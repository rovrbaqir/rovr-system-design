import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";

export function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root className={cn("relative overflow-hidden", className)} {...props}>
      <BaseScrollArea.Viewport className="size-full overscroll-contain rounded-[inherit] outline-none">{children}</BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar className="flex w-2.5 justify-center p-0.5 opacity-0 transition-opacity duration-(--dur-base) data-[hovering]:opacity-100 data-[scrolling]:opacity-100">
        <BaseScrollArea.Thumb className="w-full rounded-full bg-border-strong" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  );
}

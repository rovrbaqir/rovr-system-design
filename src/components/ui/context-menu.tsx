import * as React from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";

/** A right-click (or long-press) menu. Everything in it must also be reachable another way. */
export const ContextMenu = BaseContextMenu.Root;
export const ContextMenuTrigger = BaseContextMenu.Trigger;

export function ContextMenuContent({ className, children, ...props }: React.ComponentProps<typeof BaseContextMenu.Popup>) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="z-50 outline-none">
        <BaseContextMenu.Popup className={cn("min-w-44 rounded-md rovr-glass p-1 text-popover-foreground outline-none", className)} {...props}>
          <Glide follow="data-highlighted">{children}</Glide>
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

export function ContextMenuItem({ className, destructive, ...props }: React.ComponentProps<typeof BaseContextMenu.Item> & { destructive?: boolean }) {
  return (
    <BaseContextMenu.Item
      className={cn(
        "flex min-h-9 cursor-default items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm outline-none select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-45 [&_svg]:size-4 [&_svg]:text-muted-foreground",
        destructive && "text-destructive-fg [&_svg]:text-destructive-fg",
        className,
      )}
      {...props}
    />
  );
}

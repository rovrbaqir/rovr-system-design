import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

export function PopoverContent({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> &
  Pick<React.ComponentProps<typeof BasePopover.Positioner>, "side" | "align" | "sideOffset">) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
        <BasePopover.Popup
          className={cn(
            "rovr-pop w-72 max-w-(--available-width) rounded-xl rovr-glass p-4 text-sm text-popover-foreground outline-none",
            className,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({ className, ...props }: React.ComponentProps<typeof BasePopover.Title>) {
  return <BasePopover.Title className={cn("text-title-sm", className)} {...props} />;
}
export function PopoverDescription({ className, ...props }: React.ComponentProps<typeof BasePopover.Description>) {
  return <BasePopover.Description className={cn("text-body-sm text-muted-foreground", className)} {...props} />;
}

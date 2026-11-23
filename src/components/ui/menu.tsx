import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";

export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;
export const MenuGroup = BaseMenu.Group;

export function MenuContent({
  className,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & Pick<React.ComponentProps<typeof BaseMenu.Positioner>, "side" | "align" | "sideOffset">) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50 outline-none">
        <BaseMenu.Popup
          className={cn(
            "rovr-pop min-w-44 rounded-md rovr-glass p-1 text-popover-foreground outline-none",
            className,
          )}
          {...props}
        >
          <Glide follow="data-highlighted">{children}</Glide>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

const itemClass = [
  "flex min-h-9 cursor-default items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm outline-none select-none",
  "relative",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
  "[&_svg]:size-4 [&_svg]:text-muted-foreground",
].join(" ");

export function MenuItem({
  className,
  destructive,
  shortcut,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item> & { destructive?: boolean; shortcut?: string }) {
  return (
    <BaseMenu.Item
      className={cn(itemClass, destructive && "text-destructive-fg [&_svg]:text-destructive-fg", className)}
      {...props}
    >
      {children}
      {shortcut && <kbd className="ml-auto pl-4 font-sans text-caption text-muted-foreground">{shortcut}</kbd>}
    </BaseMenu.Item>
  );
}

export function MenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem className={cn(itemClass, className)} {...props}>
      <span className="grid size-4 place-items-center">
        <BaseMenu.CheckboxItemIndicator>
          <Check className="text-primary!" />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

/** A heading for a run of items. For a labelled, announced group, wrap the items in MenuGroup with aria-label. */
export function MenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" className={cn("px-2.5 pt-2 pb-1.5 text-overline text-subtle-foreground", className)} {...props} />;
}

export function MenuSeparator({ className, ...props }: React.ComponentProps<typeof BaseMenu.Separator>) {
  return <BaseMenu.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

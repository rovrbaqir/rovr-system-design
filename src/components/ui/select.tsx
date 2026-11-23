import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";
import { fieldChrome } from "./input";

/**
 * Pass `items` ({ value, label }[]) so the trigger shows the label of the
 * selected value rather than the raw value.
 */
export const Select = BaseSelect.Root;
export const SelectGroup = BaseSelect.Group;

const heights = { sm: "h-control-sm", md: "h-control-md", lg: "h-control-lg" } as const;

export function SelectTrigger({
  className,
  size = "md",
  placeholder,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger> & { size?: keyof typeof heights; placeholder?: string }) {
  return (
    <BaseSelect.Trigger
      className={cn(
        fieldChrome,
        heights[size],
        "group flex cursor-pointer items-center justify-between gap-2 px-3 text-left select-none",
        "data-[popup-open]:border-primary data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface-sunken",
        className,
      )}
      {...props}
    >
      {children ?? <BaseSelect.Value placeholder={placeholder} className="truncate data-[placeholder]:text-muted-foreground" />}
      <BaseSelect.Icon className="text-muted-foreground transition-[rotate] duration-(--dur-base) ease-out group-data-[popup-open]:rotate-180">
        <ChevronDown className="size-4" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> & { sideOffset?: number }) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={sideOffset} alignItemWithTrigger={false} className="z-50 outline-none">
        <BaseSelect.Popup
          className={cn(
            "rovr-pop max-h-(--available-height) min-w-(--anchor-width) overflow-y-auto rounded-md rovr-glass p-1 text-popover-foreground outline-none",
            className,
          )}
          {...props}
        >
          <Glide follow="data-highlighted">{children}</Glide>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        "flex min-h-9 cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-2.5 text-sm outline-none select-none",
        "data-[selected]:font-medium",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-45",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText className="flex-1 truncate">{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="text-primary">
        <Check className="size-4" />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

/** Must sit inside a SelectGroup. */
export function SelectLabel({ className, ...props }: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return <BaseSelect.GroupLabel className={cn("px-2.5 pt-2 pb-1.5 text-overline text-subtle-foreground", className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: React.ComponentProps<typeof BaseSelect.Separator>) {
  return <BaseSelect.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

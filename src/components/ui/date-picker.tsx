import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";
import { fieldChrome } from "./input";

const heights = { sm: "h-control-sm", md: "h-control-md", lg: "h-control-lg" } as const;
type Passthrough = Pick<CalendarProps, "isDisabled" | "min" | "max" | "weekStartsOn" | "locale">;

interface TriggerProps {
  size?: keyof typeof heights;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
}

function Shell({
  open,
  onOpenChange,
  label,
  size = "md",
  placeholder,
  disabled,
  invalid,
  className,
  children,
  ...props
}: TriggerProps & { open: boolean; onOpenChange: (open: boolean) => void; label: string | null; children: React.ReactNode }) {
  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange}>
      <BasePopover.Trigger
        disabled={disabled}
        aria-invalid={invalid}
        aria-label={props["aria-label"]}
        className={cn(
          fieldChrome,
          heights[size],
          "flex cursor-pointer items-center justify-between gap-2 px-3 text-left text-data select-none data-[popup-open]:border-primary",
          !label && "text-muted-foreground",
          className,
        )}
      >
        <span className="truncate">{label ?? placeholder}</span>
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner align="start" sideOffset={6} className="z-50">
          <BasePopover.Popup className="rovr-pop rounded-xl rovr-glass p-3 text-popover-foreground outline-none">{children}</BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export interface DatePickerProps extends TriggerProps, Passthrough {
  value: Date | null;
  onValueChange: (value: Date) => void;
  format?: Intl.DateTimeFormatOptions;
}

export function DatePicker({ value, onValueChange, format = { dateStyle: "medium" }, placeholder = "Choose a date", isDisabled, min, max, weekStartsOn, locale = "en-US", ...trigger }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <Shell open={open} onOpenChange={setOpen} placeholder={placeholder} label={value ? new Intl.DateTimeFormat(locale, format).format(value) : null} {...trigger}>
      <Calendar
        value={value}
        onValueChange={(d) => {
          onValueChange(d);
          setOpen(false);
        }}
        {...{ isDisabled, min, max, weekStartsOn, locale }}
      />
    </Shell>
  );
}

export interface DateRangePickerProps extends TriggerProps, Passthrough {
  value: DateRange;
  onValueChange: (value: DateRange) => void;
  format?: Intl.DateTimeFormatOptions;
}

export function DateRangePicker({ value, onValueChange, format = { month: "short", day: "numeric", year: "numeric" }, placeholder = "Choose dates", isDisabled, min, max, weekStartsOn, locale = "en-US", ...trigger }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const f = new Intl.DateTimeFormat(locale, format);
  const label = value.from ? (value.to ? f.formatRange(value.from, value.to) : `${f.format(value.from)} – end date`) : null;
  return (
    <Shell open={open} onOpenChange={setOpen} placeholder={placeholder} label={label} {...trigger}>
      <Calendar
        mode="range"
        value={value}
        onValueChange={(range) => {
          onValueChange(range);
          if (range.from && range.to) setOpen(false);
        }}
        {...{ isDisabled, min, max, weekStartsOn, locale }}
      />
    </Shell>
  );
}

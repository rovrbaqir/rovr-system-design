import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Glide } from "./glide";
import { fieldChrome } from "./input";

export interface TimePickerProps {
  /** "HH:mm" in 24-hour time. */
  value: string | null;
  onValueChange: (value: string) => void;
  /** Minutes between options. */
  step?: number;
  /** First and last selectable time, "HH:mm". */
  min?: string;
  max?: string;
  placeholder?: string;
  locale?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** A time of day from a list at a fixed step. For free-form appointment slots use TimeSlots. */
export function TimePicker({ value, onValueChange, step = 30, min = "00:00", max = "23:59", placeholder = "Choose a time", locale = "en-US", disabled, className, ...props }: TimePickerProps) {
  const items = React.useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" });
    const out: { value: string; label: string }[] = [];
    for (let m = toMinutes(min); m <= toMinutes(max); m += step) {
      const v = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      out.push({ value: v, label: f.format(new Date(2000, 0, 1, Math.floor(m / 60), m % 60)) });
    }
    return out;
  }, [locale, min, max, step]);
  return (
    <BaseSelect.Root items={items} value={value} onValueChange={(v) => v && onValueChange(v as string)} disabled={disabled}>
      <BaseSelect.Trigger
        aria-label={props["aria-label"]}
        className={cn(fieldChrome, "flex h-control-md cursor-pointer items-center justify-between gap-2 px-3 text-left text-data select-none data-[popup-open]:border-primary", className)}
      >
        <BaseSelect.Value placeholder={placeholder} className="truncate data-[placeholder]:text-muted-foreground" />
        <Clock className="size-4 shrink-0 text-muted-foreground" />
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-50 outline-none">
          <BaseSelect.Popup className="rovr-pop max-h-64 min-w-(--anchor-width) overflow-y-auto rounded-md rovr-glass p-1 outline-none">
            <Glide follow="data-highlighted">
              {items.map((item) => (
                <BaseSelect.Item key={item.value} value={item.value} className="flex h-9 cursor-default items-center justify-between gap-3 rounded-sm px-2.5 text-sm text-data outline-none select-none data-[selected]:font-semibold">
                  <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="text-primary">
                    <Check className="size-4" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </Glide>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

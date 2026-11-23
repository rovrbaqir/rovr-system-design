import { cn } from "@/lib/utils";

export interface TimeSlot {
  /** Machine value, e.g. an ISO time or slot id. */
  value: string;
  /** What the person sees: "9:30 AM". */
  label: string;
  available?: boolean;
}

export interface TimeSlotsProps {
  slots: TimeSlot[];
  value: string | null;
  onValueChange: (value: string) => void;
  "aria-label": string;
  className?: string;
}

/** Available appointment times as a grid of choices. Pair with Calendar in a booking flow. */
export function TimeSlots({ slots, value, onValueChange, className, ...props }: TimeSlotsProps) {
  return (
    <div role="radiogroup" className={cn("grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2", className)} {...props}>
      {slots.map((slot) => {
        const selected = slot.value === value;
        const off = slot.available === false;
        return (
          <button
            key={slot.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={off}
            onClick={() => onValueChange(slot.value)}
            className={cn(
              "h-control-md cursor-pointer rounded-md border border-border-strong text-sm font-medium text-data rovr-focus rovr-press",
              "hover:border-primary disabled:cursor-not-allowed disabled:border-border disabled:text-subtle-foreground disabled:line-through disabled:hover:border-border",
              selected && "border-primary bg-primary text-primary-foreground",
            )}
          >
            {slot.label}
          </button>
        );
      })}
    </div>
  );
}

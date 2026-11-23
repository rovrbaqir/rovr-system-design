import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";
import { cn } from "@/lib/utils";

const tones = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" } as const;

export interface MeterProps extends React.ComponentProps<typeof BaseMeter.Root> {
  label: string;
  /** The value as people read it: "6.2 of 8 hours". */
  valueText: string;
  tone?: keyof typeof tones;
}

/** A measured amount against a known range: capacity, adherence, a goal. Use Progress for work that is under way. */
export function Meter({ label, valueText, tone = "primary", className, ...props }: MeterProps) {
  return (
    <BaseMeter.Root className={cn("flex w-full flex-col gap-2", className)} aria-valuetext={valueText} {...props}>
      <div className="flex items-baseline justify-between gap-3">
        <BaseMeter.Label className="text-label">{label}</BaseMeter.Label>
        <span className="text-body-sm text-muted-foreground text-data">{valueText}</span>
      </div>
      <BaseMeter.Track className="h-2 overflow-hidden rounded-full bg-secondary-hover">
        <BaseMeter.Indicator className={cn("rounded-full transition-[width] duration-(--dur-gentle) ease-gentle", tones[tone])} />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}

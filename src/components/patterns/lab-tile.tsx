import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface LabTileProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  value: number;
  unit: string;
  /** Reference range shown as the in-range band. */
  range: { low: number; high: number };
  /** Scale shown on the track. Defaults to a margin around the reference range. */
  scale?: { min: number; max: number };
  collected?: string;
}

/** One lab result against its reference range. The reading is static: it is never animated in. */
export function LabTile({ name, value, unit, range, scale, collected, className, ...props }: LabTileProps) {
  const span = range.high - range.low;
  const min = scale?.min ?? range.low - span * 0.5;
  const max = scale?.max ?? range.high + span * 0.5;
  const pct = (n: number) => `${Math.min(100, Math.max(0, ((n - min) / (max - min)) * 100))}%`;
  const status = value < range.low ? "low" : value > range.high ? "high" : "normal";
  return (
    <Card className={cn("gap-3", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-label text-muted-foreground">{name}</p>
        <Badge tone={status === "normal" ? "success" : "warning"}>
          {status === "normal" ? "In range" : status === "high" ? "Above range" : "Below range"}
        </Badge>
      </div>
      <p className="flex items-baseline gap-1.5">
        <span className="text-[1.75rem] leading-none font-medium tracking-[-0.03em] text-data">{value}</span>
        <span className="text-body-sm text-muted-foreground">{unit}</span>
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="relative h-1.5 rounded-full bg-secondary-hover" aria-hidden>
          <span className="absolute inset-y-0 rounded-full bg-success/35" style={{ left: pct(range.low), right: `calc(100% - ${pct(range.high)})` }} />
          <span
            className={cn("absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface", status === "normal" ? "bg-success" : "bg-warning")}
            style={{ left: pct(value) }}
          />
        </div>
        <p className="flex justify-between text-caption text-muted-foreground text-data">
          <span>
            Reference {range.low}–{range.high} {unit}
          </span>
          {collected && <span>{collected}</span>}
        </p>
      </div>
    </Card>
  );
}

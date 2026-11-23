import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/chart";

export interface VitalTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  /** Recent readings, oldest first. */
  trend?: number[];
  /** One sentence for the trend: "Down 4 bpm over 30 days". */
  trendLabel?: string;
  /** When the reading was taken. */
  measured?: string;
}

/** One vital sign with its recent trend. The reading itself is never animated. */
export function VitalTile({ label, value, unit, icon, trend, trendLabel, measured, className, ...props }: VitalTileProps) {
  return (
    <Card className={cn("gap-3", className)} {...props}>
      <div className="flex items-center justify-between gap-3 text-muted-foreground">
        <span className="text-label">{label}</span>
        <span className="[&_svg]:size-4">{icon}</span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="flex items-baseline gap-1.5">
          <span className="text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-data">{value}</span>
          {unit && <span className="text-body-sm text-muted-foreground">{unit}</span>}
        </p>
        {trend && <Sparkline data={trend} aria-label={trendLabel ?? `${label} trend`} />}
      </div>
      {(trendLabel || measured) && (
        <p className="flex justify-between gap-3 text-caption text-muted-foreground">
          <span>{trendLabel}</span>
          <span className="text-data">{measured}</span>
        </p>
      )}
    </Card>
  );
}

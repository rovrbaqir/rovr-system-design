import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Change against the comparison period, e.g. "+4.2%". */
  delta?: string;
  /** Whether the change is good, bad or neither. Direction alone does not say: a falling no-show rate is good. */
  trend?: "positive" | "negative" | "neutral";
  direction?: "up" | "down";
  caption?: string;
}

/** One figure with its label and its change. Lay several out in a row for a summary strip. */
export function StatCard({ label, value, unit, delta, trend = "neutral", direction = "up", caption, className, children, ...props }: StatCardProps) {
  const Arrow = direction === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className={cn("gap-3", className)} {...props}>
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="flex items-baseline gap-1.5">
        <span className="text-[2rem] leading-none font-medium tracking-[-0.035em] text-data">{value}</span>
        {unit && <span className="text-body-sm text-muted-foreground">{unit}</span>}
      </p>
      {(delta || caption) && (
        <p className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
          {delta && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium text-data",
                trend === "positive" && "text-success-fg",
                trend === "negative" && "text-destructive-fg",
                trend === "neutral" && "text-foreground",
              )}
            >
              <Arrow className="size-3.5" aria-hidden />
              {delta}
            </span>
          )}
          {caption}
        </p>
      )}
      {children}
    </Card>
  );
}

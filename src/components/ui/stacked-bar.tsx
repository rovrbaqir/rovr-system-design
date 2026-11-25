import * as React from "react";
import { chartColors } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const sizes = { sm: "h-1.5", md: "h-2", lg: "h-3" } as const;

export interface StackedBarSegment {
  /** Stable identity of the segment. */
  key: string;
  /** Names the segment in the legend: "Paid". */
  label: string;
  /** The segment's share of the whole, in any unit. */
  value: number;
  /** A CSS colour. Defaults to the chart colour at the segment's position in `segments`. */
  color?: string;
}

export interface StackedBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Two to five parts of one whole. Segments with no value are left out. */
  segments: StackedBarSegment[];
  /** Formats the value shown in the legend: a count, a percentage, money. */
  formatValue?: (value: number) => string;
  /** Height of the bar. */
  size?: keyof typeof sizes;
  /** Shows the dot, label and value of each segment under the bar. Without it the bar describes itself to screen readers. */
  legend?: boolean;
  /** Says what the whole is: "Claims by status". */
  "aria-label": string;
}

const defaultFormat = (value: number) => value.toLocaleString("en-US");

/** Parts of one whole on a single bar. The legend carries names and values, so identity is never colour alone. */
export const StackedBar = React.forwardRef<HTMLDivElement, StackedBarProps>(function StackedBar(
  { segments, formatValue = defaultFormat, size = "md", legend = true, className, "aria-label": ariaLabel, ...props },
  ref,
) {
  // Colour follows the segment's place in `segments`, so it does not change when another segment drops to zero.
  const visible = segments.map((segment, i) => ({ ...segment, color: segment.color ?? chartColors[i % chartColors.length] })).filter((segment) => segment.value > 0);
  const description = visible.map((segment) => `${formatValue(segment.value)} ${segment.label}`).join(", ");

  return (
    <div ref={ref} role="group" aria-label={ariaLabel} className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <div
        role={legend ? undefined : "img"}
        aria-label={legend ? undefined : description || "No data"}
        aria-hidden={legend || undefined}
        className={cn("flex w-full gap-0.5 overflow-hidden rounded-full", sizes[size], visible.length === 0 && "bg-secondary-hover")}
      >
        {visible.map((segment) => (
          <span
            key={segment.key}
            title={`${segment.label}: ${formatValue(segment.value)}`}
            className="min-w-1 transition-[flex-grow] duration-(--dur-gentle) ease-gentle"
            style={{ flex: `${segment.value} 1 0%`, background: segment.color }}
          />
        ))}
      </div>
      {legend && visible.length > 0 && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted-foreground">
          {visible.map((segment) => (
            <li key={segment.key} className="flex items-center gap-1.5">
              <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: segment.color }} />
              {segment.label}
              <span className="font-semibold text-foreground text-data">{formatValue(segment.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

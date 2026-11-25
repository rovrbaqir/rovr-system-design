import * as React from "react";
import { cn } from "@/lib/utils";

export type ReferenceRangeStatus = "low" | "normal" | "high";

const sizes = {
  sm: { root: "gap-1.5", text: "text-caption", bar: "h-3", track: "h-1", marker: "size-3" },
  md: { root: "gap-2", text: "text-label", bar: "h-4", track: "h-2", marker: "size-4" },
  lg: { root: "gap-2.5", text: "text-body", bar: "h-5", track: "h-3", marker: "size-5" },
} as const;

const tones = {
  success: "[--tone:var(--success)] [--tone-fg:var(--success-fg)]",
  warning: "[--tone:var(--warning)] [--tone-fg:var(--warning-fg)]",
  danger: "[--tone:var(--destructive)] [--tone-fg:var(--destructive-fg)]",
} as const;

const defaultLabels: Record<ReferenceRangeStatus, string> = { low: "Below range", normal: "In range", high: "Above range" };
const defaultFormat = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** The scale when `min` and `max` are not given: the normal range with room either side, widened a little to reach the value. */
function defaultScale(value: number, low: number | undefined, high: number | undefined): [number, number] {
  let lo: number;
  let hi: number;
  let reach: number;
  if (low !== undefined && high !== undefined) {
    const span = high - low || Math.abs(high) || 1;
    lo = low - span * 0.3;
    hi = high + span * 0.3;
    reach = span;
  } else if (high !== undefined) {
    const span = Math.abs(high) || 1;
    lo = high >= 0 ? 0 : high - span;
    hi = high + span * 0.3;
    reach = span;
  } else if (low !== undefined) {
    const span = Math.abs(low) || 1;
    lo = low - span * 0.5;
    hi = low + span;
    reach = span;
  } else {
    const span = Math.abs(value) || 1;
    return [value - span, value + span];
  }
  // A value far outside is pinned to the end of the bar, so the normal band keeps a readable width.
  const start = Math.min(lo, Math.max(value - reach * 0.1, lo - reach));
  const end = Math.max(hi, Math.min(value + reach * 0.1, hi + reach));
  // Readings that cannot be negative do not get a scale that starts below zero.
  const floor = Math.min(value, low ?? high ?? 0) >= 0 ? 0 : -Infinity;
  return [Math.max(start, floor), end];
}

export interface ReferenceRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The reading. */
  value: number;
  /** Lower limit of the normal range. Leave out when only an upper limit applies ("under 100"). */
  low?: number;
  /** Upper limit of the normal range. Leave out when only a lower limit applies ("40 or more"). */
  high?: number;
  /** Start of the scale. Defaults to a little below `low`, never below zero for a positive reading. */
  min?: number;
  /** End of the scale. Defaults to a little above `high`. */
  max?: number;
  /** Shown after the value: "mg/dL". */
  unit?: string;
  /** What is measured: "LDL cholesterol". Names the bar for screen readers even when the header is hidden. */
  label: string;
  size?: keyof typeof sizes;
  /** Formats the value and the limits. Defaults to up to two decimals. */
  format?: (value: number) => string;
  /** Shows the label, the value and the interpretation above the bar. Turn off when the tile around it already shows them. */
  header?: boolean;
  /** Tone of a reading outside the range. Use `danger` only for a critical value. */
  severity?: "warning" | "danger";
  /** The interpretation words. Defaults to "Below range", "In range" and "Above range". */
  labels?: Partial<Record<ReferenceRangeStatus, string>>;
}

/**
 * Where a lab value sits against its normal range. Read-only and never animated:
 * the band is the normal range, the marker is the reading, and the words say which side it is on.
 */
export const ReferenceRange = React.forwardRef<HTMLDivElement, ReferenceRangeProps>(function ReferenceRange(
  { value, low, high, min, max, unit, label, size = "md", format = defaultFormat, header = true, severity = "warning", labels, className, ...props },
  ref,
) {
  const s = sizes[size];
  const [autoMin, autoMax] = defaultScale(value, low, high);
  const start = min ?? autoMin;
  const end = Math.max(max ?? autoMax, start + Number.EPSILON);
  const pct = (n: number) => clamp(((n - start) / (end - start)) * 100, 0, 100);

  const status: ReferenceRangeStatus = low !== undefined && value < low ? "low" : high !== undefined && value > high ? "high" : "normal";
  const hasRange = low !== undefined || high !== undefined;
  const statusLabel = { ...defaultLabels, ...labels }[status];
  const reading = unit ? `${format(value)} ${unit}` : format(value);

  const rangeText =
    low !== undefined && high !== undefined
      ? `the normal range of ${format(low)} to ${format(high)}`
      : high !== undefined
        ? `the normal range of ${format(high)} or less`
        : low !== undefined
          ? `the normal range of ${format(low)} or more`
          : "";
  const valueText = hasRange ? `${reading}, ${status === "low" ? "below" : status === "high" ? "above" : "within"} ${rangeText}` : reading;

  const bandStart = low === undefined ? 0 : pct(low);
  const bandEnd = high === undefined ? 100 : pct(high);
  const at = pct(value);
  // A limit label near an end of the bar lines up with that end instead of hanging past it.
  const tick = (position: number): React.CSSProperties =>
    position < 8 ? { left: `${position}%` } : position > 92 ? { right: `${100 - position}%` } : { left: `${position}%`, transform: "translateX(-50%)" };

  return (
    <div
      ref={ref}
      role="meter"
      aria-label={label}
      aria-valuemin={start}
      aria-valuemax={end}
      aria-valuenow={clamp(value, start, end)}
      aria-valuetext={valueText}
      data-status={status}
      className={cn("flex w-full flex-col", s.root, tones[status === "normal" ? "success" : severity], className)}
      {...props}
    >
      {header && (
        <div className={cn("flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5", s.text)}>
          <span className="font-medium">{label}</span>
          <span className="flex items-baseline gap-2">
            <span className="font-medium text-data">
              {format(value)}
              {unit && <span className="font-normal text-muted-foreground"> {unit}</span>}
            </span>
            {hasRange && <span className="font-medium text-(--tone-fg)">{statusLabel}</span>}
          </span>
        </div>
      )}
      <div className={cn("relative flex items-center", s.bar)}>
        <div className={cn("relative w-full rounded-full bg-secondary-hover", s.track)}>
          {hasRange && (
            <span
              className="absolute inset-y-0 rounded-full bg-[color-mix(in_oklab,var(--success)_45%,transparent)]"
              style={{ left: `${bandStart}%`, width: `${Math.max(0, bandEnd - bandStart)}%` }}
            />
          )}
        </div>
        <span
          className={cn("absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-(--tone) shadow-raised", s.marker)}
          style={{ left: `${at}%` }}
        />
      </div>
      {hasRange && (
        <div className="relative h-4 text-caption text-muted-foreground text-data">
          {low !== undefined && (
            <span className="absolute top-0 whitespace-nowrap" style={tick(bandStart)}>
              {format(low)}
            </span>
          )}
          {high !== undefined && (
            <span className="absolute top-0 whitespace-nowrap" style={tick(bandEnd)}>
              {format(high)}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

import * as React from "react";
import { cn } from "@/lib/utils";

const tones = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" } as const;

export interface BarListRow {
  /** Names the row: "Prior authorisation". */
  label: string;
  /** Sets the length of the bar. */
  value: number;
  /** Text shown on the right. Defaults to the formatted value. */
  valueLabel?: React.ReactNode;
  /** Muted note after the label: "human step". */
  hint?: string;
}

export interface BarListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  /** The rows, in the order to show them. Sort them largest first for a ranking. */
  rows: BarListRow[];
  /** Colours every bar. One tone for the whole list: the rows are one measure. */
  tone?: keyof typeof tones;
  /** Formats `value` on the right when a row has no `valueLabel`. */
  format?: (value: number) => string;
  /** The value a full bar stands for. Defaults to the largest value in the list. */
  max?: number;
}

const defaultFormat = (value: number) => value.toLocaleString("en-US");

/** Ranked horizontal bars: a label, a bar scaled to the largest value, and the value. The bars share one track, so lengths compare across rows. */
export const BarList = React.forwardRef<HTMLUListElement, BarListProps>(function BarList({ rows, tone = "primary", format = defaultFormat, max, className, ...props }, ref) {
  const top = max ?? Math.max(...rows.map((row) => row.value), 0);
  return (
    <ul ref={ref} className={cn("grid w-full grid-cols-[minmax(0,38%)_minmax(0,1fr)_auto] gap-x-3", className)} {...props}>
      {rows.map((row, i) => {
        const share = top > 0 ? Math.min(100, Math.max(0, (row.value / top) * 100)) : 0;
        return (
          <li key={`${row.label}-${i}`} className="col-span-3 grid grid-cols-subgrid items-center py-2">
            <span className="truncate text-label" title={row.hint ? `${row.label}, ${row.hint}` : row.label}>
              {row.label}
              {row.hint && <span className="ml-1.5 text-caption font-normal text-muted-foreground">{row.hint}</span>}
            </span>
            <span aria-hidden className="h-2 overflow-hidden rounded-full bg-secondary-hover">
              <span
                className={cn("block h-full rounded-full transition-[width] duration-(--dur-gentle) ease-gentle", tones[tone])}
                // A small value still shows as a sliver; zero shows the empty track.
                style={{ width: `${row.value > 0 ? Math.max(share, 2) : 0}%` }}
              />
            </span>
            <span className="text-right text-label text-data">{row.valueLabel ?? format(row.value)}</span>
          </li>
        );
      })}
    </ul>
  );
});

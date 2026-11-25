import * as React from "react";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart";
import { ReferenceRange } from "@/components/ui/reference-range";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { cn } from "@/lib/utils";

/** How the lab reads the result. */
export type BiomarkerInterpretation = "normal" | "abnormal" | "critical";
/** How far back the trend line goes. */
export type BiomarkerRange = "6-months" | "year";

export interface BiomarkerResult {
  /** When the result was reported. */
  date: string | Date;
  value: number;
}

const dot: Record<BiomarkerInterpretation, string> = {
  normal: "bg-success",
  abnormal: "bg-warning",
  critical: "bg-destructive",
};

const shortDate = (d: Date) => new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(d);
const monthLabel = (d: Date) => `${new Intl.DateTimeFormat("en-US", { month: "short" }).format(d)} '${String(d.getFullYear()).slice(2)}`;

export interface BiomarkerCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Short name of the biomarker: "LDL-C". */
  name: string;
  /** `numeric` shows the value, the reference range and the trend. `text` shows the interpretation alone, for results such as "Negative". */
  type?: "numeric" | "text";
  /** The latest result. */
  value?: number;
  /** Shown after the value: "mg/dL". */
  unit?: string;
  /** The goal for this patient, shown at the top right after "Target": "< 100". */
  target?: React.ReactNode;
  /** The lab's reading of the result. Sets the colour of the dot and the range bar; on a `text` card it is the headline. */
  interpretation?: BiomarkerInterpretation | (string & {});
  /** Lower limit of the normal range. Leave out when only an upper limit applies. */
  low?: number | null;
  /** Upper limit of the normal range. Leave out when only a lower limit applies. */
  high?: number | null;
  /** Earlier results, in any order. Only those inside the chosen period are drawn. */
  history?: BiomarkerResult[];
  /** The word above the patient's own value on the right: "You" in the patient app, "Patient" in the provider app. */
  valueLabel?: string;
  /** Adds a history button next to the name. Open the full result history from here. */
  onHistoryClick?: () => void;
  /** When the result was last updated. Shown on a `text` card. */
  lastUpdated?: string | Date;
  /** The period on the trend line. Leave out to let the card keep its own state, starting at six months. */
  rangeType?: BiomarkerRange;
  onRangeChange?: (range: BiomarkerRange) => void;
  /** Drops the card surface and the range switch, for embedding the content in a message or another card. */
  bare?: boolean;
}

/**
 * One lab biomarker: its latest value against the normal range, and how it has
 * moved over the last six months or year. The reading itself is never animated.
 */
export const BiomarkerCard = React.forwardRef<HTMLDivElement, BiomarkerCardProps>(function BiomarkerCard(
  {
    name,
    type = "numeric",
    value,
    unit,
    target,
    interpretation = "normal",
    low,
    high,
    history = [],
    valueLabel = "You",
    onHistoryClick,
    lastUpdated,
    rangeType,
    onRangeChange,
    bare = false,
    className,
    ...props
  },
  ref,
) {
  const [ownRange, setOwnRange] = React.useState<BiomarkerRange>("6-months");
  const range = rangeType ?? ownRange;
  const hasRange = low != null || high != null;
  const status: BiomarkerInterpretation = interpretation === "normal" ? "normal" : interpretation === "critical" ? "critical" : "abnormal";

  const points = React.useMemo(() => {
    const since = new Date();
    since.setMonth(since.getMonth() - (range === "year" ? 12 : 6));
    return history
      .map((item) => ({ date: new Date(item.date), value: item.value }))
      .filter((item) => item.date.getTime() > since.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [history, range]);

  const title = (
    <h3 className="text-title-lg font-semibold">{name}</h3>
  );
  const historyButton = onHistoryClick && (
    <Button variant="secondary" size="icon-sm" aria-label={`${name} result history`} onClick={onHistoryClick}>
      <History />
    </Button>
  );
  const Surface = bare ? "div" : Card;
  const surfaceClass = bare ? className : cn("w-full gap-0 p-4", className);

  if (type !== "numeric") {
    return (
      <Surface ref={ref} className={surfaceClass} {...props}>
        {historyButton ? (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {title}
              {historyButton}
            </div>
          </div>
        ) : (
          title
        )}
        <span className="text-display-sm font-normal capitalize">{interpretation}</span>
        {lastUpdated && <p className="mt-9 text-caption text-muted-foreground text-data">Last updated: {shortDate(new Date(lastUpdated))}</p>}
      </Surface>
    );
  }

  return (
    <Surface ref={ref} className={surfaceClass} {...props}>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {title}
            {historyButton}
          </div>
          {target != null && target !== "" && <div className="text-right text-caption text-data">Target {target}</div>}
        </div>

        <div className="flex w-full flex-1 items-center justify-between gap-2">
          <div className="flex items-center justify-end gap-2 text-right">
            <span aria-hidden className={cn("size-2 rounded-full", dot[status])} />
            <div className="flex items-baseline">
              <span className="text-display-md font-normal text-data">{value?.toLocaleString("en-US")}</span>
              <span className="ml-1 text-caption">{unit}</span>
            </div>
            <span className="sr-only">, {interpretation}</span>
          </div>

          <div className="flex w-1/2 flex-col items-end justify-start gap-2">
            {hasRange && (
              <div className="flex w-full flex-col items-end justify-center pr-3">
                <span className="text-body-sm">Normal</span>
                <span className="ml-1 text-caption text-muted-foreground text-data">
                  {low == null ? `< ${high}` : high == null ? `> ${low}` : `${low} - ${high}`}
                </span>
              </div>
            )}
            {hasRange && value !== undefined && (
              <ReferenceRange
                className="max-w-[200px]"
                size="sm"
                header={false}
                label={name}
                value={value}
                unit={unit}
                low={low ?? undefined}
                high={high ?? undefined}
                severity={status === "critical" ? "danger" : "warning"}
              />
            )}
            <div className="flex w-full flex-col items-end justify-center pr-3">
              <span className="text-body-sm">{valueLabel}</span>
              <span className="ml-1 text-caption text-muted-foreground text-data">{value}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <LineChart
          height={192}
          area={false}
          aria-label={`${name} results over the last ${range === "year" ? "year" : "six months"}`}
          labels={points.map((p) => monthLabel(p.date))}
          series={[{ label: "Value", data: points.map((p) => p.value) }]}
          format={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        />
      </div>

      {!bare && (
        <div className="relative flex w-full items-center justify-center">
          <SegmentedControl<BiomarkerRange>
            size="sm"
            aria-label={`${name} period`}
            value={range}
            onValueChange={(next) => {
              setOwnRange(next);
              onRangeChange?.(next);
            }}
            options={[
              { value: "6-months", label: "6M" },
              { value: "year", label: "Y" },
            ]}
          />
        </div>
      )}
    </Surface>
  );
});

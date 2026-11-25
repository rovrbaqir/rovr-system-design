import * as React from "react";
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** The period a health data card shows. The range switch under the chart sets it. */
export type HealthDataRange = "day" | "week" | "month" | "4-month" | "6-months" | "year";

/* ------------------------------------------------------------------ */
/* Dates. Plain `YYYY-MM-DD` strings in local time, as the apps store them. */
/* ------------------------------------------------------------------ */

const parseDay = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const formatDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Adds months and keeps the day inside the target month, so 31 January plus one month is the last day of February. */
const addMonths = (d: Date, n: number) => {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
};
const text = (d: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", options).format(d);

function periodOf(selected: Date, range: HealthDataRange): [Date, Date] {
  const y = selected.getFullYear();
  const m = selected.getMonth();
  switch (range) {
    case "week": {
      const start = new Date(y, m, selected.getDate() - selected.getDay());
      return [start, new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)];
    }
    case "month":
      return [new Date(y, m, 1), new Date(y, m + 1, 0)];
    case "4-month":
      return [new Date(y, m - 3, 1), new Date(y, m + 1, 0)];
    case "6-months":
      return [new Date(y, m - 5, 1), new Date(y, m + 1, 0)];
    case "year":
      return [new Date(y, 0, 1), new Date(y, 11, 31)];
    default:
      return [selected, selected];
  }
}

function periodLabel(selected: Date, range: HealthDataRange) {
  const [start, end] = periodOf(selected, range);
  const monthDay: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const monthYear: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
  switch (range) {
    case "week":
      return `${text(start, monthDay)} - ${text(end, monthDay)}`;
    case "month":
      return text(start, monthYear);
    case "4-month":
    case "6-months":
      return `${text(start, monthYear)} - ${text(end, monthYear)}`;
    case "year":
      return String(start.getFullYear());
    default:
      return startOfDay(new Date()).getTime() === start.getTime()
        ? `Today, ${text(start, { month: "long", day: "numeric" })}`
        : text(start, { month: "short", day: "numeric", year: "numeric" });
  }
}

function shiftPeriod(selected: Date, range: HealthDataRange, direction: -1 | 1) {
  switch (range) {
    case "week":
      return new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + 7 * direction);
    case "month":
      return addMonths(selected, direction);
    case "4-month":
      return addMonths(selected, 4 * direction);
    case "6-months":
      return addMonths(selected, 6 * direction);
    case "year":
      return addMonths(selected, 12 * direction);
    default:
      return new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + direction);
  }
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export interface HealthDataCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The header row. Pass a `HealthDataCardHeader`. Replaces `title`. */
  header?: React.ReactNode;
  /** A small plain title, shown when there is no `header`. */
  title?: React.ReactNode;
  /** Covers the card with a loading layer while its data is fetched. */
  isLoading?: boolean;
}

/**
 * The surface every health KPI sits on: a header or a small title on top, the
 * content below, and a loading layer over all of it. It takes its width from its parent.
 */
export const HealthDataCard = React.forwardRef<HTMLDivElement, HealthDataCardProps>(function HealthDataCard(
  { header, title, isLoading = false, className, children, ...props },
  ref,
) {
  return (
    <Card ref={ref} dir="ltr" className={cn("relative h-auto max-h-fit w-full items-start justify-start gap-2 p-7 max-[1099px]:px-3", className)} {...props}>
      {header ?? <div className="text-caption text-foreground">{title}</div>}
      <LoadingOverlay open={isLoading} />
      {children}
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export interface HealthDataCardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The name of the metric: "Heart rate". */
  title: string;
  /** The period on show. The date navigator appears only when this, `selectedDate` and `onSelectedDateChange` are all set. */
  rangeType?: HealthDataRange;
  /** A day inside the period on show, as `YYYY-MM-DD`. */
  selectedDate?: string;
  /** Called with a `YYYY-MM-DD` day when the person steps to another period or picks a day. */
  onSelectedDateChange?: (date: string) => void;
  /** Whether the metric is pinned. */
  pinned?: boolean;
  /** Called with the new state when the pin is pressed. The pin button appears only when this is set. */
  onPinnedChange?: (pinned: boolean) => void;
  /** Shows a spinner in the pin button while the change is saved. */
  pinLoading?: boolean;
  /** Names of the people who pinned the metric. Shown in a tooltip on the pin. */
  pinnedBy?: string[];
}

/**
 * Title on the left; the date navigator and the pin on the right.
 * Below 640px the navigator drops to its own full-width row under the title and the pin.
 */
export function HealthDataCardHeader({
  title,
  rangeType,
  selectedDate,
  onSelectedDateChange,
  pinned = false,
  onPinnedChange,
  pinLoading = false,
  pinnedBy,
  className,
  ...props
}: HealthDataCardHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const hasNavigator = !!rangeType && !!selectedDate && !!onSelectedDateChange;
  const selected = selectedDate ? parseDay(selectedDate) : null;
  const today = startOfDay(new Date());
  const canGoNext = hasNavigator && shiftPeriod(selected!, rangeType, 1).getTime() <= today.getTime();

  const pin = onPinnedChange && (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={pinned ? `Unpin ${title}` : `Pin ${title}`}
      aria-pressed={pinned}
      loading={pinLoading}
      onClick={() => onPinnedChange(!pinned)}
    >
      <Pin className={cn("-rotate-45", pinned && "fill-current text-accent-foreground")} />
    </Button>
  );

  return (
    <div className={cn("flex w-full items-center justify-between gap-2 max-sm:flex-wrap max-sm:gap-y-2", className)} {...props}>
      <h3 className="text-body-sm text-foreground max-2xl:text-caption">{title}</h3>

      <div className="flex items-center gap-2 text-caption text-muted-foreground max-sm:contents">
        {hasNavigator && (
          <div className="flex shrink-0 items-center gap-0.5 text-foreground max-sm:order-last max-sm:w-full">
            <Button variant="ghost" size="icon-sm" aria-label="Previous period" onClick={() => onSelectedDateChange(formatDay(shiftPeriod(selected!, rangeType, -1)))}>
              <ChevronLeft />
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                aria-label={`Choose a date, showing ${periodLabel(selected!, rangeType)}`}
                className="flex h-control-sm cursor-pointer items-center gap-1.5 rounded-full px-2 text-caption whitespace-nowrap text-foreground text-data rovr-focus hover:bg-secondary"
              >
                <CalendarDays aria-hidden className="size-3 shrink-0 text-subtle-foreground" />
                {periodLabel(selected!, rangeType)}
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={6} className="w-auto p-3">
                <Calendar
                  value={selected}
                  max={today}
                  onValueChange={(day) => {
                    onSelectedDateChange(formatDay(day));
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Next period"
              disabled={!canGoNext}
              onClick={() => onSelectedDateChange(formatDay(shiftPeriod(selected!, rangeType, 1)))}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
        {pin && (pinnedBy && pinnedBy.length > 0 ? <Tooltip content={`Pinned by ${new Intl.ListFormat("en-US", { type: "conjunction" }).format(pinnedBy)}`}>{pin}</Tooltip> : pin)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Value                                                               */
/* ------------------------------------------------------------------ */

export interface MetricValueProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The latest or average reading. A number is rounded to a whole number; a string is shown as given. The value row is left out when there is no reading. */
  value?: number | string | null;
  /** Shown at the lower right of the value: "bpm". */
  unit?: string;
  /** A word under the unit, in the same stack: "average" or "trend". */
  label?: React.ReactNode;
  /** The line under the value: how long ago the reading was taken, or what the figure covers ("7-day average"). */
  caption?: React.ReactNode;
  /** Shows placeholders in place of the value, the unit and the caption. */
  showLoading?: boolean;
}

/** The headline reading of a card: a large light value with its unit at the lower right, and one quiet line below. */
export function MetricValue({ value, unit, label, caption, showLoading = false, className, ...props }: MetricValueProps) {
  const hasValue = value !== undefined && value !== null && value !== "";
  return (
    <div className={cn("mb-4", className)} aria-busy={showLoading || undefined} {...props}>
      {hasValue && (
        <div className="flex items-end justify-start text-display-md font-light text-data">
          {showLoading ? <Skeleton className="h-10 w-[30%]" /> : typeof value === "number" ? value.toFixed(0) : value}
          {showLoading ? (
            <Skeleton className="mt-1 h-5 w-[20%]" />
          ) : (
            <span className="relative mb-1 ml-2 flex flex-col items-start justify-start text-body-sm font-normal tracking-normal text-muted-foreground">
              {unit}
              {label && <span>{label}</span>}
            </span>
          )}
        </div>
      )}
      <div className="mt-1 text-caption text-muted-foreground">{showLoading ? <Skeleton className="h-[15px] w-1/4" /> : caption}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty chart                                                         */
/* ------------------------------------------------------------------ */

const emptySizes = {
  sm: { title: "text-caption", subtitle: "text-[0.6875rem]", axis: "text-[0.6875rem]" },
  md: { title: "text-label", subtitle: "text-caption", axis: "text-[0.6875rem]" },
  lg: { title: "text-body", subtitle: "text-body-sm", axis: "text-caption" },
} as const;

function timeLabels(range: HealthDataRange) {
  if (range === "week") return ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  if (range === "month") return ["1", "6", "11", "16", "21", "26"];
  if (range === "year") return ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
  return ["6AM", "12PM", "6PM", "12AM"];
}

export interface NoDataChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sets the labels along the bottom: hours for a day, weekdays for a week, and so on. */
  rangeType: HealthDataRange;
  /** The wearable or app the readings come from: "Oura". */
  deviceName: string;
  /** Bottom of the y axis. With `max`, the axis shows five evenly spaced ticks. Without both it runs 0 to 100. */
  min?: number;
  /** Top of the y axis. */
  max?: number;
  /** Rendered under the empty chart, usually the range switch. */
  rangeProvider?: React.ReactNode;
  size?: keyof typeof emptySizes;
  /** Hides the "is offline" message and leaves the empty frame. */
  noConnectionUI?: boolean;
  /** The device is connected and its first readings are still being processed. Shows a spinner and "Gathering insights". */
  isGatheringInsight?: boolean;
  /** Called when the device name in the message is pressed. Open the device settings from here. */
  onDeviceClick?: () => void;
}

/** What a card shows in place of its chart when there are no readings: the empty axes with a message in the middle. */
export function NoDataChart({
  rangeType,
  deviceName,
  min,
  max,
  rangeProvider,
  size = "md",
  noConnectionUI = false,
  isGatheringInsight = false,
  onDeviceClick,
  className,
  ...props
}: NoDataChartProps) {
  const s = emptySizes[size];
  const yLabels = min !== undefined && max !== undefined ? Array.from({ length: 5 }, (_, i) => (min + ((max - min) / 4) * i).toFixed(0)) : ["0", "25", "50", "75", "100"];

  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center self-stretch", className)} {...props}>
      <div className="relative flex h-full min-h-[100px] w-full flex-col p-3 pb-6 pl-0">
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div aria-hidden className="absolute top-0 left-0 flex h-full flex-col items-end justify-between pr-2">
            {[...yLabels].reverse().map((label, i) => (
              <span key={i} className={cn(s.axis, "text-subtle-foreground text-data")}>
                {label}
              </span>
            ))}
          </div>

          {!noConnectionUI && !isGatheringInsight && (
            <div className="relative flex flex-col items-center justify-center px-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <p className={cn(s.title, "flex w-full items-center justify-center gap-1 font-medium text-muted-foreground")}>
                  Your
                  <Button variant="link" className={cn(s.title, "gap-1 font-semibold text-foreground capitalize")} onClick={onDeviceClick}>
                    {deviceName}
                    <ArrowUpRight className="size-3" />
                  </Button>
                  is offline.
                </p>
                <p className={cn(s.subtitle, "text-muted-foreground")}>
                  Please make sure that {deviceName} is charged and paired with Pulse.
                </p>
              </div>
            </div>
          )}

          {isGatheringInsight && (
            <div role="status" className={cn(s.title, "absolute inset-0 flex flex-col items-center justify-center gap-1 px-4 text-center font-medium text-muted-foreground")}>
              <Spinner label="" className="mb-6 size-10 text-primary" />
              Gathering insights
              <p className="text-caption font-normal">Please check again in 5 minutes.</p>
            </div>
          )}
        </div>

        <div aria-hidden className="flex items-center justify-between px-2 pt-4">
          {timeLabels(rangeType).map((label) => (
            <span key={label} className={cn(s.axis, "text-subtle-foreground text-data")}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {rangeProvider}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Not connected                                                       */
/* ------------------------------------------------------------------ */

export interface NotConnectedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "content"> {
  /** The name of the metric: "Heart rate". */
  title: string;
  /** The device or app to connect: "Oura". Falls back to "Wearable, App, or Device". */
  providerName?: string;
  /** Replaces the connect sentence in the middle of the card. */
  content?: React.ReactNode;
  /** Called when the provider name is pressed. Start pairing from here. */
  onConnect?: () => void;
  /** Covers the card with a loading layer while pairing is in progress. */
  pairing?: boolean;
  /** Pin state for the header, passed on to `HealthDataCardHeader`. */
  header?: Pick<HealthDataCardHeaderProps, "pinned" | "onPinnedChange" | "pinLoading" | "pinnedBy">;
}

/** The card for a metric whose source is not connected: the header on top and one sentence in the middle that starts pairing. */
export const NotConnected = React.forwardRef<HTMLDivElement, NotConnectedProps>(function NotConnected(
  { title, providerName, content, onConnect, pairing = false, header, className, ...props },
  ref,
) {
  return (
    <Card ref={ref} dir="ltr" className={cn("relative aspect-[4/3] min-h-[400px] w-full flex-1 items-start justify-start gap-0 p-7", className)} {...props}>
      <LoadingOverlay open={pairing} />
      <HealthDataCardHeader title={title} {...header} />
      <div className="flex w-full flex-1 flex-wrap items-center justify-center">
        {content ?? (
          <p className="flex w-full flex-wrap items-center justify-center gap-1 text-center text-body-sm text-muted-foreground max-2xl:text-caption">
            Connect
            <Button variant="link" className="gap-1 px-1! text-[length:inherit] text-foreground" onClick={onConnect}>
              {providerName || "Wearable, App, or Device"}
              <ArrowUpRight className="size-3" />
            </Button>
            to measure your {title}
          </p>
        )}
      </div>
    </Card>
  );
});

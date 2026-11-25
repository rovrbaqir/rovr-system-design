import * as React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Cards share the row evenly and scroll sideways once each would be narrower than 160px. */
const cardSize = "min-w-[160px] flex-1 basis-0";
const cardBox = "gap-1 rounded-lg bg-surface px-3 py-2.5";
/** The app's smallest text step, used for the line under a figure. */
const micro = "text-[0.6875rem] leading-[1.45]";

/* ------------------------------------------------------------------ */
/* KpiCard                                                             */
/* ------------------------------------------------------------------ */

export interface KpiCardProps {
  /** What the figure counts: "Clean claim rate". Truncates on one line. */
  label: string;
  /** The figure. */
  value: React.ReactNode;
  /** Short line under the value: "$96 over 90 days", or a Delta. Its line is kept even when empty, so cards in a row line up. */
  detail?: React.ReactNode;
  /** Small icon at the end of the label row. */
  icon?: React.ReactNode;
  /** Makes the whole card a link to the page behind the number. */
  href?: string;
  className?: string;
}

/** A metric tile: label and icon, the figure, and one line of detail. */
export function KpiCard({ label, value, detail, icon, href, className }: KpiCardProps) {
  const card = (
    <Card
      variant="outline"
      className={cn(cardBox, href ? "h-full transition-colors duration-(--dur-fast) ease-out group-hover/kpi:border-[color-mix(in_oklab,var(--brand)_50%,transparent)]" : cardSize, className)}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <p className="truncate text-caption text-muted-foreground">{label}</p>
        {icon ? (
          <span aria-hidden className="shrink-0 text-accent-foreground [&>svg]:size-3.5">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="text-title-md text-data text-foreground">{value}</p>
      {/* Always reserve the line so cards in a row line up. */}
      <p className={cn("min-h-4 truncate text-muted-foreground", micro)}>{detail ?? " "}</p>
    </Card>
  );

  return href ? (
    // The ring is drawn inside the card: a KpiRow scrolls, and would clip a ring drawn outside.
    <a href={href} className={cn("group/kpi block rounded-lg rovr-focus focus-visible:-outline-offset-2!", cardSize)}>
      {card}
    </a>
  ) : (
    card
  );
}

/* ------------------------------------------------------------------ */
/* KpiRow                                                              */
/* ------------------------------------------------------------------ */

/** A horizontal strip of KpiCards. The cards share the width and the row scrolls sideways when it is too narrow. */
export const KpiRow = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(function KpiRow({ className, ...props }, ref) {
  return <section ref={ref} className={cn("flex h-fit w-full max-w-full items-stretch justify-start gap-2 overflow-x-auto", className)} {...props} />;
});

export interface KpiRowSkeletonProps {
  /** How many placeholder cards to show. Match the number of cards that will load. */
  count?: number;
  className?: string;
}

/** A KpiRow of placeholders with the card's surface, padding and three lines, so the figures land where the placeholders were. */
export function KpiRowSkeleton({ count = 4, className }: KpiRowSkeletonProps) {
  return (
    <KpiRow role="status" aria-busy aria-label="Loading metrics" className={className}>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} variant="outline" className={cn(cardBox, cardSize, "gap-1.5")}>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-2/3 rounded-xs" />
            <Skeleton className="size-3.5 rounded-xs" />
          </div>
          <Skeleton className="h-5 w-16 rounded-xs" />
          <Skeleton className="h-2.5 w-1/2 rounded-xs" />
        </Card>
      ))}
    </KpiRow>
  );
}

/* ------------------------------------------------------------------ */
/* MetricsStrip                                                        */
/* ------------------------------------------------------------------ */

export interface Metric {
  /** Stays on one line. Also the key, so labels must be unique in a strip. */
  label: string;
  value: React.ReactNode;
  /** Optional line under the value. */
  detail?: React.ReactNode;
}

export interface MetricsStripProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: Metric[];
}

/** A label-over-value strip for the inside of a section card. Metrics share the width and wrap once each would be narrower than 88px. */
export const MetricsStrip = React.forwardRef<HTMLDivElement, MetricsStripProps>(function MetricsStrip({ metrics, className, ...props }, ref) {
  return (
    <Card ref={ref} variant="sunken" className={cn("flex-row flex-wrap gap-x-4 gap-y-3 px-3 py-3", className)} {...props}>
      {metrics.map((metric) => (
        <div key={metric.label} className="min-w-[88px] flex-1 basis-0">
          <p className={cn("whitespace-nowrap text-muted-foreground", micro)}>{metric.label}</p>
          <p className="mt-1 text-label text-data text-foreground">{metric.value}</p>
          {metric.detail ? <p className={cn("text-muted-foreground", micro)}>{metric.detail}</p> : null}
        </div>
      ))}
    </Card>
  );
});

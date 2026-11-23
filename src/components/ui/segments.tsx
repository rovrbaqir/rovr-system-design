import { cn } from "@/lib/utils";

export interface SegmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How many of the segments are filled. */
  value: number;
  total: number;
  /** Names what is being counted, e.g. "Setup steps". */
  label: string;
  tone?: "primary" | "on-aurora";
}

/**
 * Progress as a row of equal segments, one per step. Reads as "3 of 9" at
 * a glance where a continuous bar would only say "about a third".
 */
export function Segments({ value, total, label, tone = "primary", className, ...props }: SegmentsProps) {
  const filled = Math.max(0, Math.min(total, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={filled}
      aria-valuetext={`${filled} of ${total}`}
      className={cn("flex h-1.5 w-full gap-1", className)}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional and never reorder
          key={i}
          className={cn(
            "h-full flex-1 rounded-full transition-colors duration-(--dur-slow)",
            tone === "primary" ? (i < filled ? "bg-primary" : "bg-border-strong") : i < filled ? "bg-white" : "bg-white/25",
          )}
        />
      ))}
    </div>
  );
}
